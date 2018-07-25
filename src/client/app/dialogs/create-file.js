
import Dialog from './';

export default class CreateFileDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-file',

			ui: {
				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});

		this.ui.cancel.on('click', this.onCancel);
	}

	onActivate = () => {

		
	}

}