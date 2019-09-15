
import _ from 'lodash';
import log from '../log';
import $path from '../path';
import $npath from 'path';
import $fsx from 'fs-extra';
import setProjectModified from './set-project-modified'

/** handles creating a new folder
 * @param {string} projectId the project to work with
 * @param {string} path the local path to the folder to create
 * @returns {string} the created path
 */
export default async function createFolder(projectId, name, relativeTo, options = { }) {
	return new Promise(async (resolve, reject) => {
		const path = $path.sanitizePath(`${relativeTo || '/'}/${name}`);

		// start by cleaning up the path
		relativeTo = $path.sanitizePath(relativeTo);
		name = $path.sanitizePath(name);

		// get the directories being worked with
		const root = $path.resolveProject(projectId);
		const parent = $path.resolveProject(projectId, relativeTo);
		const target = `${parent}/${name}`;

		// check the directories
		const targetInProject = _.startsWith(target, root);
		const parentInProject = _.startsWith(parent, root);

		// make sure this doesn't use anything silly
		if (!(targetInProject && parentInProject))
			return reject('folder_invalid');

		// make sure this is available
		const exists = await $fsx.pathExists(target);
		if (exists)
			return reject('folder_already_exists');

		// make sure the parent is real
		const parentExists = await $fsx.pathExists(parent);
		if (!parentExists)
			return reject('folder_invalid');

		// try and create the directory
		try { 
			await $fsx.mkdirp(target);

			// since this worked, update the project
			setProjectModified(projectId, options.isClassroom);

			// get the name
			const name = $npath.basename(path);
			resolve({ path, name, children: [ ] });
		}
		catch (err) {
			log.ex('actions/create-folder.js', err);
			reject('folder_add_error');
		}
	});
}