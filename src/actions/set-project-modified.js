import _ from 'lodash';
import $date from '../utils/date';
import { resolveError } from '../utils';
import $database from '../storage/database';
import { PROJECT_TYPE_PERMANENT, PROJECT_TYPE_TEMP } from '../storage/database/index';

/** handles setting the modified time for a project
 * @param {string} id the id of the project to update
 * @param {number} [timestamp] the time to update the project to
 */
export default function setProjectModified(id, isClassroom) {
	return new Promise(async (resolve, reject) => {
		const timestamp = $date.now();

		// verify the project first
		const projects = await $database.projects
			.find({ id })
			.project({ id: 1, status: 1 })
			.toArray();

		// if the project is missing, give up
		const project = projects[0];
		if (!project)
			return reject('project_not_found');

		// create the update
		const update = { modifiedAt: timestamp };

		console.log('checking', id, isClassroom);

		// marking this as non-temp
		if (!isClassroom)
			update.status = PROJECT_TYPE_PERMANENT;

		// in classroom and not previously marked as temp
		else if (isClassroom && project.status !== PROJECT_TYPE_PERMANENT)
			update.status = PROJECT_TYPE_TEMP;

		// replace the modified timestamp
		await $database.projects.update({ id }, {
			$set: update,
		});

		resolve();
	})
	.catch(err => resolveError(err, 'actions/set-project-modified.js'));
}