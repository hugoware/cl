
import _ from 'lodash';
import $http from 'http';
import $https from 'https';
import $express from 'express';
import $session from 'express-session';
import $io from 'socket.io';
import $sioeSession from 'socket.io-express-session';
import $multiparty from 'multiparty';
import $connect from 'connect-mongo';
import $bodyParser from 'body-parser';
import $cookieParser from 'cookie-parser';

import $config from './config';
import $path, { resolveLesson, resolveAudio } from './path';
import $fs from './storage/file-system';
import $fsx from 'fs-extra';
import $database from './storage/database';

// checking user access
import userHasPermissions from './queries/user-has-permissions';

// session storage
const MongoStore = $connect($session)

// http parsers
const $parsers = {
  url: $bodyParser.urlencoded({ extended: false }),
  json: $bodyParser.json()
};

// web server instance
class WebServer {
	
	// handles starting the web server
	async init() {
		
		// find the requests used
		const requests = await gatherRequests();

		// setup server
		createHttpServer(this);
		configureBraceResources(this);
		configureStaticResources(this);
		configureSessions(this);
		configureHttpRequests(this, requests.http);
		configureSocketRequests(this, requests.socket);
		startServer(this);

		return Promise.resolve(true);
	}

}


// create the web server
function createHttpServer(instance) {
	const app = $express();

	// create the correct server
	let server;
	let redirectToHttps;
	if ($config.isDevelopment) {
		server = $http.createServer(app);
	}
	// production server
	else {

		// load certificates
		const keyPath = $path.resolveRoot($config.sslKey);
		const certPath = $path.resolveRoot($config.sslCert);
		const caPath = $path.resolveRoot($config.sslCA);
		const key = $fsx.readFileSync(keyPath, 'utf8');
		const cert = $fsx.readFileSync(certPath, 'utf8');
		const ca = $fsx.readFileSync(caPath, 'utf8');

		// missing certs
		if (!(key && cert && ca))
			throw 'missing secure certificates!';

		// create the server
		server = $https.createServer({ key, cert, ca }, app);

		// redirect non-secure requests
		redirectToHttps = $http.createServer((request, response) => {
			response.writeHead(301, {
				Location: `https://${request.headers['host']}${request.url}`
			});
			response.end();
		});
	}

  // general configuration
  app.set('subdomain offset', 1);

  // setup the correct view engine
  app.set('view engine', 'pug');
	app.set('views', 'dist/views');

	instance.io = $io(server);
	instance.app = app;
	instance.server = server;
	instance.redirectToHttps = redirectToHttps;
}

// share public resources
function configureStaticResources(instance) {
  instance.app.use('/__codelab__/lessons', $express.static(resolveLesson()));
  instance.app.use('/__codelab__/speak', $express.static(resolveAudio()));
  instance.app.use('/__codelab__', $express.static('./dist/resources/public'));
}

// accessing resources for the brace editor
function configureBraceResources(instance) {
	const modes = $path.resolveModule(`brace/mode`);
	instance.app.get(`/__codelab__/ace/mode-*.js`, (request, response) => {
		const type = _.trim(request.params[0]).replace(/[^a-z0-9]/g, '');
		response.sendFile(`${modes}/${type}.js`);
	});

	instance.app.use('/__codelab__/ace/snippets/', $express.static('./node_modules/brace/snippets'));
}

// reads parsed form data
function parseForm(request, response, next) {
	const form = new $multiparty.Form();
	form.parse(request, (err, fields, files) => {
		if (err)
			request.form = { error: err };
		
		// create the form data
		else request.form = {
			fields, files,
			get: (path, fallback) => _.get(request.form, path, fallback)
		};

		next();
	});
	
}

// checks if a user has required permissions
async function checkUserPermissions(session, permissions) {
	return new Promise(async (resolve, reject) => {
		try {
			const user = _.trim((session && session.user) || '');
			const allow = await userHasPermissions(user, permissions);

			// check if they can access this response
			if (!allow) reject();
			else resolve();
		}
		catch (err) {
			return reject();
		}
	})

}

// setup a handler for required permissions to view a page
function setupRequestPermissionHandler(permissions) {
	return async function(request, response, next) {
		try {
			await checkUserPermissions(request.session, permissions);
			next();
		}
		catch (err) {
			as404(response);
		}
	}
}

// store user sessions in Mongo
function configureSessions(instance) {
	const { app, io } = instance;
	const { db } = $database;

  // setup cookie parser first
  app.use($cookieParser());

  // then handle tracking sessions
  // don't create session until something stored
  // don't save session if unmodified
  const session = $session({
    key: 'codelab',
    cookie: { secure: $config.isProduction },
    secret: $config.sessionSecret,
    saveUninitialized: false, 
    resave: true, 
    store: new MongoStore({ db }),
  });

	// special setup for production
  if ($config.isProduction)
    app.set('trust proxy', 1);

  // setup session use for requests and socket.io
	app.use(session);

	// allow sessions to be accessed from web sockets
	const socketIoSession = $sioeSession(session);
  io.use(socketIoSession);
}


// finds all web server request endpoints
async function gatherRequests() {

	// searches for requests
	const location = $path.resolvePath('/requests');
	const files = await $fs.find(location, ['.js']);
	const requests = { http: [], socket: [] };

	// gather each of the configs first
	_(files)
		.map(file => {
			file = file.replace(/^\/+/, '');
			return file.substr(0, file.length - 3);
		})
		.map(module => require(`./requests/${module}`))
		.sortBy(config => 'priority' in config ? 0 | config.priority : 100)
		.each(config => {

			// notify when a handler was missing (possibly accidental)
			if (!_.isFunction(config.handle) && (config.event || config.route))
				console.warn('[warn] missing handler for', config.name || config.event || config.route);

			// check for exclusion
			if (config.disabled || !_.isFunction(config.handle))
				return;

			// check the category
			if ('event' in config) {
				console.log('[socket]', config.name ? `(${config.name}) ${config.event}` : config.event);
				requests.socket.push(config);
			}
			else if ('route' in config) {
				console.log('[route]', config.name ? `(${config.name}) ${config.route}` : config.route);
				requests.http.push(config);
			}
		});
	
	// return Promise.resolve(requests);
	return requests;
}


// configure general HTTP requests
function configureHttpRequests(instance, requests) {
	const { app } = instance;

	_(requests)
		.each(config => {

			// setup the config
			const method = _.trim(config.method || 'all').toLowerCase();
			const actions = [ ];

			// adding permission requirements
			if (config.permissions)
				actions.push(setupRequestPermissionHandler(config.permissions));

			// check for incoming files
			if (config.acceptForm)
				actions.push(parseForm);

			// check for incoming data
			else if (config.acceptData)
				actions.push($parsers.url, $parsers.json);

			// finally, add the request handler
			actions.push(config.handle);

			// assign the action
			app[method].apply(app, [ config.route, ...actions ]);
		});
}


// configures socket.io requests
function configureSocketRequests(instance, requests) {
	
	// handle the connection
	instance.io.on('connection', socket => {
		const { session } = socket.handshake;

		// standard success
		socket.ok = (event, ...args) => {
			socket.emit(`${event}:ok`, ...args)
		};
				
		// standard rejection
		socket.err = (event, err, ...args) => {
			socket.emit(`${event}:err`, err, ...args);
		};

		// find standard events
		const onConnect = _.find(requests, config => config.event === 'connect');

		// handle connections and disconnects
		if (onConnect)
			onConnect.handle.call(null, socket, session);

		// setup each event
		_.each(requests, config => {

			// make sure this isn't a special or reserved event
			if (config.event === 'connect') return;

			// create the handler
			const handle = async (...args) => {

				// has permission requirements
				if (config.permissions) {
					try {
						await checkUserPermissions(session, permissions);
					}
					catch (err) {
						socket.emit(`not-found`);
						return;
					}
				}

				// the user does not appear to be logged in
				if (config.authenticate && !session.user) {
					socket.emit(`login-required`);
					socket.emit(`${config.event}:err`, 'login_required');
					return;
				}

				// it's okay to use the handler
				config.handle(socket, session, ...args);
			};

			// setup the handler
			socket.on(config.event, handle);
		});
	});

}

// handles returning the 404 page
function as404(response) {
	response.status(404);
	response.render('site/missing');
}

// kick off the http server
function startServer(instance) {
	const { server } = instance;

	// start servers
	if ($config.isDevelopment) {
		console.log(`[development mode]`);
		
		// start in dev mode
		server.listen($config.httpPort, () => {
			console.log(`[server] started at http://localhost:${$config.httpPort}`);
		});

	}
	// use production
	else {
		console.log('[production mode]');

		// start the secure server
		server.listen(443, () => {
			console.log(`[server] started at https://localhost:443`);
		});

		// start the redirect server
		instance.redirectToHttps.listen(80, () => {
			console.log(`[server] redirecting to https from http://localhost:80`);
		});

	}

}

export default new WebServer();