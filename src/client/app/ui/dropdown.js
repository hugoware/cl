
import _ from 'lodash';
import Component from '../component';
import DropDownItem from './dropdown-item';
import {cancelEvent} from '../utils/index';

export default class DropDown extends Component {

	constructor(config) {
		super({
			template: 'ui-dropdown',
			ui: {
				options: '.ui-dropdown-options',
				items: '.ui-dropdown-options .items',
				current: '.current',
				label: '.current .label'
			}
		});

		// get the target element
		const target = config.$;
		
		// append the dropdown list
		target.empty();
		this.appendTo(target);

		// get some defaults
		this.defaultLabel = config.defaultLabel || target.text();
		this.config = config;

		// handle events
		this.listen('press-esc', this.onPressEsc);
		this.listen('window-resize', () => matchPosition(this));
		this.ui.current.on('mouseup', this.onShowOptions);
		this.ui.options.on('mouseup', '.ui-dropdown-item', this.onSelectOption);
		this.ui.options.on('mouseup', this.onHideOptions);
	}

	/** verifies that a dropdown list has a selection of some sort */
	get hasSelection() {
		return !!this.selection;
	}

	// handles when pressing escape out out of the menu
	onPressEsc = event => {
		const expanded = this.hasClass('show-options-menu');
		if (!expanded) return;

		this.onHideOptions();
		return cancelEvent(event);
	}

	// toggle the options menu
	onShowOptions = () => {
		this.toggleClass('show-options-menu', true);
		this.ui.options.appendTo(document.body);
		matchPosition(this);
	}

	// hides the dialog options
	onHideOptions = () => {
		this.toggleClass('show-options-menu', false);
		this.append(this.ui.options);
	} 

	// handles selecting a dialog option
	onSelectOption = item => {
		const instance = Component.getContext(item.target);
		const selection = instance.data;
		this.setSelection(selection);
	}

	/** sets the currently selected value
	 * @param {any} [item] the item to select, if any
	 */
	setSelection = (selection, silent) => {
		this.selection = selection;

		// clear the selection
		_.each(this.items, item => {
			item.toggleClass('selected', item === selection);
		});

		// replace the label
		const text = selection ? selection[this.config.prop] : this.defaultLabel;
		this.ui.label.text(text)

		// notify of the change, if needed
		if (!silent)
			this.raiseEvent('option-selected', { selection });
	}

	// create each item
	setItems = items => {
		this.ui.items.empty();

		/** @type {DropDownItem[]} the current list of items */
		this.items = _.map(items, item => new DropDownItem(item, this.config.prop));

		// organize
		_(this.items)
			.sortBy(this.config.sortBy || this.config.prop)
			.each(item => item.appendTo(this.ui.items));
	}

}


// keeps the menu position inline with the dropdown
function matchPosition(dropdown) {
	const { left, right, top, bottom } = dropdown.ui.current[0].getBoundingClientRect();
	const width = right - left;
	const height = bottom - top;
	dropdown.ui.items.css({
		width: `${width}px`,
		top: `${top + height}px`,
		left: `${left}px`,
	});
}
