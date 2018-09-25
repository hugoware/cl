import _ from 'lodash';

import Dialog from './';

export default class CreateProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-unsaved-changes',
			ui: {
				ignore: '.ignore'
			}
		});

		// listen for saving
		this.listen('save-all-finished', this.onSaveAll);

		// setup handlers
		this.ui.ignore.on('click', this.onIgnore);
	}

	// handle activating the dialog window
	onActivate = options => {
		this.removeClass('is-preview is-close');
		this.addClass(`is-${options.reason}`);
		this.confirm = options.confirm;
		this.cancel = options.cancel;
		this.onlyHideOnSaveChanges = !!options.onlyHideOnSaveChanges;
	}

	// ignore saving changes
	onIgnore = () => {
		if (this.busy) return;
		this.busy = true;
		this.hide();
		this.confirm();
	}
	
	// try and save the changes
	onConfirm = () => {
		if (this.busy) return;
		this.busy = true;
		this.broadcast('save-all');
	}

	// handles when all files are saved
	onSaveAll = () => {
		if (!this.isVisible) return;
		this.hide();

		// if this should use the confirm action
		if (!this.onlyHideOnSaveChanges)
			this.confirm();
	}

	// when canceling the request
	onCancel = () => {
		if (this.cancel)
			this.cancel();
	}

}