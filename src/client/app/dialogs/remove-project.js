
import Dialog from './';
import ErrorMessage from '../ui/error-message';

export default class RemoveProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-remove-project',

			ui: {
				error: '.error',
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