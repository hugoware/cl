
import { _ } from '../lib';
import $state from '../state';
import Component from '../component';
import Dialog from './';
import ErrorMessage from '../ui/error-message';
import api from '../api'

const MESSAGE_SELECT_ALL = 'Select All';
const MESSAGE_CLEAR = 'Clear Selection';

export default class ShareProjectDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-share-project',

			ui: {
				error: '.error',
				selectAll: '.select-all',
				list: '.list',
				description: '.description',

				unsentView: '.view.unsent',
				sentView: '.view.sent'
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
				
			}
		});

		this.on('click', '.person', this.onSelectPerson);
		this.ui.selectAll.on('click', this.onSelectAll);
	}

	onActivate = data => {
		this.ui.selectAll.text(MESSAGE_SELECT_ALL);
		this.setView(this.ui.unsentView);

		// add each contact
		this.people = _.map($state.contacts, (value, name) => {
			const type = /@/.test(value) ? 'email' : 'mobile';
			return { name, type, value };
		});

		// alphabetical order
		this.people.sort((a, b) => {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		});

		// attach each person
		this.ui.list.empty();
		_.each(this.people, person => {
			const item = new ShareProjectItem();
			person.item = item;
			item.refresh(person);
			item.appendTo(this.ui.list);
		});
	}

	// clear the dialog
	onDeactivate = () => {
		delete this.people;
	}


	// set the sent view
	onConfirm = async () => {

		// get each of the selected people
		const names = _(this.people)
			.filter('selected')
			.map('name')
			.value();
	
		// get the message to send
		const message = _.trim(this.ui.description.val());
		
		// must select something
		if (!(_.some(names) && _.some(message)))
			return;

		// send the request
		this.busy = true;
		try {
			const result = await api.request('share-project', {
				id: $state.project.id,
				message,
				names
			});

			// handle errors
			if (!_.get(result, 'success')) {
				this.busy = false;
				this.errorMessage.apply(result);
			}

			// this worked
			setTimeout(() => {
				this.busy = false;
				this.setView(this.ui.sentView);
			}, 500);
		}
		// failed to send
		catch(ex) {
			this.busy = false;
			this.errorMessage.apply(ex);
		}
		
	}

	// after sending, closes the dialog
	onOK = () => {
		this.hide();
	}

	// handles when selecting a person
	onSelectPerson = () => {
		const person = Component.getContext(event.target);
		person.toggleSelection();

		// update the dialog
		this.refresh();
	}

	// handles choosing to select all
	onSelectAll = () => {

		// update all of the states
		const select = !this.is('.all-selected');
		_.each(this.people, person => {
			person.item.setSelection(select);
		});

		// update the dialog
		this.refresh();
	}

	// sets the current view
	setView = view => {
		this.ui.unsentView.removeClass('current');
		this.ui.sentView.removeClass('current');
		view.addClass('current');
	}

	// update the component state
	refresh = () => {

		// check selection states
		const selected = this.find('.selected');
		const anySelected = selected.length > 0;
		const allSelected = selected.length === this.people.length;
		this.toggleClassMap({
			'has-selection': anySelected,
			'all-selected': allSelected
		});

		// update options
		this.ui.selectAll.text(allSelected ? MESSAGE_CLEAR : MESSAGE_SELECT_ALL);
	}

}


// user for the project list
class ShareProjectItem extends Component {

	constructor() {
		super({
			template: 'share-project-item',
			ui: {
				name: '.name'
			}
		});
	}

	// changes the selected state
	setSelection = selected => {
		this.data.selected = !!selected;
		this.toggleClass('selected', this.data.selected);
	}

	// toggles the selection state
	toggleSelection = () => {
		this.setSelection(!this.data.selected);
	}

	// update the item
	refresh(data) {
		this.data = data;
		this.ui.name.text(data.name);
		this.addClass(`type-${data.type}`);
	}

}