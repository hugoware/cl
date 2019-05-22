

export default class TestRunner {

	constructor(runner) {
		this.runner = runner;
	}

	get interpreter() {
		return this.runner.interpreter;
	}

	get state() {
		return this.runner.get(this.key);
	}

	init = () => {
		this.stdout = [];
		this.stdin = [];
		this.alerts = [];
	}

	// prepare to run
	register = interpreter => {
		interpreter.registerAll([
			
			{ name: `${this.runner.key}`,
				action: this.onSyncState },

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
			return this.options.onError.call(this.runner, ...args);
	}

	onReset = () => {
		this.stdout = [ ];
		this.stdin = [ ];
		this.stderr = [ ];
		this.alerts = [ ];
	}

	onSyncState = (...args) => {
		if (this.options.onSyncState)
			return this.options.onSyncState.call(this.runner, ...args);
	}

	onConsoleLog = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleLog)
			return this.options.onConsoleLog.call(this.runner, ...args);
	}

	onConsoleWarn = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleWarn)
			return this.options.onConsoleWarn.call(this.runner, ...args);
	}

	onConsoleInfo = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleInfo)
			return this.options.onConsoleInfo.call(this.runner, ...args);
	}

	onConsoleError = (...args) => {
		this.stderr.push(args);
		if (this.options.onConsoleError)
			return this.options.onConsoleError.call(this.runner, ...args);
	}

	onConsoleSuccess = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleSuccess)
			return this.options.onConsoleSuccess.call(this.runner, ...args);
	}

	onConsoleShake = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleShake)
			return this.options.onConsoleShake.call(this.runner, ...args);
	}

	onConsoleRainbow = (...args) => {
		this.stdout.push(args);
		if (this.options.onConsoleRainbow)
			return this.options.onConsoleRainbow.call(this.runner, ...args);
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
			return this.options.onConsoleImage.call(this.runner, ...args);
	}

	onConsoleClear = (...args) => {
		if (this.options.onConsoleClear)
			return this.options.onConsoleClear.call(this.runner, ...args);
	}

	onAlert = (...args) => {
		this.alerts.push(args);
		if (this.options.onAlert)
			return this.options.onAlert.call(this.runner, ...args);
	}

	// setup options
	configure(options) {
		this.options = options;
	}


}