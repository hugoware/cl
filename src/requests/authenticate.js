import _ from 'lodash';
import $database from '../storage/database';

export const event = 'authenticate';
export const authenticate = true;

// summary data for a user
const USER_DATA = {
  _id: 0,
  id: 1,
  first: 1,
  last: 1,
  type: 1,
  avatar: 1,
  domain: 1,
  contacts: 1,
};

// handle the user connecting
export async function handle(socket, session) {
  // check if the user is even logged in
  if (_.isNil(session.user))
    return socket.err(event, { err: 'login_required' });

  // make sure the user exists
  const results = await $database.users
    .find({ id: session.user })
    .project(USER_DATA)
    .toArray();

  // make sure the user is found
  const user = results[0];
  if (!user) return socket.err(event, { err: 'user_not_found' });

  // update again
  session.first = user.first;
  session.last = user.last;

  // since they were found, return basic info
  socket.ok(event, { user });
}
