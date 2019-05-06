import _ from 'lodash';
import manageContacts from '../actions/manage-contacts';

// config
export const name = 'manage contacts';
export const route = '/admin/manage-contacts';
export const permissions = 'admin';
export const acceptData = true;

// sets the contacts for an account
export async function handle(request, response) {
	try {
		const result = await manageContacts(request.body);
		response.json(result);
	}
	catch (err) {
		err = _.toString(err);
		response.json({ server_error: err });
	}
}