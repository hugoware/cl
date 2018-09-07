import { resolveError } from '../utils';
import setAvatar from '../actions/set-avatar';

export const event = 'set-avatar';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user } = session;
	const { avatarId } = data;

	try {
		const result = await setAvatar(user, avatarId);

		// this was successful
		socket.ok(event, { success: true, avatar: result.avatar });
	}
	catch (err) {
		const error = resolveError(err, 'requests/set-avatar.js');
		socket.err(event, error);
	}

}