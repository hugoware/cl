/// <reference path="../../../../types/index.js" />

import _ from 'lodash';
import View from './view';
import Component from '../../../../component';
import { getExtension } from '../../../../utils/index';
import { listen } from '../../../../events';
import $errorManager from '../../../../error-manager';

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
		listen('preview-message', this.onPreviewMessage);
		this.ui.runScripts.on('click', this.onRunPageScripts);
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

	// kicks off page scripts
	onRunPageScripts = () => {
		this.runScripts();
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
		this.ui.url.val(path);

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
		this.preview.reset();
		this.preview.output.innerHTML = html;

		// populate the title, if possible
		const title = this.view.title || 'Untitled Page';
		this.ui.title.text(title);

		// since we're resetting the page, clear any
		// scripting flags
		this.hasRunScripts = false;
		if (shouldRunScripts)
			this.runScripts();

	}

	// execute scripts
	runScripts = () => {

		// if the scripts have already run once then
		// refresh the content before executing
		if (this.hasRunScripts) this.render();

		// execute the scripts
		this.hasRunScripts = true;
		this.preview.bridge.evalScripts();
	}

}
