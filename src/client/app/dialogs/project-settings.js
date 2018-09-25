import $api from '../api';
import Dialog from './';
import ErrorMessage from '../ui/error-message';

export default class ProjectSettingsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-project-settings',

			ui: {
				error: '.error',
				name: '.name',
				description: '.description',
				domain: '.domain',
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
			}
		});

	}

	// update with the new data
	onActivate = data => {
		this.busy = false;

		// save the project id
		this.id = data.id;

		// set the default values
		this.ui.name.val(data.name);
		this.ui.description.val(data.description);
		this.ui.domain.val(data.domain);
	}

	// apply the changes
	onConfirm = async () => {
		this.busy = true;

		try {
			const data = {
				id: this.id,
				name: this.ui.name.val(),
				description: this.ui.description.val(),
				domain: this.ui.domain.val(),
			};

			// save the changes
			const result = await $api.request('edit-project', data);
			if (!result.success)
				throw result;

			// updated successfully
			this.broadcast('edit-project', data);
			this.hide();
		}
		catch(err) {
			this.busy = false;
			this.errorMessage.apply(err);
		}

	}

}