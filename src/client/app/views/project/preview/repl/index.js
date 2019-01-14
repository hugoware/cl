/// <reference path="../../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../../state';
import Component from '../../../../component';
import $contentManager from '../../../../content-manager';
import CodeRunner from '../../../../../viewer/code-runner';
import $keyboard from 'mousetrap';

const EMPTY_BOUNDS = { top: 0, bottom: 0 };

// TODO: this is hacky -- fix this up later
if (!document.getElementById('babel-script')) {
	const babel = document.createElement('script');
	babel.setAttribute('id', 'babel-script');
	babel.src = '/__codelab__/babel.min.js';
	document.body.appendChild(babel);
}

// main content view
import $view from './view.html';

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

		// the previewer instance
		// this.preview = preview;
		CodeRunner.create({
			containerSelector: '#repl',
			outputSelector: '#repl #output',
			inputSelector: '#repl #input',
			errorSelector: '#repl #error',
			questionSelector: '#repl #question',
		}, instance => {
			
			// save the runner instance
			this.runner = instance;

			// setup a default error handler
			this.runner.handleException = this.onHandleException;
		});


		// global events
		this.listen('assistant-updated', this.onAssistantUpdated);

		// handle script requests
		this.ui.runScripts.on('click', this.onRunScripts);
		this.on('run-scripts', this.onGlobalRunScripts);

		// handle executing code
		$keyboard.bind('mod+enter', this.onRunScripts);

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
		this.reset();
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

	// handles successful code executions
	onCodeExecutionApproval = (options = {}) => {
		if ($state.lesson)
			$state.createRestorePoint();

		this.broadcast('code-execution-approval', options)
	}

	// handles replacing the content of the view if 
	// dependencies require it
	onCompileFile = async () => {

	}

	// handles running
	onRunScripts = () => {
		this.runner.clear();
		this.runner.projectUrl = $state.getProjectDomain();

		// check for slide code execution validators
		let validator;
		if ($state.lesson) {
			const { slide } = $state.lesson;
			validator = $state.lesson.getValidator(slide.runValidation);
		}

		// delay before running just by a moment
		const fileName = '/main.ts';
		this.runner.load(`Running ${fileName} ...`);
		setTimeout(async () => {

			// compile the code -- save any errors
			// directly to the runner. When `.run` is called
			// that error will be thrown right away
			await $contentManager.compile(fileName, {
				onError: ex => this.runner.error = ex,
				silent: true
			});

			// get the code to execute
			const code = await $contentManager.get(fileName);

			// handle the correct path
			if (validator) {

				// run with the validator
				validator({
					onSuccess: this.onCodeExecutionApproval,
					runner: this.runner,
					code
				});
			}
			// this is
			else this.runner.run(code);

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
