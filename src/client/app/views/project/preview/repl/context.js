

export default class ExecutionContext {

	constructor(code, runner) {
		this.code = code;
		this.runner = runner;
	}

	// finds a variable, if possible
	get(expression) {
		return this.runner.interpreter.get(expression);
	}

	get alerts() {
		return this.runner.handler.alerts;
	}

	get output() {
		return this.runner.handler.stdout;
	}

	get input() {
		return this.runner.handler.stdin;
	}

	get lines() {
		return this.runner.handler.totalLines;
	}

}