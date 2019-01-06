import $ from 'cash-dom';
import CodeInterpreter from './interpreter';

const MAX_CONSOLE_LINES = 300;
const DEFAULT_OPTIONS = {
	outputSelector: '#output',
	inputSelector: '#input',
	errorSelector: '#error',
	questionSelector: '#question',
};

// trims a string
function trim(str) {
	return (str || '').replace(/^(\n|\t|\s)*|(\n|\t|\s)*$/g, '');
}

// helpers
$.isObject = obj => {
	return obj instanceof Object || typeof obj === 'object';
};

// $.isFunction = obj => {
// 	return obj instanceof Function || typeof obj === 'function';
// }

// handles running code
export default class CodeRunner {

	/** loads a new code runner instance */
	static create = (options, action) => {

		// no options were provided
		if ($.isFunction(options)) {
			action = options;
			options = DEFAULT_OPTIONS;
		}

		// read the runner
		$(() => {
			const instance = new CodeRunner();
			instance.init(options);
			if (action) action(instance);
		});
	}

	// initializes the runner
	init = options => {
		window.__CODELAB__ = {};

		// console input
		this.stdout = [ ];
		this.stdin = [ ];
		
		// UI elements
		this.ui = {
			doc: $(document.body),

			// ui elements
			output: $(options.outputSelector),
			input: $(options.inputSelector),
			error: $(options.errorSelector),
			question: $(options.questionSelector),
		};

		// link up inputs
		this.ui.input.on('keyup', this.onInput);

		// interface for external programs
		__CODELAB__.load = this.onLoad;
		__CODELAB__.run = this.onRun;
		__CODELAB__.end = this.onEnd;
		__CODELAB__.clear = this.onClear;
	}

	// resets the view
	onClear = () => {
		this.reset();
	}

	// prepares to run code
	onLoad = msg => {
		this.reset();
		this.writeOutput('start', msg);
	}

	// kicks off running code
	onRun = code => {
		this.interpreter = new CodeInterpreter(code);
		this.interpreter.on('finished', this.onEnd);
		
		// create handlers
		this.interpreter.on('console-log', this.onConsoleLog);
		this.interpreter.on('console-warn', this.onConsoleWarn);
		this.interpreter.on('console-info', this.onConsoleInfo);
		this.interpreter.on('console-error', this.onConsoleError);
		this.interpreter.on('console-success', this.onConsoleSuccess);
		this.interpreter.on('console-shake', this.onConsoleShake);
		this.interpreter.on('console-rainbow', this.onConsoleRainbow);
		this.interpreter.on('console-ask', this.onConsoleAsk);
		this.interpreter.on('console-image', this.onConsoleImage);
		this.interpreter.on('console-clear', this.onConsoleClear);
		this.interpreter.on('set-timeout', this.onDelay);
		
		// start running the code
		this.interpreter.run();
	}

	// handles ending execution
	onEnd = () => {
		
		// check for ending callbacks
		if ($.isFunction(this.options.onEnd))
			this.options.onEnd(this);

		// finish the program
		this.notify('execution-finished');
		this.writeOutput('end', 'Program finished...')
	}

	// capture printed lines
	onConsoleLog = (...args) => this.writeOutput('', args)
	onConsoleWarn = (...args) => this.writeOutput('warn', args)
	onConsoleError = (...args) => this.writeOutput('error', args)
	onConsoleSuccess = (...args) => this.writeOutput('success', args)
	onConsoleInfo = (...args) => this.writeOutput('info', args)
	
	// special version
	onConsoleRainbow = (...args) => {
		this.writeOutput('rainbow', args, (content, index) => {
			
			// only do rainbows to strings
			if (!$.isString(args[index]))
				return content;

			// write the colors
			let position = 0|(Math.random() * 10);
			const colors = ['r', 'o', 'y', 'g', 'b', 'i', 'v'];
			const container = document.createElement('span');
			const parts = content.split('');
			for (let i = 0, total = parts.length; i < total; i++) {
				const dom = document.createElement('span');
				dom.className = /\W/.test(parts[i]) ? '' : `color-${colors[++position % 7]}`;
				dom.innerText = parts[i];
				container.appendChild(dom);
			}

			return container;
		});
	}

	// another special version
	onConsoleShake = (...args) => {
		this.writeOutput('shake', args, (content, index) => {
			
			// only do rainbows to strings
			if (!$.isString(args[index]))
				return content;

			// write the colors
			const container = document.createElement('span');
			const lead = document.createElement('span');
			container.append(lead);
			const parts = content.split('');
			for (let i = 0, total = parts.length; i < total; i++) {
				const dom = document.createElement('span');
				dom.innerText = parts[i];
				container.appendChild(dom);
			}

			return container;
		});
	}

	// creates an image
	onConsoleImage = path => {
		const img = document.createElement('img');
		img.className = 'console-image loading';

		// check if needing a prefix
		const requestedPath = path = trim(path);
		if (path[0] === '/')
			path = (this.projectUrl || window.location.href) + path;
		
		// when ready to show
		img.onload = () => {
			img.className = 'console-image';
			this.interpreter.resume();
			this.scrollToBottom();
		};

		img.onerror = () => {
			img.parentNode.removeChild(img);
			this.writeOutput('error', `failed to load: ${requestedPath}`);
			this.interpreter.resume();
			this.scrollToBottom();
		};
			
		// set the url
		img.src = path;

		// add the image
		const node = this.nextNode('image');
		node.appendChild(img);
		this.scrollToBottom();
	}

	// clears all messages
	onConsoleClear = () => {
		const output = this.ui.output[0];
		for (let i = output.children.length; i-- > 1;)
			output.removeChild(output.children[i]);
	}

	// listens for exceptions from the code
	onHandleException = ex => {
		const lines = (ex || '').toString().split(/\n/g);
		for (let i = lines.length; i-- > 0;) {
			const line = lines[i];
			if (/^\s+at\s+/.test(line))
				lines.splice(i, 1);
		}

		// display the message
		const message = lines.join('\n');
		this.ui.doc.addClass('has-error is-finished');
		this.ui.error.text(message);
	}

	// handles when input is received
	onInput = event => {
		if (event.keyCode !== 13) return;
		this.onCommit(event.target.innerText)
	}

	// handle input entry
	onCommit = value => {
		if (!this.interpreter.paused)
			return;
		// if (!__CODELAB__.onPromptCallback)
		// 	return;

		// invoke the callback
		try {
			this.ui.doc.removeClass('has-question needs-input');

			// get the input value
			value = trim(value);

			// check for special cases
			if (/^true$/i.test(value))
				value = true;
			else if (/^false$/i.test(value))
				value = false;
			if (/^\-?\d+(\.\d?)?$/.test(value))
				value = parseFloat(value);

			// save to the output
			this.stdin.push(value);

			// give back the value
			this.interpreter.resume(value);
		}
		// always clean up
		finally {
			return false;
		}
	}

	// when a user asks for input
	onConsoleAsk = (question, callback) => {
		question = trim(question);

		// notify of asked values
		if (this.options.onAsk)
			this.options.onAsk(question);

		// asking for user input
		this.ui.doc.addClass('needs-input');

		// display the question, if possible
		if (question.length) {
			this.ui.doc.addClass('has-question');
			this.ui.question.text(question);
		}
		// no question to display
		else this.ui.doc.removeClass('has-question');

		// handle the callback
		this.ui.input.text('');
		this.ui.input[0].focus();
	}

	// handles timeout delays
	onDelay = (time, unit) => {
		this.interpreter.pause();
		
		// determine the time
		time = isNaN(time) ? 0 : 0 | time;
		if (/(s|seconds?)/i.test(unit))
			time *= 1000;
		else if (/(m|minutes?)/i.test(unit))
			time *= 60000;

		// resume the work
		setTimeout(() => this.interpreter.resume(), time);
	}

	// some shortcuts
	clear = () => this.onClear()
	load = msg => this.onLoad(msg)
	end = () => this.onEnd()
	run = (code, options = { }) => {
		this.options = options;

		// starts the run process
		this.onRun(code);
	}

	// // capture all interval setting
	// setInterval = (...args) => {
	// 	const id = this.timing.setInterval.apply(window, args);
	// 	this.timing.active.intervals.push(id);
	// }

	// // capture all timeouts
	// setTimeout = (...args) => {
	// 	const id = this.timing.setTimeout.apply(window, args);
	// 	this.timing.active.timeouts.push(id);
	// }

	// raises an event, if possible
	notify = (name, ...args) => {
		const event = new Event('preview-message');
		event.name = name;
		event.args = args;
		(window.top || window).dispatchEvent(event);
	}

	// move to the bottom of the view after anytime
	// a message is added to the screen
	scrollToBottom = () => {
		const output = this.ui.output[0];
		setTimeout.call(window, function () {
			output.scrollTo(0, Number.MAX_SAFE_INTEGER);
		});
	}

	// grabs the next node
	nextNode = style => {

		// check if too many appended lines
		if (++this.totalLines > MAX_CONSOLE_LINES) {
			const output = this.ui.output[0];
			output.removeChild(output.children[0]);
		}

		// create the result
		const line = document.createElement('div');
		line.className = `${style || ''} line`;
		this.ui.output.append(line);

		// move to the bottom of the output
		this.scrollToBottom();
		return line;
	}

	// writes output
	writeOutput = (style, args, customize) => {
		args = $.isArray(args) ? args : [args];
		const node = this.nextNode(style);

		// adds a new line of arguments
		this.stdout.push(args);

		// append each value
		for (let i = 0; i < args.length; i++) {

			// get the data to
			let arg = args[i];
			if ($.isArray(arg) || $.isObject(arg))
				arg = JSON.stringify(arg, null, 2);

			// attach this to the document
			const content = customize ? customize(arg, i) : (arg || 'null').toString();
			if ($.isString(content)) {
				const item = document.createElement('span');
				item.className = 'item';
				node.innerText = content;
			}
			// anything else, assume DOM element?
			else node.appendChild(content);

		}

		// update the scroll position
		this.scrollToBottom();
	}

	// resets the entire view
	reset = () => {
		this.ui.doc.removeClass('has-question has-error');

		// reset the state
		delete this.options;
		this.stdout = [ ];
		this.stdin = [ ];

		// reset the line count
		this.totalLines = 0;

		// // remove all timers and intervals
		// const { intervals, timeouts } = this.timing.active;
		// const max = Math.max(intervals.length, timeouts.length);
		// for (let i = max; i-- > 0;) {
		// 	clearTimeout(timeouts[i]);
		// 	clearInterval(intervals[i]);
		// 	timeouts.splice(i, 1);
		// 	intervals.splice(i, 1);
		// }

		// clear the console messages, etc
		this.ui.doc.removeClass('has-question needs-input');
		this.ui.output.empty();
	}

}
