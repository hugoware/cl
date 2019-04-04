import _ from 'lodash';
import log from '../log';
import { handleError, createError } from '../utils/index'

import getProjectData from '../queries/get-project-data';
import getProjectStructure from '../queries/get-project-structure'

export const event = 'get-project-data';
// export const authenticate = true;

export async function handle(socket, session, lessonId) {
	try {
		// TODO: maybe need to authenticate this
		
		// get the project data
		const project = await getProjectStructure(lessonId);
		const data = await getProjectData(session.user, lessonId);
		_.merge(project, data);

		socket.ok(event, project);
	}
	catch (err) {
		console.log(err);
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
