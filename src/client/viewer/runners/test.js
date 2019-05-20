

export default class TestRunner {

	constructor(runner) {
		this.runner = runner;
	}

	get interpreter() {
		return this.runner.interpreter;
	}

	init = () => {
		this.stdout = [];
		this.stdin = [];
		this.alerts = [];
	}

	// prepare to run
	register = interpreter => {
		interpreter.registerAll([

			{ name: 'log',
				scope: 'console',
				action: this.onConsoleLog },

			{ name: 'warn',
				scope: 'console',
				action: this.onConsoleWarn },

			{ name: 'info',
				scope: 'console',
				action: this.onConsoleInfo },

			{ name: 'error',
				scope: 'console',
				action: this.onConsoleError },

			{ name: 'success',
				scope: 'console',
				action: this.onConsoleSuccess },

			{ name: 'shake',
				scope: 'console',
				action: this.onConsoleShake },

			{ name: 'rainbow',
				scope: 'console',
				action: this.onConsoleRainbow },

			{ name: 'ask',
				scope: 'console',
				action: this.onConsoleAsk },

			{ name: 'image',
				scope: 'console',
				action: this.onConsoleImage },

			{ name: 'clear',
				scope: 'console',
				action: this.onConsoleClear },

			{ name: 'alert',
				action: this.onAlert },

		]);

		// include tests, if needed
		if (this.runner.tests)
			interpreter.registerAll(this.runner.tests);

	}

	onLoad = () => { }
	onStep = () => { }
	onResume = () => { }
	onPause = () => { }
	onEnd = () => { }
	onFail = () => { }

	onError = (...args) => {
		if (this.options.onError)
			return this.options.onError(...args);
	}

	onReset = () => {
		this.stdout = [ ];
		this.stdin = [ ];
		this.stderr = [ ];
		this.alerts = [ ];
	}

	onConsoleLog = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleLog)
			return this.options.onConsoleLog(...args);
	}

	onConsoleWarn = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleWarn)
			return this.options.onConsoleWarn(...args);
	}

	onConsoleInfo = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleInfo)
			return this.options.onConsoleInfo(...args);
	}

	onConsoleError = (...args) => {
		this.stderr.push(args);
		if (this.options.onConsoleError)
			return this.options.onConsoleError(...args);
	}

	onConsoleSuccess = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleSuccess)
			return this.options.onConsoleSuccess(...args);
	}

	onConsoleShake = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleShake)
			return this.options.onConsoleShake(...args);
	}

	onConsoleRainbow = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleRainbow)
			return this.options.onConsoleRainbow(...args);
	}

	onConsoleAsk = (...args) => {
		this.stdout.push(args);

		// no ask handler
		let result = '';
		if (this.options.onConsoleAsk) {
			result = this.options.onConsoleAsk(...args);
		}

		// check for input
		this.stdin.push(result);
		return this.interpreter.resolveType(result);
	}

	onConsoleImage = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleImage)
			return this.options.onConsoleImage(...args);
	}

	onConsoleClear = (...args) => {
		if (this.options.onConsoleClear)
			return this.options.onConsoleClear(...args);
	}

	onAlert = (...args) => {
		this.alerts.push(args);
		if (this.options.onAlert)
			return this.options.onAlert(...args);
	}

	// setup options
	configure(options) {
		this.options = options;
	}


}