import log from '../log';
import $fsx from 'fs-extra';
import $path from '../path';

/**
 * gets all project information
 * @param {string} id the ID for the project
 * @returns {object} a map and structure of files/folders for the project
 */
export default async function getProjectStructure(id) {
	const structure = { children: [ ] };
	const path = $path.resolveProject(id);

	// check the root directory first since it's possible that
	// no files have been written -- all other checks are based on
	// what's read in the directory
	const exists = await $fsx.exists(path);
	if (exists) {
		try {
			await resolveDirectory(structure.children, path);
		}
		catch (err) {
			log.ex('queries/project-structure.js', err);
			throw 'project-read-error';
		}
	}

	// since it's there, resolve it
	return structure;
}


// walks a directory
async function resolveDirectory(children, directory) {
	const items = await $fsx.readdir(directory);

	// start checking each item
	for (const item of items) {

		// skip the cache directory
		if (item === '.cache')
			continue;

		// get the details
		const path = $path.resolve(directory, item);
		const detail = await $fsx.stat(path);

		// create the entry
		const entry = { name: item };
		children.push(entry);
		
		// if this is a directory, then add it to the children
		if (detail.isDirectory()) {
			entry.children = [ ];
			await resolveDirectory(entry.children, path);
		}

	}

}
