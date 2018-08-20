/// <reference path="../types/index.js" />

import _ from 'lodash';
import Dialog from './';
import $state from '../state';
import { getSelectionInfo } from '../utils/';
import SelectionList from '../ui/selection-list';
import ErrorMessage from '../ui/error-message';

export default class RemoveItemsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-remove-items',

			ui: {
				type: '.type',
				error: '.error',
				submit: '.action.submit',
				cancel: '.action.cancel',
				selected: '.selection'
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: { }
		});

		this.selected = new SelectionList({
			$: this.ui.selected,
			expandSelection: true
		});
	}

	onActivate = paths => {
		this.selected.setItems(paths);
	
		// update
		const { displayNameWithCount } = getSelectionInfo(this.selected.items);
		this.ui.type.text(displayNameWithCount);
	}

	onConfirm = async () => {
		if (this.selected.isEmpty) return;

		// gather the paths
		const paths = _.map(this.selected.items, 'path');

		// send the request
		this.busy = true;
		try {
			await $state.deleteItems(paths);
			this.hide();
		}
		catch (err) {
			this.errorMessage.apply(err);
		}
		finally {
			this.busy = false;
		}

	}
}

