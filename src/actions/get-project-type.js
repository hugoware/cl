
import $database from '../storage/database';

/** cache of IDs to avoid look ups */
const $cache = { };

/** finds a project type by ID 
 * @param {string} id the ID of the project
 * @returns {string} the type of the project, if any
 */
export default async function getProjectType(id) {

	// check if this was already cached
	let type = $cache[id];
	if (type) return type;

	// grab the project data
	const results = await $database.projects.find({ id })
		.project({ _id: 0, type: 1 })
		.toArray();

	// check if there was a match
	const project = results[0];
	if (!project)
		throw 'project_not_found';

	// cache, if possible
	type = project.type;
	if (type) $cache[id] = type;

	return type;
}