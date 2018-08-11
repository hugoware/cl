
import log from '../log';
import $path from '../path';
import $fsx from 'fs-extra';
import $fileDefaults from '../file-defaults';

/** handles creating a new folder
 * @param {string} projectId the project to work with
 * @param {string} path the local path to the folder to create
 * @returns {boolean} was the creation successful
 */
export default async function createFolder(projectId, path, options = {}) {
	const target = $path.resolveProject(projectId, path);

	// try and create the file
	try {
		// get the file default
		const ext = $path.extalias(path);

		// verify this is an allowed content type
		// note: this isn't verifying it's valid for this
		// project, which will come later
		if (!$fileDefaults.exists(ext))
			throw 'invalid_file_type';

		// write the content
		const content = $fileDefaults.get(ext);

		console.log('wants to write to', target);
		await $fsx.writeFile(target, content);
	}
	catch (err) {
		log.ex('actions/create-file.js', err);
		throw 'file_add_error';
	}

	return Promise.resolve(true);
}
