import log from '../log';
import { handleError, createError } from '../utils/index';

import writeFile from '../actions/write-file';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const event = 'write-file';
export const authenticate = true;

export async function handle(socket, session, data) {	
	const { user } = session;
	const { projectId, path, content } = data;
	const doNotCreateIfMissing = true;

	try {

		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		console.log('returned', access);
		if (!access.write)
			throw 'access_denied';

		// try and write the file content
		await writeFile(projectId, path, content, { doNotCreateIfMissing });

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
				log.ex('requests/write-file.js', err);
				socket.err(event, createError('server'));
			}
		});
	}

}