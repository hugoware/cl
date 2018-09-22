
import $database from './storage/database';

// create the shared cache
const $cache = { };

// create individual caches
$cache.projects = {

	/** gets project data by ID
	 * @param {string} id the project ID
	 * @returns {Project} project
	 */
	get: async id => {
		
		// grab the project data
		const results = await $database.projects.find({ id })
			.project({
				_id: 0,
				id: 1,
				name: 1,
				type: 1,
				isPublic: 1
			})
			.toArray();

		// get the project
		const project = results.length === 1
			? $cache[id] = results[0]
			: null;

		return project;
	},

	/** removes a project from the collection */
	remove: id => {
		delete $cache.projects[id];
	}
}

export default $cache;