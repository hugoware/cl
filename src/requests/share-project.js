import { resolveError } from '../utils';
import shareProject from '../actions/share-project';

export const event = 'share-project';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user } = session;
	const { message, id, names } = data;

	try {
		await shareProject(user, id, message, names);

		// this was successful
		socket.ok(event, { success: true });
	}
	catch (err) {
		const error = resolveError(err, 'requests/share-project.js');
		socket.err(event, error);
	}

}