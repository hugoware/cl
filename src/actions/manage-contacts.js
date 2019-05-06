
import _ from 'lodash';
import $database from '../storage/database';

/** creates a user for the system
 * @param {string} data.id the user's id
 * @param {string} data.contacts the contacts to use
 */
export default async function manageContacts(data) {
	console.log(data);
	return new Promise(async (resolve, reject) => {
		try {
			// prepare
			const id = _.trim(data.id);
			const contacts = JSON.parse(data.contacts);

			// find the account
			await $database.users.update({ id }, { $set: { contacts } });
			resolve({ success: true });
		}
		// handle errors
		catch (err) {
			reject(err);
		}
	});

}
