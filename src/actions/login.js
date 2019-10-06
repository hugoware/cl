
import _ from 'lodash';
import { OAuth2Client } from 'google-auth-library';

import $config from '../config';
import $database from '../storage/database';
import $date from '../utils/date';
import audit from '../audit';

/** @typedef {Object} LoginResult
 * @prop {string} user The id for the logged in user
 */

/** Tries to login the user with a Google token
 * @returns {LoginResult} The login attempt result
 */
export default async function login(data = { }) {
  const token = _.trim(data.token);

	// nothing to validate
	if (!token)
		throw 'authentication-error';

	// authenticate the token
	const clientId = $config.googleWebclientId;
	const client = new OAuth2Client(clientId);
	const params = { idToken: token, audience: clientId };
	const result = await client.verifyIdToken(params);

	// get the result
	const payload = result.getPayload();
	const email = payload.email;
	const verified = payload.email_verified;

	// check everything
	if (!verified)
		throw 'account_invalid';

	// try and find the account
	let results = await $database.users
		.find({ email })
		.project({
			systemAccessUntil: 1,
			disabled: 1,
			type: 1,
			id: 1
		})
		.toArray();

	// make sure there's something to work with
	if (!_.isArray(results))
		results = [ ];

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
	const { id, type } = user;
	await $database.users.update({ id }, {
		$set: { lastLoginAt: now }
	});

	// give back the user ID
	return { user: id, role: type };
}