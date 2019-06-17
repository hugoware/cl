import $ from 'jquery';

export default function setup() {

	$('[apply-update]').on('click', async () => {

		let id, update;
		try {
			id = $('[user-update-id]').val();
			// contacts = JSON.stringify(JSON.parse($('[user-update-data]').val()));
			const data = $('[user-update-data]').val();
			eval(`update = ${data}`);
			console.log(update);
		}
		// failed to parse
		catch (ex) {
			console.log(ex);
			$.error('failed to parse update');
			return;
		}

		// send the update
		await $.request('/admin/update-user', { id, update: JSON.stringify(update) });
		$.dialog.hide();
		$.success('Updated user');

	});

	

}