import $ from 'cash-dom';
const MAX_CONSOLE_LINES = 300;

// trims a string
function trim(str) {
	return (str || '').replace(/^(\n|\t|\s)*|(\n|\t|\s)*$/g, '');
}

// helpers
$.isObject = obj => {
	return obj instanceof Object || typeof obj === 'object';
};

// handles running code
export default class CodeRunner {

	/** loads a new code runner instance */
	static create = action => {
		$(() => {
			const instance = new CodeRunner();
			instance.init();
			if (action) action(instance);
		});
	}

	// initializes the runner
	init = () => {
		window.__CODELAB__ = {};

		// UI elements
		this.ui = {
			doc: $(document.body),

			// ui elements
			output: $('#output'),
			input: $('#input'),
			error: $('#error'),
			question: $('#question'),
		};

		// link up inputs
		this.ui.input.on('keyup', this.onInput);

		// tracking intervals and timeouts
		this.timing = {

			// cache active timers
			active: { intervals: [], timeouts: [] },

			// capture existing methods
			setInterval: window.setInterval,
			setTimeout: window.setTimeout,
		};

		// replace timer functions
		window.setInterval = this.setInterval;
		window.setTimeout = this.setTimeout;

		// setup handlers
		__CODELAB__.consoleLog = this.onConsoleLog;
		__CODELAB__.consoleWarn = this.onConsoleWarn;
		__CODELAB__.consoleError = this.onConsoleError;
		__CODELAB__.consolePrompt = this.onConsolePrompt;
		__CODELAB__.consoleClear = this.onConsoleClear;
		__CODELAB__.consoleSuccess = this.onConsoleSuccess;
		__CODELAB__.consoleInfo = this.onConsoleInfo;
		__CODELAB__.consoleImage = this.onConsoleImage;
		__CODELAB__.consoleRainbow = this.onConsoleRainbow;
		__CODELAB__.consoleShake = this.onConsoleShake;
		__CODELAB__.handleException = this.onHandleException;

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
		eval(code);
	}

	// handles ending execution
	onEnd = () => {
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
		path = trim(path);
		if (path[0] === '/')
			path = (__CODELAB__.projectUrl || window.location.href) + path;
		
		// when ready to show
		img.onload = () => {
			img.className = 'console-image';
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
		if (!__CODELAB__.onPromptCallback)
			return;

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

			// give back the value
			__CODELAB__.onPromptCallback(value);
		}
		// always clean up
		finally {
			delete __CODELAB__.onPromptCallback;
			return false;
		}
	}

	// when a user asks for input
	onConsolePrompt = (question, callback) => {
		question = trim(question);

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
		__CODELAB__.onPromptCallback = callback;
	}

	// some shortcuts
	clear = () => this.onClear()
	load = msg => this.onLoad(msg)
	run = code => this.onRun(code)
	end = () => this.onEnd()

	// capture all interval setting
	setInterval = (...args) => {
		const id = this.timing.setInterval.apply(window, args);
		this.timing.active.intervals.push(id);
	}

	// capture all timeouts
	setTimeout = (...args) => {
		const id = this.timing.setTimeout.apply(window, args);
		this.timing.active.timeouts.push(id);
	}

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
		this.timing.setTimeout.call(window, function () {
			window.scrollTo(0, Number.MAX_SAFE_INTEGER);
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


		// // check if too many appended lines
		// if (++this.totalLines > MAX_CONSOLE_LINES) {
		// 	const output = this.ui.output[0];
		// 	output.removeChild(output.children[0]);
		// }

		// // create the result
		// const line = document.createElement('div');
		// line.className = `${style || ''} line`;

		// // convert to text
		// const render = [ ];
		// for (let i = 0; i < args.length; i++) {
		// 	let str = JSON.stringify(args[i], null, 2);
		// 	if (customize) str = customize(str, i);
		// 	render.push(str);
		// }

		// // append to the container
		// line.innerText = render.join(' ');
		// this.ui.output.append(line);

		// // move to the bottom of the view after anytime
		// // a message is added to the screen
		// this.timing.setTimeout.call(window, function () {
		// 	window.scrollTo(0, Number.MAX_SAFE_INTEGER);
		// });
	}

	// resets the entire view
	reset = () => {
		this.ui.doc.removeClass('has-question has-error');

		// reset the state
		delete __CODELAB__.onPromptCallback;

		// reset the line count
		this.totalLines = 0;

		// remove all timers and intervals
		const { intervals, timeouts } = this.timing.active;
		const max = Math.max(intervals.length, timeouts.length);
		for (let i = max; i-- > 0;) {
			clearTimeout(timeouts[i]);
			clearInterval(intervals[i]);
			timeouts.splice(i, 1);
			intervals.splice(i, 1);
		}

		// clear the console messages, etc
		this.ui.output.empty();
	}

}
