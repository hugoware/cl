import _ from 'lodash';
import { OAuth2Client } from 'google-auth-library';

import $config from '../config';
import $database from '../storage/database';
import $date from '../utils/date';
import audit from '../audit';
import { randomName } from '../utils/name';

/** @typedef {Object} LoginResult
 * @prop {string} user The id for the logged in user
 */

/** Tries to login the user with a Google token
 * @returns {LoginResult} The login attempt result
 */
export default async function login(data = {}) {
  const now = $date.now();
  const token = _.trim(data.token);

  // nothing to validate
  if (!token) throw 'authentication-error';

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
  if (!verified) throw 'account_invalid';

  // try and find the account
  let results = await $database.users
    .find({ email })
    .project({
      first: 1,
      last: 1,
      systemAccessUntil: 1,
      disabled: 1,
      type: 1,
      id: 1,
    })
    .toArray();

  // make sure there's something to work with
  if (!_.isArray(results)) results = [];

  // if free accounts are disabled, and this
  // is an account that previously had access
  if (
    results.length === 1 &&
    results[0].type === 'free' &&
    !$config.allowFreeAccounts
  ) {
    results = [];
  }

  // make sure something was found
  if (results.length === 0 && $config.allowFreeAccounts) {
    const name = randomName(email);

    // save the result
    const type = 'free';
    const id = await $database.generateId($database.users, 10);
    const user = await $database.users.insertOne({
      id,
      email,
      first: name,
      last: '(Student)',
      type,
      disabled: false,
      createdAt: now,
      lastLoginAt: now,
    });

    // save the resut
    results[0] = { id, type };
  }

  // too many user
  if (results.length > 1) throw 'account_error';

  // nothing was found
  if (results.length <= 0) throw 'account_missing';

  // make sure the account can be used
  const user = results[0];
  if (user.disabled) throw 'account_disabled';

  // check for account expiration
  // systemAccessUntil

  // successful login, update the account
  const { id, type, first, last } = user;
  await $database.users.update(
    { id },
    {
      $set: { lastLoginAt: now },
    }
  );

  // give back the user ID
  return { user: id, first, last, role: type };
}
