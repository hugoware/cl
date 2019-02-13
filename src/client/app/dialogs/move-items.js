
import { _ } from '../lib';
import $state from '../state';
import Dialog from './';
import DropDown from '../ui/dropdown';
import SelectionList from '../ui/selection-list';
import { getSelectionInfo } from '../utils';

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

		// components
		this.selected = new SelectionList({
			$: this.ui.selection,
			expandSelection: true
		});

		this.targets = new DropDown({
			$: this.ui.folderSelection,
			prop: 'path'
		});

		// events
		this.targets.on('option-selected', this.onTargetChanged);

	}

	// checks to see if a move will overwrite something else
	onTargetChanged = event => {
		const { selection } = event;
		if (!selection) return;

		// check for the target path
		const target = $state.findItem(selection);
		const selected = this.selected.items;

		// check for conflicts with this move
		const { hasConflicts, isSame } = checkForConflicts(selected, target);
		this.toggleClass('has-conflicts', hasConflicts);
	}

	// handles showing the view
	onActivate = paths => {
		this.selected.setItems(paths);
		this.removeClass('has-conflicts');

		// update
		const { displayNameWithCount } = getSelectionInfo(paths);
		this.ui.type.text(displayNameWithCount);

		// also gather a list of all folders
		const folders = _($state.folders)
			.sortBy(folder => folder.path)
			.value();

		// always include the root
		folders.unshift({ path: '/' });

		// defines the items to display
		this.targets.setItems(folders);
	}

	// performs the file move
	onConfirm = async () => {

		// make sure a target has been selected
		if (!this.targets.hasSelection)
			return;

		// gather the paths
		const selection = _.map(this.selected.items, 'path');
		const target = this.targets.selection.path;

		// send the request
		this.busy = true;
		try {
			await $state.moveItems(selection, target);
			this.hide();
		}
		catch (err) {
			console.log(err);
		}
		finally {
			this.busy = false;
		}

	}

}


// checks to see if any overwrites will take place when
// moving all of the files
function checkForConflicts(items, target) {
	target = $state.findItem(target);
	
	// get the updated move names
	const path = target ? target.path : '';
	const locations = _.map(items, item => {
		item = $state.findItem(item);
		const name = item.path.split('/').pop();
		return { 
			origin: item.path,
			destination: `${path}/${name}`
		};
	});

	// next, check each for conflicts
	let same = 0;
	let conflicted = 0;
	_.every(locations, item => {

		// check if the exact same location
		const noop = item.origin === item.destination;
		if (noop) return same++;
		
		// is conflicted
		const exists = $state.findItemByPath(item.destination);
		if (exists) conflicted++;
	});
	
	// check for results
	const total = _.size(locations);
	const isSame = same === total;
	const hasConflicts = conflicted > 0;
	const isSafe = !hasConflicts;

	// check for conflicts
	return { isSafe, hasConflicts, isSame };
}