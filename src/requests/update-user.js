import _ from 'lodash';
import updateUser from '../actions/update-user';

// config
export const name = 'update user';
export const route = '/admin/update-user';
export const permissions = 'admin';
export const acceptData = true;

// sets the contacts for an account
export async function handle(request, response) {
	try {
		const result = await updateUser(request.body);
		response.json(result);
	}
	catch (err) {
		err = _.toString(err);
		response.json({ server_error: err });
	}
}