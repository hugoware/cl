
import Interpreter from 'js-interpreter';

export default class CodeInterpreter {

	constructor(code) {
		const instance = this;

		// tracking events
		this.events = {};

		// check that there's some code here
		this.hasCode = (code || '').toString().replace(/\W+/g, '').length > 0;

		// create the code execution
		this.interpreter = new Interpreter(code, (interpreter, scope) => {
			this.scope = scope;

			// standard sync event handler
			interpreter.createEventHandler = function (key) {
				return interpreter.createNativeFunction(function () {
					const args = extractArgs(arguments);
					instance.triggerEvent(key, args);
				});
			};

			// standard async event handler
			interpreter.createAsyncEventHandler = function (key) {
				return interpreter.createAsyncFunction(function () {
					let args = [].slice.apply(arguments);
					instance.callback = args.pop();
					args = extractArgs(args);
					instance.pause();
					instance.triggerEvent(key, args);
				});
			};

			// initialize
			handleInit(this, interpreter, scope);
		});
	}

	// holds execution
	pause() {
		this.paused = true;
	}

	// continues execution
	resume() {

		const isPaused = !!this.paused;
		if (!isPaused)
			console.warn('resume without pause?');

		// check for a callback
		if (this.callback) {
			const args = [];
			for (let i = 0, total = arguments.length; i < total; i++)
				args.push(this.interpreter.createPrimitive(arguments[i]));
			this.callback.apply(null, args);

			// clear the callback
			delete this.callback;
		}

		// undo the pause event
		this.paused = false;

		// start executing again
		if (isPaused)
			this.run();
	}

	triggerEvent(key, args) {
		const handler = this.events[key];
		if (handler) handler.apply(null, args);
	}

	// attaches an event handler
	on(key, action) {
		this.events[key] = action;
	}

	// finds a value
	get(path) {
		path = path.split('.');
		let context = this.interpreter.global;
		for (let i = 0, total = path.length; i < total; i++) {

			// check for array indexes
			let key;
			const segment = path[i].replace(/\[[^\]]+\]$/, indexed => {
				key = indexed.substr(1, indexed.length - 2);
				return '';
			});

			// console.log(context, segment);
			context = context && context.properties && context.properties[segment];
			if (key && context) context = context && context.properties && context.properties[key];

			if (!context) return null;
		}

		// flatten object
		return flatten(context);
	}

	// executes the code until set to wait
	run() {
		const limit = ts(2000);

		// checks for an error flag and throws an exception - this
		// could be caused by parser errors
		if (this.error) {
			this.finished = true;

			// raise the error
			this.triggerEvent('error', [ this.error ]);
			return;
		}

		// handle any errors
		try {
			while (true) {
				
				// code has run for too long without response
				if (ts() > limit) {
					const error = new Error('Execution timeout: The running code appears to be stuck in an infinite loop or recursive function.');
					error.timeout = true;
					throw error;
				}

				// running till finished
				this.finished = !this.interpreter.step();
				if (this.finished || this.paused) break;
			}
			
			// finished running
			if (this.finished)
				this.triggerEvent('finished');
		}
		// handle errors
		catch (ex) {
			this.finished = true;
			this.triggerEvent('error', [ ex ]);
		}
	}

}


// converts a vm object to a usable JavaScript object
function flatten(context) {

	// just basic data
	if ('data' in context)
		return context.data;

	// complex object -- possibly an array or object
	else if (context.properties) {

		// check for some special cases
		if (context.type === 'function')
			return Function;

		// check the properties
		const isArray = context.parent.notEnumerable.isArray;
		const obj = isArray ? [] : {};
		for (let key in context.properties)
			obj[isArray ? 0 | key : key] = flatten(context.properties[key]);
		return obj;
	}

}

// loads in standard core functions
function initCore(instance, interpreter, scope) {
	const delay = interpreter.createEventHandler('set-timeout');
	interpreter.setProperty(scope, 'delay', delay, Interpreter.NONENUMERABLE_DESCRIPTOR);
}

// includes common console commands
function initConsole(instance, interpreter, scope) {
	const runnerConsole = interpreter.createObject(interpreter.OBJECT);

	// logging
	const log = interpreter.createEventHandler('console-log');
	const warn = interpreter.createEventHandler('console-warn');
	const error = interpreter.createEventHandler('console-error');
	const info = interpreter.createEventHandler('console-info');
	const success = interpreter.createEventHandler('console-success');
	const shake = interpreter.createEventHandler('console-shake');
	const rainbow = interpreter.createEventHandler('console-rainbow');
	const ask = interpreter.createAsyncEventHandler('console-ask');
	const image = interpreter.createAsyncEventHandler('console-image');

	// sync
	interpreter.setProperty(scope, 'console', runnerConsole, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(scope, 'log', log, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'log', log, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'warn', warn, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'error', error, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'info', info, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'success', success, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'shake', shake, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'rainbow', rainbow, Interpreter.NONENUMERABLE_DESCRIPTOR);

	// async
	interpreter.setProperty(runnerConsole, 'ask', ask, Interpreter.NONENUMERABLE_DESCRIPTOR);
	interpreter.setProperty(runnerConsole, 'image', image, Interpreter.NONENUMERABLE_DESCRIPTOR);
}


// creates a file system helper
function initFileSystem(instance, interpreter, scope) {
	// const fs = interpreter.createObject(Interpreter.OBJECT);
}



// initializes the interpreter
function handleInit(instance, interpreter, scope) {
	instance.state = interpreter.createObject(interpreter.OBJECT);

	initCore(instance, interpreter, scope);
	initConsole(instance, interpreter, scope);
}

// gets a timestamp
function ts(mod) {
	mod = isNaN(mod) ? 0 : mod;
	return (+new Date) + mod;
}

// extract all data
function extractArgs(data) {
	const args = [];

	// check for a complex object
	if (data.properties)
		for (let i = 0; i < data.length; i++)
			args.push(data.properties[i].data);

	// check for an array like value
	else if (data.length)
		for (let i = 0; i < data.length; i++)
			args.push(data[i].data);

	return args;
}


// const runner = new CodeRunner(code);

// // check for setting timeouts
// runner.on('set-timeout', function (time, unit) {
// 	time = isNaN(time) ? 0 : 0 | time;

// 	if (/(s|seconds?)/i.test(unit))
// 		time *= 1000;

// 	else if (/(m|minutes?)/i.test(unit))
// 		time *= 60000;

// 	runner.pause();
// 	setTimeout(() => runner.resume(), time);
// })

// runner.on('console-log', function () {
// 	console.log.apply(console, arguments);
// });

// runner.on('console-ask', args => {
// 	setTimeout(() => runner.resume('super car'), 1000);
// });

// runner.run();