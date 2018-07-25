
import _ from 'lodash';
import { OAuth2Client } from 'google-auth-library';

import $config from '../config';
import $database from '../storage/database';

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
	const results = await $database.users
		.find({ email })
		.project({ systemAccessUntil: 1, disabled: 1, id: 1 })
		.toArray();

	// make sure something was found
	if (results.length === 0)
		throw 'user_not_found';

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
	const now = +new Date;
	const { id } = user;
	await $database.users.update({ id }, {
		$set: { lastLoginAt: now }
	});

	// give back the user ID
	return { user: id };
}