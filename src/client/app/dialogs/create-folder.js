import Dialog from './';

export default class CreateFolderDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-folder',

			ui: {
				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});
	}

}