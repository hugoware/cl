import $state from '../state';
import Dialog from './';
import TextInput from '../ui/text-input';
import ErrorMessage from '../ui/error-message';

export default class CreateFolderDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-folder',

			ui: {
				message : '.message',
				error: '.error',
				folderName: '.folderName',
				folderPath: '.in-folder',
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
				folder_invalid: 'error: folder_invalid',
				folder_already_exists: 'error: folder_already_exists',
				folder_add_error: 'error: folder_add_error',
			}
		});

		this.folderName = new TextInput({
			$: this.ui.folderName,
			minWidth: 200
		});

	}

	/** checks for a folder instance
	 * @returns {boolean} */
	get hasFolder() {
		return !!this.selectedFolder;
	}

	onActivate = data => {
		this.selectedFolder = data.folder;
		const { selectedFolder, hasFolder } = this;

		// update the UI as needed
		this.toggleClassMap({
			'in-root': !hasFolder,
			'in-folder': hasFolder
		});
		
		// update the name, if needed
		if (hasFolder)
			this.ui.folderPath.text(selectedFolder.path);

		// select the input
		this.folderName.select();
	}


	// handle confirming the rename
	onConfirm = async () => {
		const name = this.folderName.value;
		const relativeTo = this.hasFolder ? this.selectedFolder.path : '/';

		// try and rename
		this.busy = true;
		try {
			const result = await $state.createFolder(name, relativeTo);
			if (!result.success) 
				throw result;
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