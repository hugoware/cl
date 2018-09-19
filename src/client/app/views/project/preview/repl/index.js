/// <reference path="../../../../types/index.js" />

import _ from 'lodash';
import Component from '../../../../component';
import $contentManager from '../../../../content-manager';
import $state from '../../../../state';
import { getExtension } from '../../../../utils/index';
import $errorManager from '../../../../error-manager';

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

		this.ui.runScripts.on('click', this.onRunScripts);
		this.on('run-scripts', this.onGlobalRunScripts);

		this.ui.output.on('load', () => {
			// create the doc
			this.writeContent(`
<html>
		<head>
		</head>
		
		<pre id="output" ></pre>
		<pre id="command" >
			<input id="input" type="text" />
		</pre>

		<script src="/__codelab__/debugjs.js" type="text/javascript" ></script>
		<script src="/__codelab__/repl.js" type="text/javascript" ></script>
</html>
`);
		})

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

	// just always sync the name
	onRenameItem = () => {
		if (this.file)
			this.filePath = this.file.path;
	}

	// checks if a view should refresh because
	// a file was deleted
	onDeleteItems = paths => {

	}

	// handles incoming preview messages
	onPreviewMessage = (err, args = {}) => {
		if (!this.hasActiveView) return;

		// handling a script error
		if (err === 'error') {
			args.path = this.activeFile.path;
			this.setPageError(args);
		}

		// handle general navigation
		else if (args.navigate)
			this.navigate(args.navigate);

		// else if ('console.log' === name)
		// else if ('console.log' === name)
		// else if ('console.log' === name)

		else console.log('preview message', err, args);
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

	// sets the default view content
	onActivateFile = async (file, viewOnly) => {

		this.activeFile = file;
		this.filePath = file.path;
		
	}

	// handles replacing the content of the view if 
	// dependencies require it
	onCompileFile = async () => {

		
	}

	// handles running
	onRunScripts = async () => {
		console.log('file was complied');
		const scripts = { };
		const files = $state.files;

		for (let i = 0, total = files.length; i < total; i++) {
			const file = files[i];

			if (file.isFile && /\.ts$/.test(file.path)) {
				const code = await $contentManager.get(file.path);
				scripts[file.path] = _.trim(code);
			}

		}

		const all = _.values(scripts).join('\n');
		console.log('will run', all);
		this.bridge.run(all);

	}

	// resetting the view
	onReset = () => {
		
	}

	/** handles completely resetting the preview window */
	reset() {
		
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
