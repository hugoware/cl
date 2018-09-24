import $ from 'cash-dom';
const MAX_CONSOLE_LINES = 300;

// trims a string
function trim(str) {
	return (str || '').replace(/^(\n|\t|\s)*|(\n|\t|\s)*$/g, '');
}

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

	// writes output
	writeOutput = (style, args) => {
		args = $.isArray(args) ? args : [args];

		// check if too many appended lines
		if (++this.totalLines > MAX_CONSOLE_LINES) {
			const output = this.ui.output[0];
			output.removeChild(output.children[0]);
		}

		// create the result
		const line = document.createElement('div');
		line.className = `${style || ''} line`;
		line.innerText = args.join(' ');
		this.ui.output.append(line);

		// move to the bottom of the view after anytime
		// a message is added to the screen
		this.timing.setTimeout.call(window, function () {
			window.scrollTo(0, Number.MAX_SAFE_INTEGER);
		});
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
