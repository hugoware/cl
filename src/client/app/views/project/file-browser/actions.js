/// <reference path="../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../state';
import Component from '../../../component';
import { cancelEvent } from '../../../utils/index';

// handles managing actions for the file browser
export default class FileBrowserActions extends Component {

	constructor() {
		super({
			template: 'file-browser-actions',

			ui: {
				createFolder: '.action.create-folder',
				createFile: '.action.create-file',
				deleteItems: '.action.delete-items',
				moveItems: '.action.move-items',
				renameItem: '.action.rename-item'
			}
		});

		// handle actions
		this.ui.createFile.on('click', this.onCreateFile);
		this.ui.createFolder.on('click', this.onCreateFolder);
		this.ui.deleteItems.on('click', this.onDeleteItems);
		this.ui.moveItems.on('click', this.onMoveItems);
		this.ui.renameItem.on('click', this.onRenameItem);
		this.on('mouseup', cancelEvent);

		// when first created
		this.update();
	}

	get allowRenameItem() {
		return this.isSingleItem;
	}

	get allowMoveItems() {
		return this.hasSelection;
	}

	get allowDeleteItems() {
		return this.hasSelection;
	}

	get allowCreateFile() {
		return !this.hasSelection || (this.isSingleItem && this.isOnlyFolders);
	}
	
	get allowCreateFolder() {
		return !this.hasSelection || (this.isSingleItem && this.isOnlyFolders);
	}

	/** handles when selections are changed
	 * @param {ProjectItem[]} selection the items selected
	 */
	update = (selection = []) => {
		this.selection = selection;

		// determine what's selected
		const count = _.size(selection);
		this.isMultipleItems = count > 1;
		this.isSingleItem = count === 1;
		this.hasSelection = count > 0;
		this.isOnlyFiles = this.hasSelection && _.every(selection, { isFile: true });
		this.isOnlyFolders = this.hasSelection && _.every(selection, { isFolder: true });
		this.isMixedSelection = this.hasSelection && !this.isOnlyFiles && !this.isOnlyFolders;

		// update the available options
		this.toggleClassMap({
			'mixed-selection': this.isMixedSelection,
			'only-files': this.isOnlyFiles,
			'only-folders': this.isOnlyFolders,
			'has-selection': this.hasSelection,
			'multi-selection': this.isMultipleItems,
			'single-selection': this.isSingleItem,

			// action activation
			'allow-create-folder': this.allowCreateFolder,
			'allow-create-file': this.allowCreateFile,
			'allow-move-items': this.allowMoveItems,
			'allow-delete-items': this.allowDeleteItems,
			'allow-rename-item': this.allowRenameItem
		});
	}

	// showing dialogs
	onRenameItem = () => {
		const selection = $state.getSelection();
		const item = _.first(selection);
		this.broadcast('open-dialog', 'rename-item', item);
	}

	onDeleteItems = () => {
		const selection = $state.getSelection();
		this.broadcast('open-dialog', 'remove-items', selection);
	}

	onMoveItems = () => {
		const selection = $state.getSelection(true);
		this.broadcast('open-dialog', 'move-items', selection);
	}
	
	// tries to launch the create folder dialog
	onCreateFolder = () => {
		if (!this.allowCreateFolder) return;
		const folder = _.first(this.selection);
		this.broadcast('open-dialog', 'create-folder', { folder });
	}
	
	onCreateFile = () => {
		const folder = _.first(this.selection);
		this.broadcast('open-dialog', 'create-file', { folder });
	}

}