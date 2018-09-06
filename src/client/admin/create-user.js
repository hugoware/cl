import $ from 'jquery';

export default function setup() {
	const root = $('#create-user');
	
	// handle trying to create
	root.find('[create-user]').on('click', async () => {
		const first = root.field('first-name');
		const last = root.field('last-name');
		const email = root.field('email');
		const type = root.field('type');

		// make sure everything is provided
		if (!(first && last && email && type))
			return alert('not enough info to create user');
		
		// try and create the user
		try {
			const result = await $.request('/admin/create-user', { email, type, first, last });

			// failed request
			if (!result.success)
				return $.error('Create User', result);
			
			// create was successful
			root.find('input').val('');
			root.find('[field-type]').val('student');

			// display the message
			$.success(`Created user ${email}`);
		}
		catch (err) {
			alert('failed request: check console');
			console.log(err);
		}

	});


}