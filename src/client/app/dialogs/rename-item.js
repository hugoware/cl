import Dialog from './';
import $state from '../state';
import ErrorMessage from '../ui/error-message';
import { getExtension } from '../utils/index';
import TextInput from '../ui/text-input'
import { getFileInfo } from '../utils/index';

export default class RenameItemDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-rename-item',

			ui: {
				type: '.type',
				name: '.name',
				extension: '.extension',

				itemName: '.itemName',
				error: '.error',

				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
				item_not_found: () => `No ${this.itemType} named ${this.item.name} was found.`,
				item_already_exists: () => `A ${this.itemType} named ${this.name} already exists.`,
				invalid_rename: () => `The name \`${this.name}\` cannot be used for a ${this.itemType}.`,
				rename_item_error: () => `There was an error renaming this ${this.itemType}.`,
			}
		});

		this.itemName = new TextInput({ 
			$: this.ui.itemName
		});

		// handle events
		this.on('confirm-entry', this.onConfirm);
	}

	onActivate = path => {
		const item = $state.findItemByPath(path);
		this.item = item;

		// update the file info
		this.ui.type.text(item.isFolder ? 'Folder' : 'File');

		// update the type info
		this.toggleClassMap({
			'is-file': item.isFile,
			'is-folder': item.isFolder
		});

		// it's a file
		if (item.isFile) {
			const info = getFileInfo(item.name);
			this.itemName.value = info.name;
			this.itemName.suffix = info.extension;
			this.extension = info.extension;
		}
		// it's a folder
		else {
			this.itemName.value = item.name;
			this.itemName.suffix = null;
		}

		// focus the input
		this.itemName.select();
	}

	// handle confirming the rename
	onConfirm = async () => {
		const { item } = this;
		let name = this.itemName.value;

		// create the new name
		if (item.isFile)
			name += this.extension;
		
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

}