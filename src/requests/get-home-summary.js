
import getHomeSummary from '../queries/get-home-summary';
import { resolveError } from '../utils';

export const event = 'get-home-summary';
export const authenticate = true;

export async function handle(socket, session) {
	const id = session.user;
	const { isClassroom = false } = session;

	try {
		const result = await getHomeSummary(id, isClassroom);
		socket.ok(event, result);
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}