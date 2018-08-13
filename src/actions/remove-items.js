
import log from '../log';
import $fsx from 'fs-extra';
import $path from '../path';
import { simplifyPathCollection } from '../utils/project';

/** Handles removing a file at the provided path
 * @param {string} projectId The project that the files should be removed from
 * @param {string|string[]} items The items that should be removed
 */
export default async function removeItems(projectId, items) {

	// get the simple form of objects to remove - this
	// should clean up nested removals as well
	items = simplifyPathCollection(items);

	// since it exists, write the content
	try {

		// queue up each item to remove
		for (const item of items) {
			const path = $path.resolveProject(projectId, item);
			if (!path) throw 'invalid_path';
			await $fsx.remove(path);
		}

		return { success: true };
	}
	catch (err) {
		log.ex('actions/remove-items.js', err);
		throw 'item_remove_error';
	}
}