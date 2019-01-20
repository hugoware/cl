import _ from 'lodash';
import log from '../log';
import { handleError, createError } from '../utils/index'

import getProjectData from '../queries/get-project-data';
import getProjectStructure from '../queries/get-project-structure'

export const event = 'get-project-data';
export const authenticate = true;

export async function handle(socket, session, lessonId) {
	try {

		// gather project info
		const ownerId = session.user;
		const data = await getProjectData(ownerId, lessonId);
		const structure = await getProjectStructure(lessonId);

		_.merge(data, structure);
		socket.ok(event, data);
	}
	catch (err) {
		handleError(err, {

			project_not_found: () =>
				socket.err(event, createError('project', 'not_found')),

			unknown: () => {
				log.ex('requests/get-project-data.js', err);
				socket.err(event, createError('server'));
			}
		});
	}

}
