
import login from '../actions/login';
import { errorMessage } from '../utils';

export const name = 'default login';
export const route = '/login';
export const acceptData = true;

export async function handle(request, response) {

  // this is showing the login page
	if (!/post/i.test(request.method))
		return this.render('site/login');
	
	// this is a login attempt
	try {
		const data = request.body || { };
		const result = await login(data);

    // set the user identity
		request.session.user = result.user;
		response.json({ success: true });
	}
	// determine the error result
	catch (err) {
		err = errorMessage(err, {
			authentication_error: 'Unable to authenticate account',
			database_error: 'Internal server error',
			account_error: 'Service error - please contact the admin',
			account_not_found: 'User has not been registered for this service',
			account_disabled: 'This account has lost access',
			account_expired: 'This account has lost access',
			default: 'an unknown error has ocurred'
		});

		// give back the error
		response.json({ error: err });
	}

}
