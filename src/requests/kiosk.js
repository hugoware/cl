
import login from '../actions/login';
import { errorMessage } from '../utils';
import audit from '../audit';
import {kioskLogin} from '../actions/kiosk-login'

const KIOSK_KEY = 'codelab-kiosk';
const KIOSK_VALUE = 'alpha-bravo-kiosk';

// 853e952c-bbb0-4bf0-889b-eecbeb9a352e=c82cde05-c071-4505-b0a9-083976f6abd7;

export const name = 'kiosk login';
export const route = '/kiosk';
export const acceptData = true;

export async function handle(request, response, next) {

	// not configured as the kiosk
	if (request.query[KIOSK_KEY] !== KIOSK_VALUE)
		return next();

  // this is showing the login page
	if (!/post/i.test(request.method))
		return response.render('site/kiosk');
	
	// this seems to be a login attempt
	try {

		// try the login
		const result = await kioskLogin(request.body);
		if (result.success) 
			audit.log('kiosk-login-success', result.userId, result);
		else
			audit.log('kiosk-login-failed', 'unknown', result);

		// finish the login
		response.json(result);
	}
	// determine the error result
	catch (err) {
		audit.log('kiosk-login-failed', 'unknown', err);
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
		response.json({ error: err });
	}

}