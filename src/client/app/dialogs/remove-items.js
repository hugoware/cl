/// <reference path="../types/index.js" />

import _ from 'lodash';
import Dialog from './';
import Component from '../component';
import ComponentList from '../component-list';
import $state from '../state';
import $icons from '../icons';

export default class RemoveItemsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-remove-items',

			ui: {
				type: '.type',
				submit: '.action.submit',
				cancel: '.action.cancel',
				selected: '.selection .items'
			}
		});

		this.selected = new ComponentList({ $: this.ui.selected });
	}

	onActivate = paths => {
		this.selected.clear();

		// expand out all paths to also include children
		const items = expandPaths(paths);

		// sort so that they show up in alphabetical order
		_(items)
			.sortBy('path')
			.each(item => {
				const removal = new DeletedItem(item);
				this.selected.appendItem(removal);
			});

		// update styling as requires
		const isMultiple = _.size(this.selected.items) > 1;
		const onlyFiles = _.every(this.selected.items, item => item.data.isFile);
		const onlyFolders = _.every(this.selected.items, item => item.data.isFolder);

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

// represents an individual item to delete
class DeletedItem extends Component {

	/** @param {ProjectItem} data */
	constructor(data) {
		super({
			template: 'dialog-remove-items-item',
			ui: {
				icon: '.icon',
				label: '.label'
			}
		});

		this.data = data;

		// ui updates
		this.addClass(data.isFolder ? 'is-folder' : 'is-file');
		this.ui.label.text(data.path);

		// attach each icon
		const key = data.isFile ? data.ext : 'folder';
		const icon = $icons.icon(key);
		this.ui.icon.append(icon);
	}

}

// gathers up all paths
function expandPaths(paths, expanded = [ ]) {
	for (const path of paths) {

		// add the item first
		const item = $state.findItemByPath(path.path || path);
		expanded.push(item);
		
		// if this is a folder, include the children
		if (item.isFolder)
			expandPaths(item.children, expanded);
	}

	return expanded;
}
