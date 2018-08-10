/// <reference path="../../../types/index.js" />

import Component from '../../../component';

export default class Tab extends Component {

	constructor(file) {
		super({

			template: 'tab-bar-item',

			ui: {
				name: '.name',
				close: '.close'
			}

		});

		/** the file associated with this tab
		 * @type {ProjectItem} */
		this.file = file;

		// setup events
		this.listen('modify-file', this.onModifyFile);
		this.listen('save-file', this.onSaveFile);
		this.listen('rename-file', this.onRenameFile);
	}

	get isActive() {
		return this.is('.active');
	}

	// listens when this file is modified or not
	onModifyFile = file => {
		if (!isSameFile(this, file)) return;
		this.addClass('is-modified');
	}

	// handles removing modified state
	onSaveFile = file => {
		if (!isSameFile(this, file)) return;
		this.removeClass('is-modified');
	}

	// handles when a file is renamed
	onRenameFile = file => {
		if (!isSameFile(this, file)) return;
		this.refresh();
	}

	// update any changes
	refresh() {
		this.ui.name.text(this.file.name);
	}

}

// quick check for same files
function isSameFile(tab, file) {
	return file && (tab.file.path === file || file.path === tab.file.path);
}