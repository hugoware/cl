import Dialog from './';

export default class RemoveItemsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-remove-items',

			ui: {
				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});
	}

}