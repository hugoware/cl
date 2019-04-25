
import CodeInterpreter from './interpreter';

// handles running code
export default class CodeRunner {

	// creates a new runner
	static create(Runner, options) {
		const runner = new CodeRunner();
		runner.handler = new Runner(runner, options);
		return runner;
	}

	// initializes the runner
	init = options => {

		// interface for external programs
		window.__CODELAB__ = {};
		__CODELAB__.load = this.onLoad;
		__CODELAB__.run = this.onRun;
		__CODELAB__.end = this.onEnd;
		__CODELAB__.clear = this.onClear;

		this.handler.init(options);
	}

	// prepare for execution steps
	configure(options) {
		this.handler.configure(options);
	}

	// resets the view
	onClear = () => {
		this.reset();
	}

	// prepares to run code
	onLoad = msg => this.handler.onLoad(msg);
	onStep = () => this.handler.onStep();
	onResume = () => this.handler.onResume();
	onPause = () => this.handler.onPause();

	// kicks off running code
	onRun = code => {

		// create the interpreter
		this.interpreter = new CodeInterpreter(code);
		this.handler.register(this.interpreter);

		// setup remaining events
		this.interpreter.on('finished', this.onEnd);
		this.interpreter.on('error', this.onError);
		this.interpreter.on('pause', this.onPause);
		this.interpreter.on('resume', this.onResume);
		this.interpreter.on('step', this.onStep);

		// copy any existing errors before running
		this.interpreter.error = this.error;
		
		// start running the code
		this.interpreter.run();
	}

	// handles ending execution
	onEnd = () => {
		this.handler.onEnd();
		this.notify('execution-finished');
	}

	// handles error ending
	onError = ex => {
		this.handler.onError(ex);
		this.notify('execution-finished');
	}

	
	// some shortcuts
	fail = () => this.handler.onFail(this)
	clear = () => this.onClear()
	load = msg => this.onLoad(msg)
	end = () => this.onEnd()
	run = (code, ex) => {

		// this had some sort of compile error
		// preventing this from running
		if (ex || this.error)
			return this.onError(ex || this.error);

		// starts the run process
		this.onRun(code);
	}

	// raises an event, if possible
	notify = (name, ...args) => {
		const event = new Event('preview-message');
		event.name = name;
		event.args = args;
		(window.top || window).dispatchEvent(event);
	}

	// resets the entire view
	reset = () => {
		this.handler.onReset();

		// reset the state
		this.error = undefined;
	}

}
