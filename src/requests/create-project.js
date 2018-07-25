import log from '../log';
import { handleError, createError } from '../utils/errors';
import createProject from '../actions/create-project';

export const event = 'create-project';
export const authenticate = true;

// handles creating an entirely new project
export async function handle(socket, session, data = { }) {
	data.ownerId = session.user;

	try {
		const result = await createProject(data);
		socket.ok(event, result);
	}
	catch (err) {
		handleError(err, {
			name_already_exists: () =>
				socket.ok(event, createError('name', 'already_exists')),

			user_not_found: () =>
				socket.ok(event, createError('user', 'not_found')),

			unknown: () => {
				log.ex('requests/create-project.js', err);
				socket.err(event, createError('server'));
			}
		});

	}
}