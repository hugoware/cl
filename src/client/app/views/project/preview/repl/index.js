/// <reference path="../../../../types/index.js" />

import { _, Mousetrap } from '../../../../lib';
import $state from '../../../../state';
import Component from '../../../../component';
import $contentManager from '../../../../content-manager';
import CodeRunner from '../../../../../viewer/code-runner';
import ConsoleRunner from '../../../../../viewer/runners/console';

import { requirePermission } from '../../prevent';

// main content view
import $view from './view.html';
import ExecutionContext from './context'

const EMPTY_BOUNDS = { top: 0, bottom: 0 };

// create the preview mode
export default class ReplMode extends Component {

	constructor(preview) {
		super({
			template: 'preview-repl',

			ui: {
				filePath: '.file-path',
				output: '#repl.window',

				// actions
				runScripts: '.run-scripts'
			}
		});

		// create the runner
		this.runner = CodeRunner.create(ConsoleRunner);
		setTimeout(() => this.runner.init({
			containerSelector: '#repl',
			outputSelector: '#repl #output',
			inputSelector: '#repl #input',
			errorSelector: '#repl #error',
			questionSelector: '#repl #question',
			alertSelector: '#repl #alert',
		}));
		
		this.runner.handleException = this.onHandleException;

		// global events
		this.listen('assistant-updated', this.onAssistantUpdated);
		this.listen('clear-code-runner', this.onClearCodeRunner);

		// handle script requests
		this.ui.runScripts.on('click', this.onRunScripts);
		this.on('run-scripts', this.onGlobalRunScripts);

		// handle executing code
		Mousetrap.bind('mod+enter', this.onRunScripts);

		// write the main document
		this.ui.output.on('load', () => this.writeContent($view));
		this.ui.output.on('message', (...args) => console.log(args));
	}

	/** changes the file being executed
	 * @param {string} value the new url to use
	*/
	set file(value) {
		this.ui.file.val(value);
	}

	// /** access to the output window
	//  * @type {HTMLElement} the preview DOM element
	//  */
	// get output() {
	// 	return this.context.document.body;
	// }

	// /** returns the window context for the preview */
	// get context() {
	// 	return this.ui.output[0].contentWindow;
	// }

	// /** access to helper scripts for the main window */
	// get bridge() {
	// 	return this.context.__CODELAB__;
	// }

	// handles exception messages
	onHandleException = ex => {
		console.log('handle ex', ex);
		this.runner.fail(ex);
	}

	// handles starting a new project
	onActivateProject = async project => {
		this.isActive = true;
		this.reset();
	}

	// reset the view
	onClearCodeRunner = () => {
		this.runner.clear();
	}

	onDeleteItems = paths => { }

	// just always sync the name
	onRenameItem = () => {
		if (this.file)
			this.filePath = this.file.path;
	}

	// handles incoming preview messages
	onPreviewMessage = (key, args = {}) => {
		if (key === 'execution-finished');
			this.broadcast('execution-finished');
	}

	// handle resetting
	reset() { }

	// clear the view, as needed
	clear() {
		if (this.runner)
			this.runner.clear();
	}

	// handle updates
	onAssistantUpdated = () => {

		// this is an additonal step to make sure that the assistant
		// doesn't covert up the code window
		const relativeTo = Component.select('#assistant .panel')[0];

		// get the overlap area
		const bounds = relativeTo ? relativeTo.getBoundingClientRect() : EMPTY_BOUNDS;
		
		// adjust the height
		let height = bounds.bottom - bounds.top;
		if (height > 0) height -= 30;

		// update the view
		this.ui.output.css({ bottom: `${height}px` });

	}

	// handles deactivating a project entirely
	onDeactivateProject = () => {
		this.isActive = false;
		this.clear();
	}

	// handles closing a file from preview
	onCloseFile = file => {
		if (this.activeFile.path === file.path)
			this.clear();
	}

	// sets the file to use
	onActivateFile = async (file, viewOnly) => {
		this.activeFile = file;
		this.filePath = file.path;		
	}

	// // handles successful code executions
	// onCodeExecutionApproval = (options = {}) => {
	// 	if ($state.lesson)
	// 		$state.createRestorePoint();

	// 	this.broadcast('code-execution-approval', options)
	// }

	// handles replacing the content of the view if 
	// dependencies require it
	onCompileFile = async () => {

	}

	// handles running
	onRunScripts = () => {
		if (!this.isActive) return;
		
		this.runner.clear();
		this.runner.projectUrl = $state.getProjectDomain();

		// use the active file -- consider letting people
		// set the "main" file
		let path;
		let file;

		// check for main first
		file = $state.paths['/main.js'];
		path = file && file.path;

		// for code files, the active file can be used if
		// a main.js file hasn't been added
		if ($state.isCodeProject && !path) {
			file = $state.activeFile;
			path = file && file.path;
		}

		// check if allowed or not
		if (!requirePermission({
			args: [file],
			requires: ['tryRunCode', 'RUN_CODE'],
			message: `Can't Use Run Code`
		})) return;


		// handle lesson execution
		const options = {}

		// check lesson options
		if ($state.lesson) {
			_.each(['Start', 'Step', 'Pause', 'End', 'Error', 'Alert', 'Ask'], command => {
				if ($state.lesson.respondsTo(`runCode${command}`)) {
					options[`on${command}`] = (...args) => {
						const params = [`runCode${command}`, this.context].concat(args);
						$state.lesson.invoke.apply($state.lesson, params);
					};
				}
			});
		}

		// set the initial config
		this.runner.configure(options);

		// if there's not an active file
		if (!file) {

			// game/mobile behaviors
			if ($state.isGameProject || $state.isMobileProject) {
				const type = $state.isGameProject ? 'Game' : 'Mobile App';
				const subtype = $state.isGameProject ? 'game' : 'app';
				this.runner.onConsoleError('No Entry File Found: main.js');
				this.runner.onConsoleInfo('Use the File Browser on the left side of the screen to create a new main.js file.');
				this.runner.onConsoleLog(`\n${type} projects must have a main.js file. This is used as the start up point for your ${subtype}.\n\n`);
			}
			// other types
			else {
				this.runner.onConsoleError('No Entry File Found');
				this.runner.onConsoleInfo('Open a file to run or use the File Browser on the left side of the screen to create a new code file.');
				this.runner.onConsoleLog(`\nBy default, Code projects will execute main.js -- If that file has not been added to the project, then the active tab will be executed instead.\n\n`);
			}

			return;
		}

		// delay before running just by a moment
		this.runner.load(`Running ${path} ...`);
		setTimeout(async () => {

			// compile the code -- save any errors
			// directly to the runner. When `.run` is called
			// that error will be thrown right away
			let ex;
			await $contentManager.compile(path, {
				onError: error => ex = error,
				silent: true
			});

			// get the code to execute
			const code = await $contentManager.get(path);
			this.context = new ExecutionContext(code, this.runner);

			// run the code
			if (options.onStart)
				options.onStart(this.context);

			// continue execution
			this.runner.run(code, ex);

		}, 100);

	}

	/** replaces the page content with new HTML
	 * @param {string} html the content to write
	 */
	writeContent = (html, attempt = 0) => {
		if (attempt > 5) throw 'window error?';

		// try again in a moment
		if (!this.context || !this.context.document)
			return setTimeout(() => this.writeContent(html, ++attempt), 250);

		const doc = this.context.document;
		doc.open();
		doc.write(html);
		setTimeout(() => { doc.close(); }, 10);
	}



}
