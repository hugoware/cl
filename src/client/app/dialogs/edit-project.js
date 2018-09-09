import $state from '../state';
import Dialog from './';
import TextInput from '../ui/text-input';
import ErrorMessage from '../ui/error-message';

export default class EditProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-edit-project',

			ui: {
				error: '.error',
				projectName: '.project-name'
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
			}
		});

		this.projectName = new TextInput({
			$: this.ui.projectName,
			minWidth: 200
		});

	}

	onActivate = data => {
	}

	onConfirm = async () => {

	}

}