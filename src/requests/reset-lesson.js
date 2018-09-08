
import createLesson from '../actions/create-lesson';
import { resolveError } from '../utils';

export const event = 'reset-lesson';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const ownerId = session.user
	const { lessonId } = data;

	try {
		const result = await createLesson(lessonId, ownerId);
		socket.ok(event, result);
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}