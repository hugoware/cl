/// <reference path="../../../types/index.js" />

import _ from 'lodash';
import Component from '../../../component';

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

		// when first created
		this.update();
	}

	get allowRenameItem() {
		return this.isSingleItem;
	}

	get allowMoveItem() {
		return this.hasSelection;
	}

	get allowDeleteItem() {
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
			'is-mixed': this.isMixedSelection,
			'only-files': this.isOnlyFiles,
			'only-folders': this.isOnlyFolders,
			'has-selection': this.hasSelection,
			'multi-selection': this.isMultipleItems,
			'single-selection': this.isSingleItem,

			// action activation
			'allow-create-folder': this.allowCreateFolder,
			'allow-create-file': this.allowCreateFile,
			'allow-move-item': this.allowMoveItem,
			'allow-delete-item': this.allowDeleteItem,
			'allow-rename-item': this.allowRenameItem
		});
	}

	// showing dialogs
	onDeleteItem = () => this.broadcast('open-dialog', 'remove-items')
	onMoveItem = () => this.broadcast('open-dialog', 'move-items')
	onRenameItem = () => this.broadcast('open-dialog', 'rename-item')
	onCreateFolder = () => this.broadcast('open-dialog', 'create-folder')
	onCreateFile = () => {
		const selectedFolder = '';
		this.broadcast('open-dialog', 'create-file', { selectedFolder });
	}

}