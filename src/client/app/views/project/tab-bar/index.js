
import _ from 'lodash';
import Component from '../../../component';
import ComponentList from '../../../component-list';
import Tab from './tab';

export default class TabBar extends Component {

	constructor() {
		super({
			template: 'tab-bar',
			ui: {
				items: '.items',
			}
		});
		
		// the tabs to use
		this.tabs = new ComponentList({
			$: this.ui.items
		});

		// events
		this.listen('activate-file', this.onActivateFile);
		this.on('click', '.close', this.onCloseTab);
		this.on('click', '.tab', this.onSelectTab);
	}

	// handles opening or activating new tab
	onActivateFile = file => {

		// create or reuse a tab
		let tab = this.tabs.findItem(item => item.file.path === file.path);
		if (!tab) {
			tab = new Tab(file);
			this.tabs.appendItem(tab);
		}

		// focus and update
		tab.refresh();
		this.setActive(tab);
		this.tabs.refresh();
	}

	onSelectTab = event => {
		const tab = Component.getContext(event.target);
		if (!tab) return;

		// change the active tab
		this.setActive(tab);
		this.broadcast('activate-file', tab.file);
	}

	// handles closing a tab
	onCloseTab = event => {
		const tab = Component.getContext(event.target);
		
		// finds the tab to focus instead
		const replace = this.tabs.itemBefore(tab) || this.tabs.itemAfter(tab);

		// remove the tab first
		this.tabs.removeItem(tab);
		this.tabs.refresh();
		
		// if there's a new tab selected, update it
		if (replace) {
			this.setActive(replace);
			this.broadcast('activate-file', replace.file);
		}
	}

	// sets the actively viewed tab
	setActive = tab => {
		this.find('.tab').removeClass('active');
		if (tab) tab.addClass('active');
	}

}