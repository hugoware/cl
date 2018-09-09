
import Dialog from './';
import ErrorMessage from '../ui/error-message';

export default class PublishProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-publish-project',

			ui: {
				error: '.error'
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
				
			}
		});

	}

	onActivate = data => {
		
	}

	onConfirm = async () => {
		
	}

}