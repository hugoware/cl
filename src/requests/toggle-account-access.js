import _ from 'lodash';
import toggleAccountAccess from '../actions/toggle-account-access';

// config
export const name = 'toggle account access';
export const route = '/admin/toggle-account-access';
export const permissions = 'admin';
export const acceptData = true;

// determines the correct home view
export async function handle(request, response) {
	try {
		const result = await toggleAccountAccess(request.body);
		response.json(result);
	}
	catch (err) {
		err = _.toString(err);
		response.json({ server_error: err });
	}
}