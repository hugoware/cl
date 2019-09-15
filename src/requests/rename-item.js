import { resolveError } from '../utils';
import renameItem from '../actions/rename-item';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const event = 'rename-item';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user, isClassroom } = session;
	const { projectId, source, target } = data;

	try {

		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		// try and write the file content
		await renameItem(projectId, source, target, { isClassroom });

		// this was successful
		socket.ok(event, { success: true });
	}
	catch (err) {
		const error = resolveError(err, 'requests/rename-item.js');
		socket.err(event, error); 
	}

}