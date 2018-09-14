
import $database from '../storage/database';
import createLesson from '../actions/create-lesson';
import { resolveError } from '../utils';

export const event = 'reset-lesson';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const ownerId = session.user
	const { lessonId } = data;

	try {
		const records = await $database.projects.find({ id: lessonId })
			.project({ _id: 0, lesson: 1 })
			.toArray();

		// make sure this was found
		if (records.length !== 1)
			throw 'lesson_not_found';

		// recreate the project
		const item = records[0];
		const result = await createLesson(item.lesson, ownerId);
		console.log('result', result);
		socket.ok(event, result);
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}