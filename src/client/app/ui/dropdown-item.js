
import Component from '../component';

export default class DropDownItem extends Component {

	constructor(data, prop) {
		super({
			template: 'ui-dropdown-item',
			ui: {
				label: '.label'
			}
		});

		// save the info
		this.data = data;
		this.prop = prop;
		this.label = data[prop];
	}

	/** returns the current label
	 * @returns {string} the current label
	 */
	get label() {
		return this.ui.label.text();
	}

	/** sets the label for this dropdown item 
	 * @param {string} value the label to set
	*/
	set label(value) {
		this.ui.label.text(value);
	}

}
