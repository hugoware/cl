
import log from '../log';
import $path from '../path';
import $npath from 'path';
import $fsx from 'fs-extra';

/** handles creating a new folder
 * @param {string} projectId the project to work with
 * @param {string} path the local path to the folder to create
 * @returns {string} the created path
 */
export default async function createFolder(projectId, path) {
	return new Promise(async (resolve, reject) => {
		const target = $path.resolveProject(projectId, path);

		// make sure this is available
		const exists = await $fsx.pathExists(target);
		if (exists)
			return reject('folder_already_exists');

		// try and create the directory
		try { 
			await $fsx.mkdirp(target);

			// get the name
			const name = $npath.basename(path);
			resolve({ name, children: [ ] });
		}
		catch (err) {
			log.ex('actions/create-folder.js', err);
			reject('folder_add_error');
		}
	});
}