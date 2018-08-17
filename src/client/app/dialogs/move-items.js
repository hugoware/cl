
import _ from 'lodash';
import $state from '../state';
import Dialog from './';
import DropDown from '../ui/dropdown';
import SelectionList from '../ui/selection-list';
import { getSelectionType } from '../utils';

export default class MoveItemsDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-move-items',

			ui: {

				type: '.type',
				folderSelection: '.folder-selection',
				selection: '.selection',

			}
		});

		this.selected = new SelectionList({
			$: this.ui.selection,
			expandSelection: true
		});

		this.targets = new DropDown({
			$: this.ui.folderSelection,
			prop: 'path'
		});

	}

	onActivate = paths => {
		this.selected.setItems(paths);

		// update
		const { displayName } = getSelectionType(paths);
		this.ui.type.text(displayName);

		// also gather a list of all folders
		const folders = _($state.folders)
			.sortBy(folder => folder.path)
			.value();

		// defines the items to display
		this.targets.setItems(folders);

	}

	onConfirm = () => {

	}

}