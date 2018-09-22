
import $database from '../storage/database';
import format from '../formatters';
import $fsx from 'fs-extra';
import $date from '../utils/date';
import projectValidator from '../validators/project';
import { resolveProject, resolveResource } from '../path';

/** expected params for a project
 * @typedef CreateProjectData
 * @prop {string} type the kind of project to create
 * @prop {string} ownerId the id for the owner of the project
 * @prop {string} name the name of the project
 * @prop {string} [description] the description about the project, if any
 * @prop {string} [language] the language to use for a project type, if any
 */

 /** @typedef {Object} CreateProjectResult
	* @prop {boolean} success was the creation attempt successful
	* @prop {object} [errors] a mapping of errors, if any
  */

/** handles creating a project
 * @param {CreateProjectData} data project data
 * @returns {CreateProjectResult}
 */
export default async function createProject(data) {
	return new Promise(async (resolve, reject) => {

		// format the data first
		const ownerId = format.trim(data.ownerId);
		const name = format.toName(data.name);
		const description = format.removeExtraSpaces(data.description);
		const type = format.toAlias(data.type);
		const language = format.toAlias(data.language);
		
		// perform basic validation
		const errors = { };
		projectValidator.validateName(name, errors);
		projectValidator.validateDescription(description, errors);
		projectValidator.validateType(type, errors);
		projectValidator.validateLanguage(language, type, errors);

		// if there were any data errors, stop now
		if (errors.hasErrors)
			return resolve({ success: false, errors });

		// check for the user
		const userExists = await $database.exists($database.users, { id: ownerId });
		if (!userExists)
			return reject('user_not_found');

		// make sure this name isn't already in use
		const nameExists = await $database.exists($database.projects, { name, ownerId });
		if (nameExists)
			return reject('name_already_exists');

		try {
			// get a new ID for this project
			const id = await $database.generateId($database.projects, 6);
			const now = $date.now();
			const project = { id, ownerId, name, description, type, modifiedAt: now };
			if (!!language) project.language = language;

			// try and save the record
			await $database.projects.insertOne(project);

			// make sure to create the new project directory
			const directory = resolveProject(id);
			const source = resolveResource(`projects/${type}`);

			// copy the default project
			await $fsx.copy(source, directory);

			// ready to go
			return resolve({ success: true, id });
		}
		catch (err) {
			reject('database_error');
		}
	});

}