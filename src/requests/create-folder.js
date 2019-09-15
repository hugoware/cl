import { resolveError } from '../utils';
import createFolder from '../actions/create-folder';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const event = 'create-folder';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user, isClassroom } = session;
	const { projectId, name, relativeTo } = data;

	try {
		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		const folder = await createFolder(projectId, name, relativeTo, { isClassroom });
		socket.ok(event, { success: true, folder });
	}
	catch (err) {
		const error = resolveError(err, 'requests/create-folder.js');
		socket.err(event, error);
	}

}