
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';
import finishLesson from '../actions/finish-lesson';
import { resolveError } from '../utils';

export const event = 'finish-lesson';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const { user } = session;
	const { projectId } = data;

	try {
		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		await finishLesson(user, projectId);
		socket.ok(event, { success: true });
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}