
import { resolveError } from '../utils';
import activateLesson from '../actions/activate-lesson'

export const event = 'activate-lesson';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user } = session;
	const { id } = data;

	try {
		const result = await activateLesson(id, user);
		socket.ok(event, result);
	}
	catch (err) {
		const error = resolveError(err, 'requests/activate-lesson.js');
		socket.err(event, error);
	}

}