import _ from 'lodash';
import $ from 'jquery';

let $records;

export default function setup() {
	const root = $('#manage-user');
	const list = root.find('.results');

	root.on('click', '.manage-contacts', async event => {
		const record = getRecord(event);
		const id = record.attr('user-id');
		const data = _.find($records, { id });

		// update the dialog
		$('[contact-list]').val(JSON.stringify(data.contacts || { }, null, 2));
		$('[contact-id]').val(data.id);
		$.dialog('manage-contacts');
	});

	// manage the access
	root.on('click', '.toggle-account-access', async event => {
		const record = getRecord(event);
		const id = record.attr('user-id');
		const name = record.find('.name').text();
		const disabled = record.hasClass('is-disabled');

		// try and toggle
		try {
			const result = await $.request('/admin/toggle-account-access', { id, disabled: !disabled });
			if (!result.success)
				return $.error('Toggle Account Access', result);
		
			// display the message
			const newState = result.disabled ? 'disabled' : 'enabled';
			$.success(`User ${name} is now ${newState}`);

			// update the state
			record.toggleClass('is-disabled', result.disabled);
		}
		// failed
		catch (ex) {
			$.error('Auth code error', { ex });
		}
	});
	
	// create the auth code
	root.on('click', '.create-auth-code', async event => {
		const record = getRecord(event);
		const id = record.attr('user-id');

		// try and toggle
		try {
			const result = await $.request('/admin/create-auth-code', { id });
			if (!result.success)
			return $.error('Create Auth Code', result);
			
			// display the message
			$.success(`Auth code created: ${result.code}`);
		}
		// failed
		catch(ex) {
			$.error('Auth code error', { ex });
		}
	});

	const performSearch = async () => {
		const phrase = root.field('search').trim();
		if (phrase.length === 0) return;

		// make sure everything is provided
		if (!phrase)
			return alert('enter a search phrase');

		// try and create the user
		try {
			const result = await $.request('/admin/find-user', { phrase });

			// failed request
			if (!result.success)
				return $.error('Find User', result);

			// create each result
			list.empty();

			// create the records
			$records = [ ];
			const { results } = result;
			if (results.length === 0) {
				list.append('<div class="no-results" >No results found</div>');
			}
			// setup each item
			else {

				// create each record
				for (const item of results) {
					$records.push(item);
					const record = createRecord(item);
					list.append(record);
				}
			}

		}
		catch (err) {
			alert('failed request: check console');
			console.log(err);
		}
	};

	// handle trying to create
	root.on('click', '[find-user]', performSearch);
	root.on('keydown', '[field-search]', event => {
		if (event.keyCode !== 13) return;
		performSearch(event);
	});

}

// finds the id for a record
function getRecord(event) {
	return $(event.target).closest('.record');
}

// create a new managed record
function createRecord(item) {
	const disabled = !!item.disabled;
	const record = $(`<div class="record ${disabled && 'is-disabled'}" user-id="${item.id}" >
		<div class="name size-4" ></div>
		<div class="email size-3" ></div>
		<div class="actions size-3" >
			<button class="create-auth-code" >Auth Code</button>
			<button class="manage-contacts" >Manage Contacts</button>
			<button class="toggle-account-access" >
				<span class="is-enabled" >Disable</span>
				<span class="is-disabled" >Enable</span>
			</button>
		</div>
	</div>`);

	// populate the record
	record.attr('user-id', item.id);
	record.find('.name').text(`${item.last}, ${item.first}`);
	record.find('.email').text(item.email);
	
	return record;
}