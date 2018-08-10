import Dialog from './';

export default class CreateFolderDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-folder',

			ui: {
				message : '.message',
				folderPath: '.in-folder',
			}
		});
	}

	/** checks for a folder instance
	 * @returns {boolean} */
	get hasFolder() {
		return !!this.folder;
	}

	onActivate = data => {
		this.folder = data.folder;
		const { folder, hasFolder } = this;

		// update the UI as needed
		this.ui.message.toggleClass('in-root', !hasFolder);
		this.ui.message.toggleClass('in-folder', hasFolder);
		
		// update the name, if needed
		if (hasFolder) {
			this.ui.folderPath.text(folder.path);
		}
	}

	onConfirm = () => {
		this.busy = true;
	}

	onCancel = () => {

	}

}