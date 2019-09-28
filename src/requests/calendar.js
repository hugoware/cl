
import { errorMessage } from '../utils';
import getCalendar from '../queries/get-calendar'

// const KIOSK_KEY = 'codelab-kiosk';
// const KIOSK_VALUE = 'alpha-bravo-kiosk';
// 853e952c-bbb0-4bf0-889b-eecbeb9a352e=c82cde05-c071-4505-b0a9-083976f6abd7;

export const name = 'calendar';
export const route = '/calendar';
export const authenticate = true;
export const permissions = 'admin';

export async function handle(request, response, next) {
	
	// this seems to be a login attempt
	try {
		const calendar = await getCalendar();
		response.render('site/calendar', calendar);
	}
	// determine the error result
	catch (err) {
		console.log(err);
		err = errorMessage(err, {
			// authentication_error: 'Unable to authenticate the account selected',
			// database_error: 'Internal server error',
			// account_error: 'Login error - Please contact the admin',
			// account_not_found: 'User has not been signed up for CodeLab access',
			// account_disabled: 'This account does not have access to CodeLab',
			// account_expired: 'This account has expired and no longer has access to CodeLab',
			// default: 'an unknown error has ocurred'
		});

		// give back the error
		response.send(err);
		// response.json({ error: err });
	}

}