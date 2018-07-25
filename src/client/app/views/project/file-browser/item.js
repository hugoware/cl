
import _ from 'lodash';
import Component from '../../../component';
import { ProjectItem } from '../../../state';

/** @prop {ProjectItem} data */
export default class FileBrowserItem extends Component {
	
	constructor() {
		super({ 
			template: 'file-browser-item',

			ui: {
				name: '.name',
				children: '.children'
			}
		});
	}

	/** @type {JQuery} */
	get children() {
		return this.ui.children;
	}

	/** checks if this element is selected 
	 * @returns {boolean}
	 */
	get selected() {
		return this.is('.selected');
	}

	/** sets the selection state for this item
	 * @param {boolean} isSelected
	 */
	set selected(isSelected) {
		this.toggleClass('selected', !!isSelected);
	}

	/** checks if this element is selected 
	 * @returns {boolean}
	 */
	get expanded() {
		return this.is('.expanded');
	}

	/** sets the selection state for this item
	 * @param {boolean} isExpanded
	 */
	set expanded(isExpanded) {
		this.toggleClass('expanded', !!isExpanded);
	}

	/** @param {ProjectItem} item 
	 * @param {number} depth
	*/
	update(data, depth) {
		
		/** @type {ProjectItem} */
		this.data = data;

		// update values
		this.ui.name.text(data.name);
		this.attr('class', `file-browser-item depth-${depth}`);
		this.toggleClass('is-empty', data.isFolder && data.isEmpty);
		this.toggleClass('is-folder', data.isFolder);
		this.toggleClass('is-file', !data.isFolder);
	}

}