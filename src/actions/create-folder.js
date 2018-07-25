
import log from '../log';
import $path from '../path';
import $fsx from 'fs-extra';

/** @typedef {Object} CreateFolderOptions 
 * @prop {boolean} [overwriteIfExists] allows folders to be overwritten
*/

/** handles creating a new folder
 * @param {string} projectId the project to work with
 * @param {string} path the local path to the folder to create
 * @param {CreateFolderOptions} [options] additional options for writing folders
 * @returns {boolean} was the creation successful
 */
export default async function createFolder(projectId, path, options = { }) {
	const target = $path.resolveProject(projectId, path);

	// check for existing, if needed
	if (!options.overwriteIfExists) {
		const exists = await $fsx.pathExists(target);
		if (exists)
			throw 'folder_already_exists';
	}

	// try and create the directory
	try { 
		await $fsx.mkdirp(target);
	}
	catch (err) {
		log.ex('actions/create-folder.js', err);
		throw 'folder_add_error';
	}

	return Promise.resolve(true);
}