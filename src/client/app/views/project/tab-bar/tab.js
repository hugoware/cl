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
		const { path } = file;
		this.listen('modify-file', this.onModifyFile, { path });
		this.listen('save-file', this.onSaveFile, { path });
		this.listen('close-file', this.onCloseFile, { path });
	}

	// listens when this file is modified or not
	onModifyFile = file => {
		// if (!isSameFile(this, file)) return;
		this.addClass('is-modified');
	}

	onSaveFile = file => {
		console.log('remove mod');
		// if (!isSameFile(this, file)) return;
		this.removeClass('is-modified');
	}

	onCloseFile = file => {
		console.log('closing the file', file);
		// if (!this.isSameFile())
	}

	refresh() {
		this.ui.name.text(this.file.name);
	}

}

// quick check for same files
function isSameFile(tab, file) {
	return file && file.path === tab.file.path;
}