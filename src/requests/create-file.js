import { resolveError } from '../utils';

import createFile from '../actions/create-file';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const event = 'create-file';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user } = session;
	const { projectId, path } = data;

	try {
		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		const file = await createFile(projectId, path);
		socket.ok(event, { success: true, file });
	}
	catch (err) {
		const error = resolveError(err, 'requests/create-file.js');
		socket.err(event, error); 
	}

}