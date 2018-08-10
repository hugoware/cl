import Dialog from './';
import $state from '../state';
import { getExtension } from '../utils/index';

export default class RenameItemDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-rename-item',

			ui: {
				type: '.type',
				name: '.name',
				extension: '.extension',

				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});

		// handle events
		this.on('keyup', this.onKeyUp);
	}

	get name() { return this.ui.name.text(); }
	set name(value) { this.ui.name.text(value); }

	get type() { return this.ui.type.text(); }
	set type(value) { this.ui.type.text(value); }

	set extension(value) { this.ui.extension.text(value); }

	onActivate = path => {
		const item = $state.findItemByPath(path);
		this.item = item;

		// update the file info
		this.type = item.isFolder ? 'Folder' : 'File';

		// update the type info
		this.toggleClassMap({
			'is-file': item.isFile,
			'is-folder': item.isFolder
		});

		// save the file name info
		let name = item.name;
		if (item.isFile) {
			const extension = getExtension(name);
			name = name.substr(0, name.length - extension.length);
			this.extension = extension;
		}
		
		// set the input name
		this.name = name;
		this.ui.name.selectText();
	}

	// handle validation
	onKeyUp = event => {
		this.validateForm();
	}

	// handle confirming the rename
	onConfirm = () => {
		console.log('will rename');

	}

	// validate the change
	validateForm = () => {

		const name = this.name;
		console.log('name');

	}

}