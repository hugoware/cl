import _ from 'lodash';
import log from '../log';
import $path from '../path';
import $fsx from 'fs-extra';
import $fileDefaults from '../file-defaults';
import fileValidator from '../validators/file';
import getProjectType from '../queries/get-project-type';
import { getPathInfo } from '../path';
import setProjectModified from './set-project-modified';

/** handles creating a new folder
 * @param {string} projectId the project to work with
 * @param {string} path the local path to the folder to create
 * @returns {boolean} was the creation successful
 */
export default async function createFile(projectId, path, options = {}) {
	return new Promise(async (resolve, reject) => {
		const target = $path.resolveProject(projectId, path);
		
		// get the file default
		const projectType = await getProjectType(projectId);
		const { fileName, name, ext } = getPathInfo(path);

		// validate the name
		let error = fileValidator.validateName(name);
		if (error) return reject(error);

		// check the file extension
		error = fileValidator.validateType(ext, projectType);
		if (error) return reject(error);

		// make sure a file with the same name doesn't already exist
		const alreadyExists = await $fsx.exists(target);
		if (alreadyExists)
			return reject('file_already_exists');

		// check for default content - if the return value
		// is null, then that actually means the file type
		// isn't valid for this project
		const content = $fileDefaults.get(ext, projectType);
		if (_.isNil(content))
			return reject('invalid_file_type');

		// try and create the file
		try {
			await $fsx.writeFile(target, content);
			
			// since this worked, update the project
			setProjectModified(projectId, options.isClassroom);

			// finally, return the file information
			resolve({ name: fileName, content });
		}
		catch (err) {
			log.ex('actions/create-file.js', err);
			reject('file_add_error');
		}

	});
}
