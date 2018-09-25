
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';
import removeProject from '../actions/remove-project';
import { resolveError } from '../utils';

export const event = 'remove-project';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const { user } = session;
	const { id } = data;

	try {
		// make sure they can access this project
		const access = await getProjectAccess(id, user);
		if (!access.write)
			throw 'access_denied';

		await removeProject(id);
		socket.ok(event, { success: true });
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}