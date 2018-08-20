import { resolveError } from '../utils';
import moveItems from '../actions/move-items';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const event = 'move-items';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user } = session;
	const { projectId, paths, target } = data;

	try {

		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		// try and write the file content
		await moveItems(projectId, paths, target);

		// this was successful
		socket.ok(event, { success: true });
	}
	catch (err) {
		const error = resolveError(err, 'requests/move-items.js');
		socket.err(event, error);
	}

}