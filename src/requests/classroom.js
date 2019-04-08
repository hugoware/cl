import _ from 'lodash';
import login from '../actions/classroom-login';
import log from '../log';
import audit from '../audit';

export const name = 'classroom login';
export const route = '/classroom';
export const acceptData = true;

// determines the correct home view
export async function handle(request, response) {
	let error;
	let isLoggedIn = !!(request.session && request.session.user);

	// if this is a login attempt
	if (/^post$/i.test(request.method)) {

		// check if successful
		try {
			const result = await login(request.body);
			_.assign(request.session, {
				isClassroom: true,
				user: result.user
			});

			// classroom login
			audit.log('login', result.user, { isClassroom: true });

			// login was successful
			isLoggedIn = true;
		}
		// failed to login
		catch (ex) {
			log.ex('requests/classroom.js', ex);
			error = 'Unable to login using that code!';
		}
	}

	// show the main screen
	if (isLoggedIn)
		response.redirect('/');

	// show the home page
	else
		response.render('site/classroom', { error });
}

