import _ from 'lodash';
import log from '../log';
import $database from '../storage/database';
import format from '../formatters';
import projectValidator from '../validators/project';

/** The changes to make to a project 
 * @typedef {Object} UpdateProjectData
 * @prop {string} id the project ID that's being updated
 * @prop {string} [name] the new project name to use, if any
 * @prop {string} [description] the new description to use, if any
*/

/** The result from updating a project
 * @typedef {Object} UpdateProjectResult
 * @prop {boolean} success did this update work
 * @prop {object} [errors] were there errors with this update
 */

/** handles general revisions to a project
 * @param {UpdateProjectData} data the fields of data to update
 * @returns {UpdateProjectResult}
 */
export default function updateProject(data) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;
		const errors = { };
		const update = { };
		
		// perform validation first
		if ('name' in data) {
			update.name = format.toName(data.name);
			projectValidator.validateName(update.name, errors);
		}
		
		if ('description' in data) {
			update.description = format.removeExtraSpaces(data.description);
			projectValidator.validateDescription(update.description, errors);
		}

		// if for some reason there aren't any values, just quit
		if (!_.some(update))
			return reject('project_update_empty');
		
		// check for any errors
		if (errors.hasErrors)
			return resolve({ success: false, errors });

		// if the project is missing, give up
		const projectExists = await $database.exists($database.projects, { id });
		if (!projectExists)
			return reject('project_not_found');

		// if the name is changing, we need to make sure that the
		// name doesn't conflict with another project
		if ('name' in update) {
			const nameExists = await $database.exists($database.projects, { name: update.name, id: { $ne: id }});
			if (nameExists)
				return reject('name_already_exists');
		}

		// since this seems valid, update the project
		try {
			await $database.projects.update({ id }, { $set: update });
			resolve();
		}
		// failed to update for some reason
		catch (err) {
			log.ex('actions/update-project.js', err);
			reject(err);
		}
	
	});

}