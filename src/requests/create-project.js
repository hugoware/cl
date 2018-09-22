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
		const error = resolveError(err, 'requests/create-project.js');
		socket.err(event, error);
	}
}