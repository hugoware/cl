
import _ from 'lodash';
import $database from '../storage/database';

/** creates a user for the system
 * @param {string} data.firstName the user's first name
 * @param {string} data.lastName the user's last name
 * @param {string} data.email the user's login email address
 * @param {type} data.type the type of user
 */
export default async function createUser(data) {
	const id = await $database.generateId($database.users, 6);

	const now = +new Date;

	_.assign(data, {
		id,
		createdAt: now,
		modifiedAt: now,
		systemAccessUntil: now,
		publicAccessUntil: now
	});

	const result = $database.users.insertOne(data);

}
