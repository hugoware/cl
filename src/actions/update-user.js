
import _ from 'lodash';
import $database from '../storage/database';
import Schedule from '../schedule'

/** creates a user for the system
 * @param {string} data.id the user's id
 * @param {string} data.update the data to use
 */
export default async function updateUser(data) {
	return new Promise(async (resolve, reject) => {
		try {
			// prepare
			const id = _.trim(data.id);
			const update = JSON.parse(data.update);

			// find the account
			await $database.users.update({ id }, { $set: update });

			// just in case
			if ('classId' in update)
				await Schedule.refresh();

			resolve({ success: true });
		}
		// handle errors
		catch (err) {
			reject(err);
		}
	});

}
