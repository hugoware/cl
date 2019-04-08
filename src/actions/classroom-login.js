
import _ from 'lodash';

import $database from '../storage/database';
import $date from '../utils/date';

/** @typedef {Object} LoginResult
 * @prop {string} user The id for the logged in user
 */

/** Tries to login the user with a Google token
 * @returns {LoginResult} The login attempt result
 */
export default async function login(data = {}) {
	console.log('try login');
	const token = _.trim(data.token);

	// nothing to validate
	if (!token)
		throw 'authentication_error';

	// try and find the account
	const results = await $database.users
		.find({ authCode: token, authCodeExpiresAt: { $gt: +new Date } })
		.project({
			systemAccessUntil: 1,
			authCodeExpiresAt: 1,
			disabled: 1,
			id: 1 
		})
		.toArray();

	// make sure something was found
	if (results.length === 0)
		throw 'account_not_found';

	// too many user
	if (results.length > 1)
		throw 'account_error';

	// make sure the account can be used
	const user = results[0];
	if (user.disabled)
		throw 'account_disabled';

	// check for account expiration
	// systemAccessUntil

	// successful login, update the account
	const now = $date.now();
	const { id } = user;
	await $database.users.update({ id }, {
		$set: { lastLoginAt: now }
	});

	// give back the user ID
	return { user: id };
}