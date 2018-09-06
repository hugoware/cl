
import _ from 'lodash';
import $database from '../storage/database';

export default async function userHasPermissions(user, permissions) {
	return new Promise(async resolve => {	
		permissions = permissions.split(/ +/g);

		// make sure this has access
		user = _.trim(user);
		if (!user)
			return resolve(false);

		// access the user list
		const users = await $database.users
			.find({ id: user })
			.project({ type: 1 })
			.toArray();

		// check if they have access
		const hasAccess = users.length === 1 && _.includes(permissions, users[0].type);
		resolve(hasAccess);
	});
}
