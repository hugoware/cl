
import _ from 'lodash';
import $database from '../storage/database';
import $date from '../utils/date';

/** creates a user for the system
 * @param {string} data.id the user's id
 * @param {string} data.enabled should the user be enabled or not
 */
export default async function createUser(data) {
	return new Promise(async (resolve, reject) => {
		try {
			throw 'not implemented';

			// // clean up
			// const id = _.trim(data.id);
			// const enabled = /true/i.test(_.trim(data.enabled));

			// // verify info
			// const errors = [];
			// if (!_.some(id)) errors.push('id missing');

			// // had some errors
			// if (_.some(errors))
			// 	return resolve({ success: false, errors });

			// // make sure this email isn't already there
			// const existing = await $database.users.find({ id })
			// 	.project({ id: 1 })
			// 	.toArray();

			// // check if they exist
			// if (existing.length > 0)
			// 	return resolve({ success: false, errors: ['id does not exist'] });

			// // make sure this 
			// await $database.users.update({ id }, { $set: { enabled } });
			// resolve({ success: true });

		}
		// handle errors
		catch (err) {
			reject(err);
		}
	});

}
