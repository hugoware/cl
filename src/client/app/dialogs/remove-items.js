/// <reference path="../types/index.js" />

import _ from 'lodash';
import Dialog from './';
import Component from '../component';
import ComponentList from '../component-list';
import $state from '../state';

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

		this.selected = new ComponentList({ $: this.ui.selected });
	}

	onActivate = paths => {
		this.selected.clear();

		// sort so that they show up in alphabetical order
		_(paths)
			.sortBy()
			.each(path => {
				const file = $state.findItemByPath(path);
				const item = new DeletedItem(file);
				this.selected.appendItem(item);
			});

		// update styling as requires
		const isMultiple = _.size(this.selected.items) > 1;
		const onlyFiles = _.every(this.selected.items, item => item.file.isFile);
		const onlyFolders = _.every(this.selected.items, item => item.file.isFolder);

		let type = onlyFiles ? 'file'
			: onlyFolders ? 'folder'
			: 'item';

		// plural selection
		if (isMultiple)
			type += 's';

		// update
		this.ui.type.text(type);
		this.selected.refresh();
	}

	onConfirm = async () => {
		console.log('thinking');
		if (this.selected.isEmpty) return;

		// gather up the paths
		const paths = _.map(this.selected.items, item => item.file.path);

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

// represents an individual item to delete
class DeletedItem extends Component {

	/** @param {ProjectItem} file */
	constructor(file) {
		super({ tag: 'div' });
		this.file = file;
		this.addClass(file.isFolder ? 'is-folder' : 'is-file');
		this.text(file.path);
	}

}