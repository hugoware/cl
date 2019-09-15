
import log from '../log';
import $fsx from 'fs-extra';
import $path from '../path';
import $npath from 'path';
import setProjectModified from './set-project-modified'
import clearProjectCache from '../actions/clear-project-cache';

/** Handles removing a file at the provided path
 * @param {string} projectId The project that the files should be removed from
 * @param {string|string[]} items The items that should be removed
 */
export default async function renameItem(projectId, source, target, options = { }) {
	return new Promise(async (resolve, reject) => {
		try {
			source = $path.resolveProject(projectId, source);
			target = $path.resolveProject(projectId, target);

			// name appears to be exactly the same
			if (source === target)
				return resolve({ success: true });

			// make sure the source is real
			const sourceExists = await $fsx.exists(source);
			if (!sourceExists)
				return reject('item_not_found');

			// make sure the target name doesn't exist since
			// we're not moving files, just renaming
			const targetExists = await $fsx.exists(target);
			if (targetExists)
				return reject('item_already_exists');

			// identify what we're renaming
			const sourceDirectory = $npath.dirname(source);
			const targetDirectory = $npath.dirname(target);
			
			// do basic validation first
			if (sourceDirectory !== targetDirectory)
			return reject('invalid_rename');
			
			// validate the extension, if renaming a file
			const item = await $fsx.stat(source);
			if (item.isFile) {
				const sourceExt = $npath.extname(source);
				const targetExt = $npath.extname(target);
				if (sourceExt !== targetExt)
					return reject('invalid_rename');
			}

			// since it's safe to move, do it now
			await $fsx.move(source, target);

			// since this worked, update the project
			setProjectModified(projectId, options.isClassroom);
			clearProjectCache(projectId);
			
			// since it moved, finalize the info
			resolve({ success: true });
		}
		catch (ex) {
			log.ex('requests/rename-item.js', ex);
			reject('rename_item_error');
		}

	});

}