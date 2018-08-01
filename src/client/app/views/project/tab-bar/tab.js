/// <reference path="../../../types/index.js" />

import $icons from '../../../icons';
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

		// handle closing
		const close = $icons.close();
		this.ui.close.append(close);

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
		console.log('add mod');
		// if (!isSameFile(this, file)) return;
		this.addClass('is-modified');
	}

	onSaveFile = file => {
		console.log('remove mod');
		// if (!isSameFile(this, file)) return;
		this.removeClass('is-modfied');
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