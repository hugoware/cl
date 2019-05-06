import $ from 'jquery';

export default function setup() {

	$('[save-contacts]').on('click', async () => {

		let id, contacts;
		try {
			id = $('[contact-id]').val();
			contacts = JSON.stringify(JSON.parse($('[contact-list]').val()));
		}
		// failed to parse
		catch (ex) {
			console.log(ex);
			$.error('failed to parse contacts');
			return;
		}

		// send the update
		await $.request('/admin/manage-contacts', { id, contacts });
		$.dialog.hide();
		$.success('Updated contacts');

	});

	

}