import _ from 'lodash';
import $api from '../api';
import $nav from '../nav';

import Dialog from './';
import Component from '../component'
import ErrorMessage from '../ui/error-message';

export default class CreateProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-project',
			ui: {
				name: '.name',
				description: '.description',
				types: '.project-type',
				errorMessage: '.error',

				submit: '.action.confirm',
				cancel: '.action.cancel'
			}
		});

		// handle displaying errors
		this.errorMessage = new ErrorMessage({
			$: this.ui.errorMessage,
			errors: {

			}
		});

		// setup handlers
		this.ui.submit.on('click', this.onSubmit);
		this.ui.cancel.on('click', this.onCancel);

		// setup type selection
		this.on('click', '.project-type', this.onSelectType);
	}

	// handle activating the dialog window
	onActivate = () => {

		// reset the form
		this.ui.name.val('').focus().select();
		this.ui.description.val('');
		this.removeClass('has-selection');
		this.clearTypeSelection();
		this.errorMessage.clear();

	}

	clearTypeSelection() {
		this.ui.types.removeClass('selected');
	}

	onSelectType = event => {
		this.clearTypeSelection();

		// update the selection
		this.addClass('has-selection');
		const instance = Component.locate(event.target, '.project-type');
		instance.addClass('selected');
	}

	// try and save the changes
	onSubmit = async () => {
		return new Promise(async resolve => {

			// already in progress
			if (this.busy) return resolve();
			this.busy = true;

			// get the information to create with
			const name = _.trim(this.ui.name.val());
			const description = _.trim(this.ui.description.val());
			const type = this.ui.types.filter('.selected').attr('data-type');
			const project = { name, description, type };

			// send the request for the create
			const result = await $api.request('create-project', project);
				
			// navigate to the success screen
			if (!result.success)
				this.errorMessage.apply(result);

			// show the project and close the dialog
			else {
				await this.hide();
				$nav.go(`project/${result.id}`);
			}

			resolve();
		})
		.catch(err => {
			this.errorMessage.apply(err);
		})
		.finally(() => this.busy = false);

	}

	onCancel = () => {
		this.hide();
	}

}