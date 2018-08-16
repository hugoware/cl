import Dialog from './';
import $state from '../state';
import ErrorMessage from '../ui/error-message';
import { getExtension } from '../utils/index';

export default class RenameItemDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-rename-item',

			ui: {
				type: '.type',
				name: '.name',
				extension: '.extension',

				errorMessage: [ '.error', ErrorMessage, {
					errors: {
						item_not_found: () => `No ${this.itemType} named ${this.item.name} was found.`,
						item_already_exists: () => `A ${this.itemType} named ${this.name} already exists.`,
						invalid_rename: () => `The name \`${this.name}\` cannot be used for a ${this.itemType}.`,
						rename_item_error: () => `There was an error renaming this ${this.itemType}.`,
					}
				}],

				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});

		// handle events
		this.on('keyup', this.onKeyUp);
	}

	/** the type of item this is
	 * @returns {string}
	 */
	get itemType() {
		return this.item.isFolder ? 'folder' : 'file';
	}

	/** returns the full name for this item, including extensions
	 * @returns {string}
	 */
	get itemName() {
		const { item } = this;
		let name = this.name;
		if (item.isFile) {
			const extension = getExtension(item.name);
			name += extension;
		}

		return name;
	}

	get name() { return this.ui.name.text(); }
	set name(value) { this.ui.name.text(value); }

	get type() { return this.ui.type.text(); }
	set type(value) { this.ui.type.text(value); }

	set extension(value) {
		this.ui.extension.text(value);
	}

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
	onConfirm = async () => {
		const { item } = this;
		const name = this.itemName;
		
		// try and rename
		this.busy = true;
		try {
			const result = await $state.renameItem(item, name);
			if (!result.success) throw result;
			this.hide();
		}
		catch (err) {
			this.errorMessage.apply(err);
		}
		finally {
			this.busy = false;
		}

	}

	// validate the change
	validateForm = () => {

		const name = this.name;
		console.log('name');

	}

}