/// <reference path="../../../../types/index.js" />

import _ from 'lodash';
import View from './view';
import Component from '../../../../component';
import { getExtension } from '../../../../utils/index';
import { listen } from '../../../../events';
import $errorManager from '../../../../error-manager';

const NO_PREVIEW_LOADED = `
	<div style="font: 24px sans-serif; opacity: 0.3; text-align: center; position: absolute; top: 20%; left: 0; right: 0;" >
		No Preview Available
	</div>
`;

// checks list of browser view items that
// can replace the preview window
const VIEWABLE_TYPES = [
	'pug',
	'html',
	'htm'
];

// create the preview mode
export default class BrowserMode extends Component {

	constructor(preview) {
		super({
			template: 'preview-browser',

			ui: {
				url: '.url input',
				title: '.title',
				output: '.window iframe',

				// actions
				runScripts: '.run-scripts'
			}
		});

		// save the preview instance
		this.preview = preview;

		/** the current views cached for the browser
		 * @type {Object<string, View>} */
		this.views = { };

		// listen for the preview window to broadcast changes
		this.listen('preview-message', this.onPreviewMessage);
		this.listen('rename-item', this.onRenameItem);
		this.listen('delete-items', this.onDeleteItems);
		this.ui.output.on('mouseover', this.onAutoExecuteScripts);
		this.ui.runScripts.on('click', this.onRunPageScripts);

		// set the default view
		setTimeout(this.clear);
	}

	/** changes the browser view URL 
	 * @param {string} value the new url to use
	*/
	set url(value) {
		this.ui.url.val(value);
	}

	/** gets the current address bar url
	 * @returns {string} the current url
	 */
	get url() {
		return this.ui.url.val();
	}

	/** changes the browser view title */
	set title(value) {
		this.ui.title.text(value);
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

	/** handles completely resetting the preview window */
	reset() {
		this.output.innerHTML = '';
		this.output.outerHTML = this.output.outerHTML;
	}

	/** checks if a view is visible
	 * @returns {boolean} */
	get hasActiveView() {
		return !!this.activeFile;
	}

	/** returns the active file
	 * @returns {ProjectItem}
	 */
	get activeFile() {
		return this.view && this.view.file;
	}

	// handles starting a new project
	onActivateProject = async project => {
		this.views = { };
	}

	// automatically refresh scripts when mousing over
	onAutoExecuteScripts = () => {
		if (!this.hasRunScripts)
			this.runScripts();
	}

	// kicks off page scripts
	onRunPageScripts = () => {
		this.runScripts();
	}

	// check for renames to update the URL bar
	onRenameItem = item => {
		if (this.url === item.previous.path)
			this.url = item.path;
	}

	// checks if a view should refresh because
	// a file was deleted
	onDeleteItems = paths => {
		if (!this.hasActiveView) return;
		const { view } = this;
		const { file } = view;

		// check if the view was deleted
		for (const path of paths) {
			if (path === file.path)
				return this.clear();
		}

		// check if a dependency might have been removed
		for (const path of paths) {
			if (view.isDependency(path))
				return this.recompile();
		}

	}

	// handles incoming preview messages
	onPreviewMessage = (err, args) => {
		if (!this.hasActiveView) return;

		// handling a script error
		if (err === 'error') {
			args.path = this.activeFile.path;
			this.setPageError(args);
		}

		// else if ('console.log' === name)
		// else if ('console.log' === name)
		// else if ('console.log' === name)

		else console.log('received from preview', name);
	}

	// handles deactivating a project entirely
	onDeactivateProject = () => {
		this.views = { };
		this.clear();
	}

	// handles closing a file from preview
	onCloseFile = file => {
		if (!this.hasActiveView) return;
		if (this.activeFile.path === file.path)
			this.clear();
	}

	// sets the default view content
	onActivateFile = async file => {
		const { path } = file;
		
		// determine if activating the file should replace
		// the view that's in the preview or not
		const ext = getExtension(path, { removeLeadingDot: true });
		if (!_.includes(VIEWABLE_TYPES, ext))
			return;

		// if replacing a view, clear the error
		this.clearPageError();

		// update the url
		this.url = path;

		// find the view to use
		this.view = this.views[path] = this.views[path] || new View(file);
		await this.view.refresh(path, { forceRefresh: true });
		this.render(true);
	}

	// handles replacing the content of the view if 
	// dependencies require it
	onCompileFile = async file => {
		if (!this.view) return null;

		// refresh the view
		await this.view.refresh(file);
		this.render();
	}

	/** includes a new page error
	 * @param {ProjectError} error the error to assign
	 */
	setPageError = error => {
		if (!this.hasActiveView) return;
		error.file = this.activeFile.path;
		this.activeError = `script:${this.activeFile.path}`; 
		$errorManager.add(this.activeError, error);
	}

	/** handles removing errors on the page, if any */
	clearPageError = () => {
		if (!this.activeError) return;
		$errorManager.remove(this.activeError);
		delete this.activeError;
	}

	/** replaces the page content with new HTML
	 * @param {string} html the content to write
	 */
	writeContent = html => {
		const doc = this.context.document;
		doc.open();
		doc.write(html);
		setTimeout(() => { doc.close(); }, 10);
	}

	/** displays the most current template result 
	 * @param {boolean} shouldRunScripts should the render also eval scripts
	*/
	render = shouldRunScripts => {

		// clear any scripting errors
		this.clearPageError();
		
		// generate the file again
		const html = this.view.getHTML();

		// extra steps are to make sure that the
		// document body is also cleared of all event
		// listeners
		this.reset();
		this.writeContent(html);

		// populate the title, if possible
		const title = this.view.title || 'Untitled Page';
		this.title = title;

		// since we're resetting the page, clear any
		// scripting flags
		this.hasRunScripts = false;
		if (shouldRunScripts)
			this.runScripts();

	}

	// removes the current view
	clear = () => {
		this.clearPageError();
		this.reset();
		this.writeContent(NO_PREVIEW_LOADED);
		this.title = '';
		this.url = '';
		delete this.view;
	}

	// force a recompile of this view
	recompile = async () => {
		if (!this.hasActiveView) return;

		// force a compiled refresh
		const { file } = this.view;
		await this.view.refresh(file, true);
		this.render();
	}

	// execute scripts
	runScripts = () => {

		// TODO: figure out why this is null when creating
		if (!this.bridge) return;

		// if the scripts have already run once then
		// refresh the content before executing
		if (this.hasRunScripts) this.render();

		// execute the scripts
		this.hasRunScripts = true;
		this.bridge.evalScripts();
	}

}
