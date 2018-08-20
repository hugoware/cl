import _ from 'lodash';
import Component from '../component';
import $icons from '../icons';
import { expandPaths } from '../utils';
import $state from '../state'
import {getSelectionInfo} from '../utils/index'

export default class SelectionList extends Component {

	constructor(options) {
		super({ tag: 'div' });

		// add to the selection box
		this.addClass('items');
		options.$.addClass('ui-selection-list');
		this.appendTo(options.$);

		this.expandSelection = !!options.expandSelection;
	}

	/** returns if this selection list has any items
	 * @returns {boolean} is this list empty or not
	 */
	get isEmpty() {
		return _.size(this.items) === 0;
	}

	/** replaces the items on the list
	 * @param {ProjectItem[]} items the items to include
	 */
	setItems = items => {
		this.empty();

		// expand out all paths to also include children
		const selection = getSelectionInfo(items, this.expandSelection);
		this.items = selection.items;

		// sort so that they show up in alphabetical order
		_(this.items)
			.each(item => {
				const selected = new SelectedItem(item);
				this.append(selected);
			});
	}

}

// represents an individual item to delete
class SelectedItem extends Component {

	/** @param {ProjectItem} data */
	constructor(data) {
		super({
			template: 'ui-selection-list-item',
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