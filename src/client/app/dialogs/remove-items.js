/// <reference path="../types/index.js" />

import _ from 'lodash';
import Dialog from './';
import $state from '../state';
import { getSelectionType } from '../utils/';
import SelectionList from '../ui/selection-list';

export default class RemoveItemsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-remove-items',

			ui: {
				type: '.type',
				submit: '.action.submit',
				cancel: '.action.cancel',
				selected: '.selection'
			}
		});

		this.selected = new SelectionList({
			$: this.ui.selected,
			expandSelection: true
		});
	}

	onActivate = paths => {
		this.selected.setItems(paths);
	
		// update
		const { displayName } = getSelectionType(this.selected.items);
		this.ui.type.text(displayName);
	}

	onConfirm = async () => {
		if (this.selected.isEmpty) return;

		// gather up the paths
		const paths = _.map(this.selected.items, item => item.data.path);

		// send the request
		this.busy = true;
		try {
			await $state.deleteItems(paths);
			this.hide();
		}
		catch (err) {
			console.log(err);
		}
		finally {
			this.busy = false;
		}

	}
}

