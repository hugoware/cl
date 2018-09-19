
import log from '../log';
import $fsx from 'fs-extra';
import $path from '../path';
import $database from '../storage/database';
import $date from '../utils/date';

/** @typedef {Object} WriteFileOptions
 * @prop {boolean} doNotCreateIfMissing throws an exception if the file doesn't already exist
 */

/** handles writing content to a file
 * @param {string} projectId the id of the project to write
 * @param {string} path the local path of the file within the project
 * @param {string|Stream} data the content to write to the file
 * @param {WriteFileOptions} [options] additional options for writing
 * @returns {boolean} the write was successful
 */
export default async function writeFile(projectId, path, data, options = { }) {
	const target = $path.resolveProject(projectId, path);
	
	// file existing is a requirement
	if (options.doNotCreateIfMissing) {
		const exists = await $fsx.exists(target);
		if (!exists)
			throw 'file_not_found';
	}

	// since it exists, write the content
	try {
		await $database.projects.update({ id: projectId }, {
			$set: { modifiedAt: $date.now() }
		});
		await $fsx.outputFile(target, data);
	}
	catch (err) {
		log.ex('actions/write-file.js', err);
		throw 'file_write_error';
	}

	return Promise.resolve(true);
}