import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';
import getProjectType from '../queries/get-project-type';
import { resolveError } from '../utils';

export const name = 'serve project resource';
export const route = '/*';
export const priority = 0;

// determines the correct home view
export async function handle(request, response, next) {

	// must start with a version 
	if (!/^\d+\./.test(request.hostname))
		return next();
	
	// no need to do this
	if (/^\/?__(codelab|monaco)__/i.test(request.path))
		return next();

	console.log('trying', request.hostname);

	// determine if this is requesting a project
	const parts = _.trim(request.hostname).split('.');
	let version = parts.shift();
	let id = parts.shift();

	// if for some reason this has the www
	if (/www/i.test(id))
		id = parts.shift();

	// check for reserved words
	const root = $path.resolveProject(id);
	const isProject = await $fsx.exists(root);

	// no need to finish
	if (!isProject)
		return next();

	// find the file to send
	const path = $path.resolveProject(id, request.path);

	// make sure it exists first
	try {
		const exists = await $fsx.exists(path);
		if (!exists) throw '404';

		// make sure it's a file
		const stats = await $fsx.stat(path);
		if (!(stats && stats.isFile)) throw '404';

		// file is okay to send
		response.sendFile(path);
	}
	// failed to read the file
	catch (err) {
		response.send('404');
	}


}