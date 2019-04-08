import _ from 'lodash';
import createAuthCode from '../actions/create-auth-code';

// config
export const name = 'create auth code';
export const route = '/admin/create-auth-code';
export const permissions = 'admin';
export const acceptData = true;

// determines the correct home view
export async function handle(request, response) {
	try {
		const result = await createAuthCode(request.body);
		response.json(result);
	}
	catch (err) {
		err = _.toString(err);
		response.json({ server_error: err });
	}
}