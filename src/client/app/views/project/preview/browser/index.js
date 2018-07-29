import _ from 'lodash';
import View from './view';
import {getExtension} from '../../../../utils/index';

// checks list of browser view items that
// can replace the preview window
const VIEWABLE_TYPES = [
	'pug',
	'html',
	'htm'
];

export default class BrowserMode {

	constructor(preview) {
		this.preview = preview;

		/** the current views cached for the browser
		 * @type {Object<string, View>} */
		this.views = { };
	}

	// handles starting a new project
	onActivateProject = async project => {
		this.views = { };
	}

	// sets the default view content
	onActivateFile = async file => {
		const { path } = file;
		console.log('wants to active', path);
		
		// determine if activating the file should replace
		// the view that's in the preview or not
		const ext = getExtension(path, { removeLeadingDot: true });
		if (!_.includes(VIEWABLE_TYPES, ext))
			return;

		// find the view to use
		this.view = this.views[path] = this.views[path] || new View(file);
		await this.view.refresh(path, { forceRefresh: true });
		this.render();
	}

	// handles replacing the content of the view if 
	// dependencies require it
	onCompileFile = async file => {
		if (!this.view) return null;

		// refresh the view
		await this.view.refresh(file);
		this.render();
	}

	/** displays the most current template result */
	render() {
		const html = this.view.getHTML();
		this.preview.output.innerHTML = html;
	}

}
