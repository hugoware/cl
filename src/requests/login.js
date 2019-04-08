
import login from '../actions/login';
import { errorMessage } from '../utils';
import audit from '../audit';

export const name = 'default login';
export const route = '/login';
export const acceptData = true;

export async function handle(request, response) {

  // this is showing the login page
	if (!/post/i.test(request.method))
		return response.redirect('/');
	
	// this is a login attempt
	try {
		const data = request.body || { };
		const result = await login(data);

    // set the user identity
		request.session.user = result.user;

		// home login
		audit.log('login', result.user, { isClassroom: false });
		response.json({ success: true });
	}
	// determine the error result
	catch (err) {
		err = errorMessage(err, {
			authentication_error: 'Unable to authenticate the account selected',
			database_error: 'Internal server error',
			account_error: 'Login error - Please contact the admin',
			account_not_found: 'User has not been signed up for CodeLab access',
			account_disabled: 'This account does not have access to CodeLab',
			account_expired: 'This account has expired and no longer has access to CodeLab',
			default: 'an unknown error has ocurred'
		});

		// give back the error
		response.json({ error: err });
	}

}
