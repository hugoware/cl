
import _ from 'lodash';
import Component from '../../../component';
import { ProjectItem } from '../../../state';
import $icons from '../../../icons';

/** @prop {ProjectItem} data */
export default class FileBrowserItem extends Component {
	
	constructor() {
		super({ 
			template: 'file-browser-item',

			ui: {
				icon: '.icon',
				name: '.name',
				toggle: '.toggle',
				children: '.children .contents'
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

		// populate icons
		if (!this.hasIcons) {
			this.hasIcons = true;
			
			// check for folder state
			if (data.isFolder) {
				const folder = $icons.folder();
				this.ui.icon.append(folder);

				// toggle folders
				const expand = $icons.arrowRight();
				this.ui.toggle.append(expand);
			}
			// try and find the icon
			else {
				const icon = $icons.fileType(data.ext);
				this.ui.icon.append(icon);
			}

		}


		// update values
		this.ui.name.text(data.name);
		this.attr('class', `file-browser-item depth-${depth}`);
		this.toggleClass('is-empty', data.isFolder && data.isEmpty);
		this.toggleClass('is-folder', data.isFolder);
		this.toggleClass('is-file', !data.isFolder);
	}

}