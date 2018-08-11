import log from '../log';
import { handleError, createError } from '../utils/index';

import createFile from '../actions/create-file';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const event = 'create-file';
export const authenticate = true;

export async function handle(socket, session, data) {
	const { user } = session;
	const { projectId, path, content } = data;

	try {

		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		// try and write the file content
		const result = await createFile(projectId, path, content);

		// this was successful
		socket.ok(event, { success: true });

	}
	catch (err) {
		handleError(err, {

			access_denied: () =>
				socket.err(event, createError('project', 'access_denied')),

			project_not_found: () =>
				socket.err(event, createError('project', 'not_found')),

			unknown: () => {
				log.ex('requests/create-file.js', err);
				socket.err(event, createError('server'));
			}
		});
	}

}