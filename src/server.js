
import _ from 'lodash';
import $http from 'http';
import $express from 'express';
import $session from 'express-session';
import $io from 'socket.io';
import $sioeSession from 'socket.io-express-session';
import $sioFileUpload from 'socketio-file-upload';
import $connect from 'connect-mongo';
import $bodyParser from 'body-parser';
import $cookieParser from 'cookie-parser';

import $config from './config';
import $path from './path';
import $fs from './storage/file-system';
import $database from './storage/database';

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
  const server = $http.createServer(app);

  // general configuration
  app.set('subdomain offset', 1);

  // setup the correct view engine
  app.set('view engine', 'pug');
	app.set('views', 'dist/views');

	instance.io = $io(server);
	instance.app = app;
	instance.server = server;
}


// share public resources
function configureStaticResources(instance) {
  instance.app.use($express.static('./dist/public'));
  configureBraceResources(instance);
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

	_.each(requests, config => {

		// setup the config
		const method = _.trim(config.method || 'all').toLowerCase();
		const actions = [ ];

		// check for incoming data
		if (config.acceptData)
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

		// create the file uploader
		// configureSocketFileUpload(socket);

		// standard success
		socket.ok = (event, ...args) => {
			socket.emit(`${event}:ok`, ...args)
		};
				
		// standard rejection
		socket.err = (event, err, ...args) => {

			// verify the error
			if (!err || !_.isString(err.err)) {
				console.log('unhandled error', err);
				err = { err: 'server_error' };
			}

			socket.emit(`${event}:err`, err, ...args);
		}

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
			const handle = (...args) => {

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



// setup brace resource access
function configureBraceResources(instance) {

  // handle getting new mappings
  const TYPE_MAPPING = {
    pug: 'jade',
    htm: 'html'
  };
  
  // serving file modes
  instance.app.get('/__codelab__/brace/mode/:file', (request, response) => {
    let type = _.trim(request.params.file)
      .replace(/^mode-/i, '')
      .replace(/\.js$/i, '');

    // remap, if needed
    type = TYPE_MAPPING[type] || type;

    // make sure it exists
    let path = resolveRoot(`./node_modules/brace/mode/${type}.js`);
    $fs.exists(path, exists => {

      // not real - just use default text
      if (!exists)
        path = resolveRoot(`./node_modules/brace/mode/text.js`);

      // send the mode
      response.type('text/javascript');
      response.sendFile(path);
    });
  });

}


// kick off the http server
function startServer(instance) {
  instance.server.listen($config.httpPort, () => {
    console.log(`[listening] :${$config.httpPort}`);
  });
}

export default new WebServer();