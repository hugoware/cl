import $state from '../state';
import Dialog from './';
import TextInput from '../ui/text-input';
import ErrorMessage from '../ui/error-message';

export default class ProjectSettingsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-project-settings',

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