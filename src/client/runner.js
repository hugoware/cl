
import jailed from 'jailed';

/** handles executing code in a controlled manner */
export default class Runner {

	constructor() {

		// this.context = { };
		this.events = { };

		// create the maching that runs the code
		this.machineContext = { };
		this.machine = new debugjs.Machine(this.machineContext);

		// create some error handlers
		this.machine.on('error', err => { 
			console.log('error', err);
		});

		this.machine.on('err', err => { 
			console.log('err', err);
		});
	}

	/** returns the window object to communicate with */
	get context() {
		const win = this.machine.context.iframe.contentWindow;
		const context = win.__CODELAB_DATA__ = win.__CODELAB_DATA__ || { };
		return context;
	}

	/** registers a handler for an event */
	registerEvent = (name, callback) => {
		this.events[name] = callback;
	}

	/** loads and prepares the code to be executed
	 * @param {string} code the code that should be loaded
	 */
	load = code => {

		// prepare the code to run
		code = extendCode(code);
		this.blob = new Blob([code], { type: "application/javascript" });
	}

	/** begin code execution
	 * @param {string} code the javascript code to run
	 */
	run = () => {

		// execute the code
		this.worker = new Worker(URL.createObjectURL(this.blob));

		// listen for API actions
		this.worker.onmessage = function (m) {


			console.log("msg", m);
		};

		
	}

	/** stops code execution */
	pause = () => {
		this.paused = true;
	}

	/** continues the code execution and sets any results  */
	resume = result => {
		this.paused = false;
		this.context.event = null;
		this.context.result = result;
		this.run();
	}

	/** stop all execution for the code */
	stop = () => {
		this.stopped = true;
		console.log('clear/dispose');
	}

}


// sanitize code requests
function extendCode(code) {
	return `

var ___self = self;

___self.pending = { };

// send out the request
___self.request = function(command, args, callback) {
	return new Promise(function(resolve) {
		const options = {
			command: command,
			args: args,
			callback: callback
		};
		
		// save the return call
		___self.pending[options.command] = {
			options: options,
			resolve: resolve
		};

		// post the message
		___self.postMessage(options.command, options.args);
	});
};

// listen for messages
___self.onmessage = function (message) {

	// check if it is a resolve for a promise
	var pending = ___self.pending[message.command];
	if (!!pending) {
		delete ___self.pending[message.command];
		pending.resolve(message.args);

		// resolve(message.args);
	}

};

(async () => {

	// include libraries

	const IO = { };
	IO.read = async function(message) {
		return ___self.request('request_user_input', [message]);
	}

});

var $bridge = function (key) {
	window.__CODELAB_DATA__.args = [].slice.call(arguments, 1);
	window.__CODELAB_DATA__.event = key;
	return window.__CODELAB_DATA__.result;
};

var IO = { 
	read: function(str) {
		return $bridge('request_user_input', str);
	},

	write: function() {
		console.log.apply(console, arguments);
	}
}

${code}

});`;

	
}


// var $bridge = function (key) {
// 	window.__CODELAB_DATA__.args = [].slice.call(arguments, 1);
// 	window.__CODELAB_DATA__.event = key;
// 	return window.__CODELAB_DATA__.result;
// };

// var ask = function (message) {
// 	return $bridge('request_user_input', message);
// }

// var Network = {

// 	xhr: url => {
// 		return $bridge('request_user_input', url)
// 	}
// };

// var Fancy = /** @class */ (function () {
// 	var Fancy = function () {
// 	}
// 	Fancy.prototype.greet = function (name) {
// 		console.log('hello', name);
// 	};
// 	return Fancy;
// }());

// var fancy = new Fancy();
// var name = ask('what is your name?');
// fancy.greet(name);

// var weather = Network.xhr('http://weather/json');
// fancy.greet(weather);
