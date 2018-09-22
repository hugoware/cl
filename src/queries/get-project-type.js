
import $cache from '../cache';

/** finds a project type by ID 
 * @param {string} id the ID of the project
 * @returns {string} the type of the project, if any
 */
export default async function getProjectType(id) {
	return new Promise(async (resolve, reject) => {

		// check if there was a match
		const project = await $cache.projects.get(id);
		if (!project)
			return reject('project_not_found');

		// give back the project type
		return resolve(project.type);
	});
}