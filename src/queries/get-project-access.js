
import log from '../log';
import $database from '../storage/database';

/** Access levels for a project
 * @typedef {Object} ProjectAccess
 * @prop {boolean} write Can write and make changes
 * @prop {boolean} remove Can delete a project entirely
 * @prop {boolean} view Can look at the project preview
 */

/**
 * gets all project information
 * @param {string} id the ID for the project
 * @param {string} userId the user requesting access
 * @returns {ProjectAccess} general project data
 */
export default async function getProjectAccess(id, userId) {
	let project;

	try {
		const results = await $database.projects.find({ id })
			.project({
				_id: 0,
				ownerId: 1,
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

	// determine access
	return project.ownerId === userId
		? { write: true, view: true, remove: true }
		: { write: false, view: false, remove: false };
}
