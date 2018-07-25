
import $database from '../storage/database';

/** finds the state for a project by ID
 * @param {string} id the ID of the project
 * @returns {object} a map of project state
 */
export default async function getProjectState(id) {

	// grab the project data
	const results = await $database.projects.find({ id })
		.project({ state: 1 })
		.toArray();

	// check if there was a match
	const project = results[0];
	if (!project)
		throw 'project_not_found';

	// return the active state, if any
	return project.state || { };
}