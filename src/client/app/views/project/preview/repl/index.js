/// <reference path="../../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../../state';
import Component from '../../../../component';
import $contentManager from '../../../../content-manager';
import $keyboard from 'mousetrap';

// main content view
import $view from './view.html';

// create the preview mode
export default class ReplMode extends Component {

	constructor(preview) {
		super({
			template: 'preview-repl',

			ui: {
				filePath: '.file-path',
				output: '.window iframe.output',

				// actions
				runScripts: '.run-scripts'
			}
		});

		// the previewer instance
		this.preview = preview;

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

	/** access to the output window
	 * @type {HTMLElement} the preview DOM element
	 */
	get output() {
		return this.context.document.body;
	}

	/** returns the window context for the preview */
	get context() {
		return this.ui.output[0].contentWindow;
	}

	/** access to helper scripts for the main window */
	get bridge() {
		return this.context.__CODELAB__;
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
		if (this.bridge)
			this.bridge.clear();
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

	// handles replacing the content of the view if 
	// dependencies require it
	onCompileFile = async () => {

	}

	// handles running
	onRunScripts = () => {

		// need to decide correct file -- wait for compile
		this.bridge.load('Running /main.ts ...');

		// wait a moment before starting
		setTimeout(async () => {

			// get the code
			await $contentManager.compile('/main.ts', { silent: true });
			const code = await $contentManager.get('/main.ts');
			this.bridge.projectUrl = $state.getProjectDomain();
			this.bridge.run(code);
		}, 1000)

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
