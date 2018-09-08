
import setProgress from '../requests/set-progress';
import { resolveError } from '../utils';

export const event = 'set-progress';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const { projectId, state } = data;

	try {
		const result = await setProgress(projectId, state);
		socket.ok(event, result);
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}