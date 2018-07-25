
import getHomeSummary from '../queries/get-home-summary';
import { resolveError } from '../utils';

export const event = 'get-home-summary';
export const authenticate = true;

export async function handle(socket, session) {
	const id = session.user;

	try {
		const result = await getHomeSummary(id);
		socket.ok(event, result);
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}