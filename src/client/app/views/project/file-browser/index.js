import _ from 'lodash';

import Component from '../../../component';
import $lfs from '../../../lfs';
import $state, { ProjectItem } from '../../../state';
import FileBrowserItem from './item';
import { cancelEvent } from '../../../utils'

const DOUBLE_CLICK_DELAY = 250;

export default class FileBrowser extends Component {

	constructor(context) {
		super({
			context,
			template: 'file-browser',
			ui: {
				items: '.items',

				// runProject: '.action.run-project',
				createFolder: '.action.create-folder',
				createFile: '.action.create-file',
				removeItems: '.action.remove-items'
			}
		});

		// events
		this.listen('activate-project', this.onActivateProject);
		
		// ui events
		this.on('mouseup', '.toggle', this.onToggleFolder);
		this.on('mouseup', '.item', this.onReleaseItem);
		this.ui.createFile.on('click', this.onCreateFile);
		this.ui.createFolder.on('click', this.onCreateFolder);
		this.ui.removeItems.on('click', this.onRemoveItems);
		// this.ui.runProject.on('click', this.onRunProject);

	}

	/** @returns {FileBrowserItem} */
	getItem = target => Component.getContext(target)

	// activated when changing projects
	onActivateProject = () => {

		this.states = {
			expansion: { },
			selection: { }
		};

		// rebuild the state
		this.rebuildStructure();
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
		this.states.expansion[path] = !this.states.expansion[path];
		item.expanded = this.states.expansion[path];
	}

	// changes the selection state for an item
	toggleSelection = item => {
		const { path } = item.data;
		this.states.selection[path] = !this.states.selection[path];
		item.selected = this.states.selection[path];
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
			await $lfs.write(data.path, data.content);
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
			if (!event.shiftKey) this.clearSelections();
			this.toggleSelection(item);
		}

		return cancelEvent(event);
	}

	// dialog boxes
	onRemoveItems = () => this.broadcast('open-dialog', 'remove-items')
	onCreateFolder = () => this.broadcast('open-dialog', 'create-folder')
	onCreateFile = () => {
		const selectedFolder = '';
		this.broadcast('open-dialog', 'create-file', { selectedFolder });
	}

	// handles rebuilding the file browser structure
	rebuildStructure = () => {
		this.ui.items.empty();
		rebuild(this, this.ui.items, $state.project.children);
	}

	// clears active selections
	clearSelections = () => {
		this.states.selection = { };
		this.find('.selected').removeClass('selected');
	}

	/** @returns {FileBrowserItem[]} */
	getSelections = () => {
		const items = this.find('.selected');
		return _.map(items, this.getItem);
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
			item.expanded = fileBrowser.states.expansion[data.path];
			item.selected = fileBrowser.states.selection[data.path];

			// if this has children, create it as well
			if ('children' in data)
				rebuild(fileBrowser, item.children, data.children, depth + 1);
		});
}