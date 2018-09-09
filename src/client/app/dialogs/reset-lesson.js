
import Dialog from './';
import ErrorMessage from '../ui/error-message';

export default class ResetLessonDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-reset-lesson',

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