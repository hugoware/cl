
import _ from 'lodash';
import $database from '../storage/database';

const EXPIRATION_EXTENSION = 3600000; /* one hour */

/** creates a user for the system
 * @param {string} data.id the user's id
 * @param {string} data.enabled should the user be enabled or not
 */
export default async function createUser(data) {
	return new Promise(async (resolve, reject) => {
		try {
			const { id } = data;
			const now = +new Date;

			// remove all expired auth codes
			await $database.users.update(
				{ authExpiresAt: { $lt: now } },
				{ $unset: { authExpiresAt: '', authCode: '' } });

			// try and find an open authcode
			let authCode;
			for (let i = 0; i < 15; i++) {
				authCode = createCode();

				// check if this is in use
				const existing = $database.users.find({ authCode }, { authCode: 1 })
					.project({ authCode: 1 })
					.limit(1)
					.toArray()
					.length > 0;

				// if it's unique, return it
				if (!existing)
					break;

				authCode = null;
			}

			// check if successful
			if (!authCode)
				return reject('could not create auth code');

			// since it worked, save it
			await $database.users.update({ id }, {
				$set: { authCode, authCodeExpiresAt: now + EXPIRATION_EXTENSION }
			});

			// created the new code
			resolve({ success: true, code: authCode });

		}
		// handle errors
		catch (err) {
			reject(err);
		}
	});

}

// create a new auth code
function createCode() {
	const code = (0 | (Math.random() * 999)).toString();
	return '000'.substr(code.length) + code;
}
