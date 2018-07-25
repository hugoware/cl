import _ from 'lodash';
import $api from '../api';
import $nav from '../nav';

import Dialog from './';
import Component from '../component'

export default class CreateProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-project',
			ui: {
				name: '.name',
				description: '.description',
				types: '.type',

				submit: '.action.submit',
				cancel: '.action.cancel'
			}
		});

		// setup handlers
		this.ui.submit.on('click', this.onSubmit);
		this.ui.cancel.on('click', this.onCancel);

		// setup type selection
		this.on('click', '.type', this.onSelectType);
	}

	// handle activating the dialog window
	onActivate = () => {

		// reset the form
		this.ui.name.val('');
		this.ui.description.val('');

	}

	clearTypeSelection() {
		this.ui.types.removeClass('selected');
	}

	onSelectType = event => {
		this.clearTypeSelection();

		// update the selection
		const instance = Component.locate(event.target, '.type');
		instance.addClass('selected');
	}

	// try and save the changes
	onSubmit = async () => {
		const name = _.trim(this.ui.name.val());
		const description = _.trim(this.ui.description.val());
		const type = this.ui.types.filter('.selected').attr('data-type');
		const project = { name, description, type };

		// send the request for the create
		const result = await $api.request('create-project', project);

		// navigate to the success screen
		if (!result.success) {
			console.log('err', result);
			return;
		}

		// show the project and close the dialog
		await this.hide();
		$nav.go(`project/${result.id}`);
	}

	onCancel = () => {
		this.hide();
	}

}