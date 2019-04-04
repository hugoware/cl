import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';

export const name = 'serve project resource';
export const route = '/*';
export const priority = 0;

// determines the correct home view
export async function handle(request, response, next) {

	// must start with a version 
	if (!/^\d+\-/.test(request.hostname))
		return next();
	
	// no need to do this
	if (/^\/?__(codelab|monaco)__/i.test(request.path))
		return next();

	// determine if this is requesting a project
	const parts = _.trim(request.hostname).split('.');

	// start cleaning up each part
	let segment = parts.shift();
	if (/^www$/i.test(segment))
		segment = parts.shift();

	// extract values
	segment = segment.split('-');
	let version = segment.shift();
	let id = segment.shift();

	// check for reserved words
	const root = $path.resolveProject(id);
	const isProject = await $fsx.exists(root);

	// no need to finish
	if (!isProject)
		return next();

	// find the file to send
	let path = decodeURI(request.path);
	path = $path.resolveProject(id, path);

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