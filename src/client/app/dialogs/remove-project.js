
import $api from '../api';
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

	// shows the view
	onActivate = project => {
		this.busy = false;
		this.id = project.id;
	}
	
	// handles removing the project
	onConfirm = async () => {
		this.busy = true;
		try {

			// try and remove the project
			const { id } = this;
			const result = await $api.request('remove-project', { id })
			if (!result.success)
				throw result;

			// notify the change
			this.broadcast('remove-project', id);
			this.hide();
		}
		// display errors
		catch (err) {
			this.busy = false;
			this.errorMessage.apply(err);
		}

	}

}