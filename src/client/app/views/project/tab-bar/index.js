
import { _ } from '../../../lib';
import Component from '../../../component';
import ComponentList from '../../../component-list';
import Tab from './tab';
import $state from '../../../state';
import { requirePermission } from '../prevent';
import { cancelEvent } from '../../../utils';
import contentManager from '../../../content-manager'

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
		this.listen('reset', this.onReset);
		this.listen('activate-file', this.onActivateFile);
		this.listen('open-file', this.onOpenFile);
		this.listen('delete-items', this.onDeleteItems);
		this.listen('rename-item', this.onRenameItem);
		this.listen('activate-project', this.onActivateProject);
		this.on('click', '.close', this.onCloseTab);
		this.on('click', '.tab', this.onSelectTab);
	}

	// reset when first switching to a project view
	onReset = () => {
		this.tabs.clear();
		this.tabs.refresh();
	}

	// handles opening or activating new tab
	onActivateFile = file => {
		this.openTab(file);
	}

	// handles opening and just adding the tab to the view
	onOpenFile = file => {
		this.openTab(file, true);
	}

	/** remove items that were recently deleted
	 * @param {string} paths the paths of the deleted items
	 */
	onDeleteItems = paths => {
		const tabs = this.tabs.filterItems(item => _.includes(paths, item.file.path));
		const last = tabs.length - 1;
		_.each(tabs, (tab, index) => {
			this.closeTab(tab, index === last);
		});
	}

	// for now, just update the names
	onRenameItem = () => {
		_.each(this.tabs.items, tab => tab.refresh());
	}

	// handles changing tabs
	onSelectTab = event => {

		// get the tab
		const tab = Component.getContext(event.target);
		if (!tab) return;

		// if this tab is already the active one
		if (tab.is('.active')) return;

		requirePermission({
			requires: [ 'CHANGE_TAB' ],
			message: "Can't Switch Files",
			allowed: () => {
				this.setActive(tab);
				this.broadcast('activate-file', tab.file);
			}
		});
	}

	// handles closing a tab
	onCloseTab = event => {
		requirePermission({
			requires: [ 'CLOSE_FILE' ],
			message: "Can't Close Files",
			allowed: () => {
				const tab = Component.getContext(event.target);

				// check for unsaved changes
				if (tab.file.modified)
					this.broadcast('open-dialog', 'unsaved-changes', {
						file: tab.file,
						reason: 'closing',
						confirm: () => {
							tab.file.modified = false;
							this.closeTab(tab, true);
						}
					});

				// just close it
				else this.closeTab(tab, true);
			}
		});

		return cancelEvent(event);
	}

	/** opens a new tab item
	 * @param {ProjectItem} file the file to open as a tab
	 * @param {boolean} maintainActiveTab keeps the current active tab as focused
	 */
	openTab = (file, maintainActiveTab) => {

		// create or reuse a tab
		let tab = this.tabs.findItem(item => item.file.path === file.path);
		if (!tab) {
			tab = new Tab(file);
			this.tabs.appendItem(tab);
		}

		// focus and update
		tab.refresh();
		if (!maintainActiveTab) this.setActive(tab);
		this.tabs.refresh();
	}

	// handle closing the tab view
	closeTab = (tab, activateNearestTab = false) => {

		// finds the tab to focus instead
		const replace = activateNearestTab && (this.tabs.itemBefore(tab) || this.tabs.itemAfter(tab));

		// remove the tab first
		this.broadcast('close-file', tab.file);
		this.tabs.removeItem(tab);
		this.tabs.refresh();

		// we need to remove the cached info
		contentManager.remove(tab.file.path);

		// if there's a new tab selected, update it
		if (!!replace) {
			this.setActive(replace);
			this.broadcast('activate-file', replace.file);
		}
		// there's nothing to show -- deactivate the view
		else {
			this.broadcast('clear-workspace');
		}
	}

	// sets the actively viewed tab
	setActive = tab => {
		this.find('.tab').removeClass('active');
		if (tab) tab.addClass('active');
	}

}