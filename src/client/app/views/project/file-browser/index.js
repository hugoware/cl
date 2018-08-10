import _ from 'lodash';

import Component from '../../../component';
import $lfs from '../../../lfs';
import $state, { ProjectItem } from '../../../state';
import FileBrowserItem from './item';
import FileBrowserActions from './actions';
import { cancelEvent } from '../../../utils'

const DOUBLE_CLICK_DELAY = 250;

export default class FileBrowser extends Component {

	constructor(context) {
		super({
			context,
			template: 'file-browser',
			ui: {
				items: '.items',

				// meta info
				data: '.project-data',
				name: '.project-data .name',
				description: '.project-data .description',

			}
		});

		// add the action list
		this.actions = new FileBrowserActions();
		this.append(this.actions);

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('delete-items', this.onDeleteItems);
		
		// ui events
		this.on('mouseup', '.toggle', this.onToggleFolder);
		this.on('mouseup', '.item', this.onReleaseItem);
		this.on('mouseup', this.onDeselectItems);

	}

	/** @returns {FileBrowserItem} */
	getItem = target => Component.getContext(target)

	// activated when changing projects
	onActivateProject = () => {
		$state.clearSelection();
		this.expanded = { };

		// update basic data
		const { project } = $state;
		this.ui.name.text(project.name);
		this.ui.description.text(project.description);
		
		// update the project type
		let className = this.ui.data.attr('class') || '';
		className = className.replace(/type\-[a-z0-9]+/gi, '');
		this.ui.data.attr('class', className);
		this.ui.data.addClass(`type-${project.type}`);

		// rebuild the state
		this.rebuildStructure();
	}

	// reset the whole structure
	onDeleteItems = () => {
		this.clearSelection();
		this.rebuildStructure();
	}

	// handles when clicking outside of the main area
	onDeselectItems = () => {
		this.clearSelection();
	}

	// handles when a folder toggle is selected
	onToggleFolder = event => {
		const item = this.getItem(event.target);
		this.toggleExpansion(item);
		return cancelEvent(event);
	}

	// changes the toggle state for an item
	toggleExpansion = item => {
		const { path } = item.data;
		this.expanded[path] = !this.expanded[path];
		item.expanded = this.expanded[path];
	}

	// changes the selection state for an item
	toggleSelection = item => {
		const { path } = item.data;
		$state.selected[path] = !$state.selected[path];
		item.selected = $state.selected[path];

		// update allowed actions
		this.updateActions();
	}

	/** activates an item depending on the type 
	 * @param {ProjectItem} item 
	 */
	onActivateItem = async (item) => {
		const { data } = item;

		// handle folders
		if (data.isFolder) {
			this.toggleExpansion(item);
		}

		// handle files
		else if (data.isFile) {

			// before activating a file, update the middleware file system
			// to use the active file content
			await $state.openFile(data.path);
			this.broadcast('activate-file', data);
		}

	}

	// tracking of double clicks
	onReleaseItem = event => {
		const item = this.getItem(event.target);
		
		// handle double click events
		if (item.delay) {
			delete item.delay;
			this.onActivateItem(item);
		}
		// wait a moment to allow double clicks
		else {
			item.delay = setTimeout(() => delete item.delay, DOUBLE_CLICK_DELAY);

			// update selection
			if (!event.shiftKey) this.clearSelection();
			this.toggleSelection(item);
		}

		return cancelEvent(event);
	}

	// handles rebuilding the file browser structure
	rebuildStructure = () => {
		this.ui.items.empty();
		rebuild(this, this.ui.items, $state.project.children);
	}

	// clears active selections
	clearSelection = () => {
		$state.clearSelection();
		this.find('.selected').removeClass('selected');
		this.updateActions();
	}

	// /** @returns {FileBrowserItem[]} */
	// getSelections = () => {
	// 	const items = this.find('.selected');
	// 	return _.map(items, this.getItem);
	// }

	/** updates the action list */
	updateActions() {
		const paths = _.keys($state.selected);
		const selections = _.map(paths, $state.findItemByPath);
		this.actions.update(selections);
	}

}

// reconstructs the file tree
function rebuild(fileBrowser, node, children, depth = 0) {
	_(children)
		.orderBy(['isFolder', 'name'], ['desc', 'asc'])
		.each(data => {

			// create each item
			const item = new FileBrowserItem();
			item.update(data, depth);
			item.appendTo(node);

			// toggle state
			item.expanded = fileBrowser.expanded[data.path];
			item.selected = $state.selected[data.path];

			// if this has children, create it as well
			if ('children' in data)
				rebuild(fileBrowser, item.children, data.children, depth + 1);
		});
}