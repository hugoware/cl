import _ from 'lodash';
import createUser from '../actions/create-user';

// config
export const name = 'create user';
export const route = '/admin/create-user';
export const permissions = 'admin';
export const acceptData = true;

// determines the correct home view
export async function handle(request, response) {
	try {
		const result = await createUser(request.body);
		response.json(result);
	}
	catch (err) {
		err = _.toString(err);
		response.json({ server_error: err });
	}
}