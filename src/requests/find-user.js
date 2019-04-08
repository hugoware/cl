import _ from 'lodash';
import findUser from '../queries/find-user';

// config
export const name = 'find user';
export const route = '/admin/find-user';
export const permissions = 'admin';
export const acceptData = true;

// determines the correct home view
export async function handle(request, response) {
	try {
		const result = await findUser(request.body.phrase);
		response.json(result);
	}
	catch (err) {
		err = _.toString(err);
		response.json({ server_error: err });
	}
}