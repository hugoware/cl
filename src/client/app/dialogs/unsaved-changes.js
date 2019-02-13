import { _ } from '../lib';

import Dialog from './';
import $state from '../state';

export default class UnsavedChangesDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-unsaved-changes',
			ui: {
				ignore: '.ignore'
			}
		});

		// listen for saving
		this.listen('save-all-finished', this.onSaveAll);
		this.listen('save-file', this.onSaveTarget);

		// setup handlers
		this.ui.ignore.on('click', this.onIgnore);
	}

	// handle activating the dialog window
	onActivate = options => {
		this.removeClass('is-preview is-close');
		this.addClass(`is-${options.reason}`);
		if (options.file) this.addClass('for-file');
		this.file = options.file;
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

		// wants to save a single file
		if (this.file)
			this.broadcast('save-target', this.file.path);
			
		// wants to save all files
		else 
			this.broadcast('save-all');
	}

	// handles when all files are saved
	onSaveTarget = path => {
		if (!this.file || path !== this.file.path) return;
		if (!this.isVisible) return;
		this.hide();

		// if this should use the confirm action
		if (!this.onlyHideOnSaveChanges)
			this.confirm();
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