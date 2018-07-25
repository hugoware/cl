
import log from '../log';
import $database from '../storage/database';

/**
 * gets all project information
 * @param {string} id the ID for the project
 * @returns {object} general project data
 */
export default async function getProjectData(id) {
	let project;
	
	try {
		const results = await $database.projects.find({ id })
			.project({
				_id: 0,
				id: 1,
				type: 1,
				name: 1,
				description: 1,
				ownerId: 1,
				modifiedAt: 1,
				createdAt: 1,
			})
			.toArray();

		// check for a result
		project = results[0];
		if (!project)
			throw 'project_not_found';
	}
	// database errors
	catch (err) {
		log.ex('queries/get-project-data.js', err);
		throw 'server_error';
	}

	return project;
}
