import _ from 'lodash';
import { resolveError } from '../utils';
import $database from '../storage/database';

/** handles setting the modified time for a project
 * @param {string} id the id of the project to update
 * @param {number} [timestamp] the time to update the project to
 */
export default function setProjectModified(id, timestamp = +new Date) {
	return new Promise(async (resolve, reject) => {

		// if the project is missing, give up
		const projectExists = await $database.exists($database.projects, { id });
		if (!projectExists)
			return reject('project_not_found');

		// replace the modified timestamp
		await $database.projects.update({ id }, {
			$set: { modifiedAt: timestamp }
		});

		resolve();
	})
	.catch(err => resolveError(err, 'actions/set-project-modified.js'));
}