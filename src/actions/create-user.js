
import _ from 'lodash';
import $database from '../storage/database';
import $date from '../utils/date';

/** creates a user for the system
 * @param {string} data.first the user's first name
 * @param {string} data.last the user's last name
 * @param {string} data.email the user's login email address
 * @param {type} data.type the type of user
 */
export default async function createUser(data) {
	return new Promise(async (resolve, reject) => {
		try {

			// clean up
			const first = _.trim(data.first);
			const last = _.trim(data.last);
			const email = _.trim(data.email);
			const type = _.trim(data.type);

			// verify info
			const errors = [ ];
			if (!_.some(first)) errors.push('first name missing');
			if (!_.some(last)) errors.push('last name missing');
			if (!_.some(email)) errors.push('email name missing');
			if (!_.some(type)) errors.push('type name missing');

			// had some errors
			if (_.some(errors))
				return resolve({ success: false, errors });

			// make sure this email isn't already there
			const existing = await $database.users.find({ email })
				.project({ id: 1 })
				.toArray();

			// check if they exist
			if (existing.length > 0)
				return resolve({ success: false, errors: [ 'email already exists' ]});

			// creates a brand new user
			const id = await $database.generateId($database.users, 6);
			const now = $date.now();
			const publicAccessUntil = $date.fromNow(1, 'year');
			const systemAccessUntil = $date.fromNow(1, 'month');

			// update all fields
			data = _.assign({ }, { first, last, email, type }, {
				id,
				progress: { },
				createdAt: now,
				modifiedAt: now,
				systemAccessUntil,
				publicAccessUntil
			});

			// make sure this 
			await $database.users.insertOne(data);
			resolve({ success: true });

		}
		// handle errors
		catch (err) {
			reject(err);
		}
	});

}
