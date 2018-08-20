import _ from 'lodash';
import log from '../log';
import $fsx from 'fs-extra';
import $npath from 'path';
import $path from '../path';
import { simplifyPathCollection } from '../utils/project';

/** @typedef {Object} MoveItemsOptions
 * @prop {boolean} [overwrite] allow overwriting of items in the same target location 
 */

/** Handles moving a file from one location to another
 * @param {string|string[]} items The files or folders to move
 * @param {string} to The folder to move to
 * @param {MoveItemsOptions} [options] Options for moving files
 */
export default async function moveItems(projectId, paths, target) {
	return new Promise(async (resolve, reject) => {
		target = $path.resolveProject(projectId, target);
	
		// get the list of moves
		paths = simplifyPathCollection(paths);
		paths = _.map(paths, path => $path.resolveProject(projectId, path));

		// remove any paths that target itself
		paths = _.filter(paths, path => path !== target);

		// perform each move
		try {
			for (const path of paths) {
				const name = $npath.basename(path);
				const destination = $path.resolve(target, name);
				await $fsx.move(path, destination, { overwrite: true });
			}
			
			// move was successful
			resolve({ success: true });
		}
		catch(err) {
			log.ex('actions/move-items.js', err);
			reject('item_move_error');
		}

	});
}