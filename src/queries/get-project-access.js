
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
export default function getProjectAccess(id, userId) {
	return new Promise(async (resolve, reject) => {
		let project;
		
		// no edit access for demos
		if (id === 'demo')
			return resolve({ write: false, view: true, remove: false });

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
				return reject('project_not_found');
		}
		// database errors
		catch (err) {
			log.ex('queries/get-project-data.js', err);
			reject('server_error');
		}

		// determine access
		return project.ownerId === userId
			? resolve({ write: true, view: true, remove: true })
			: resolve({ write: false, view: false, remove: false });

	});
}
