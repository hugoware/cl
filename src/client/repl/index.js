
(() => {
	'use strict';

	// shared state
	const $state = { };

	// UI elements
	const $output = document.getElementById('output');
	const $input = document.getElementById('input');
	const $error = document.getElementById('error');
	const $question = document.getElementById('question');
	const $code = document.getElementById('code');

	// tracking intervals and timeouts
	const $active = { intervals: [ ], timeouts: [ ] };
	const $setInterval = window.setInterval;
	const $setTimeout = window.setTimeout;

	// capture all interval setting
	window.setInterval = (...args) => {
		const id = $setInterval.apply(window, args);
		$active.intervals.push(id);
	};

	// capture all timeouts
	window.setTimeout = (...args) => {
		const id = $setTimeout.apply(window, args);
		$active.timeouts.push(id);
	};

	// access the notify function
	function notify(name, ...args) {
		const event = new Event('preview-message');
		event.name = name;
		event.args = args;
		window.top.dispatchEvent(event);
	}


	window.addEventListener('unhandledrejection', () => {
		$log('uh1');
	});

	window.addEventListener('unhandledexception', () => {
		$log('uh2');
	});

	// displays an error message
	function showError(ex) {
		$log('will show', ex);

	}

	// // there was an exception 
	// window.addEventListener('error', err => {
	// 	console.log('got erro', err);
	// });

	// window.onerror = function() {
	// 	console.log('handle global error');
	// };
	
	// listen for the enter key
	$input.addEventListener('keyup', event => {

		// don't bother unless confirming a command
		if (!$state.promptCallback || event.keyCode !== 13) 
			return;

		// invoke the callback
		try {
			removeClass(document.body, 'has-question');
			removeClass(document.body, 'needs-input');
			
			// get the input value
			let value = trim(event.target.innerText.replace(/\n*$/g, ''));

			// check for special cases
			if (/^true$/i.test(value))
				value = true;
			else if (/^false$/i.test(value))
				value = false;
			if (/^\-?\d+(\.\d?)?$/.test(value))
				value = parseFloat(value);
			
			// give back the value
			$state.promptCallback(value);
		}
		// always clean up
		finally {
			delete $state.promptCallback;
			return false;
		}

	});

	// reset the view before executing code
	function reset() {
		removeClass(document.body, 'has-question');
		removeClass(document.body, 'has-error');

		// reset the state
		for (const id in $state)
			delete $state[id];

		// remove all timers and intervals
		const max = Math.max($active.intervals.length, $active.timeouts.length);
		for (let i = max; i-- > 0;) {
			clearTimeout($active.timeouts[i]);
			clearInterval($active.intervals[i]);
			$active.timeouts.splice(i, 1);
			$active.intervals.splice(i, 1);
		}

		// clear the console messages, etc
		$output.innerHTML = '';
	}

	// write log messages to the output
	const $log = console.log;
	console.$log = $log;
	console.log = (...args) => {
		if (/polling!|onload!/.test(args[0]))
			return $log.apply(console, args);
		appendLine('line', ...args);
	};


	// handles executing waiting code
	function runCode(code) {
		$code.innerText = code;
		eval(code);
	}

	// appends styles messages
	function appendLine(style, ...args) {
		const line = document.createElement('div');
		line.className = style;
		line.innerText = args.join(' ');
		$output.appendChild(line);

		// move to the bottom of the view after anytime
		// a message is added to the screen
		$setTimeout(() => window.scrollTo(0, Number.MAX_SAFE_INTEGER));
	}

	window.__CODELAB__ = {

		// handles exceptions in code execution
		handleError: ex => {

			// get only the main error
			const lines = (ex || '').toString().split(/\n/g);
			for (let i = lines.length; i-- > 0;) {
				const line = lines[i];
				if (/^\s+at\s+/.test(line))
					lines.splice(i, 1);
			}

			// display the error
			addClass(document.body, 'has-error');
			$error.innerText = lines.join('\n');
		},

		// waits for a user prompt
		prompt: (question, callback) => {
			question = trim(question);

			// asking for user input
			addClass(document.body, 'needs-input');

			// display the question, if possible
			if (question.length) {
				addClass(document.body, 'has-question');
				$question.innerText = question;
			}
			// no question to display
			else removeClass(document.body, 'has-question');

			// handle the callback
			$input.innerText = '';
			$input.focus();
			$state.promptCallback = callback;
		},

		// prepares to execute code
		prepare: msg => {
			reset();
			appendLine('line start', msg);
		},

		// clear the view
		clear: () => {
			reset();
		},

		// kicks off a code request
		run: code => runCode(code),

		// notify when finished executing code
		end: () => {
			notify('execution-finished');
			appendLine('line end', 'Program finished...')
		}

	};

	// trims a string
	function trim(str) {
		return (str || '').replace(/^ *| *$/g, '');
	}

	// removes a class name, if found
	function removeClass(element, css) {
		const props = (element.className || '').split(/ +/g);
		for (let i = props.length; i-- > 0;) {
			if (props[i] === css)
				props.splice(i, 1);
		}

		element.className = props.join(' ');
	}

	// adds a class name, as required
	function addClass(element, css) {
		element.className = `${element.className || ''} ${css}`;
	}

})();