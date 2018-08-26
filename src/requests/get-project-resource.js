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
	new Promise(async (resolve, reject) => {
	
		// get the sub domain
		const parts = _.trim(request.hostname).split('.');
		let id = parts.shift();

		// if fo some reason this has the www
		if (/www/i.test(id))
			id = parts.shift();

		// check if this is a project request -- could possibly
		// just check for domain name
		let type;
		try { 
			type = await getProjectType(id);
		}
		// not a real project type
		catch (ex) { 
			return reject();	
		}
			
		// check the file request -- modify as needed
		let resource = _.trim(request.params[0]);
		if (type === 'web') {
			// ??
		}

		// find the file to send
		const path = $path.resolveProject(id, resource);

		// make sure it exists first
		const exists = await $fsx.exists(path);
		if (!exists)
			return reject('404');

		// make sure it's a file
		const stats = await $fsx.stat(path);
		if (!(stats && stats.isFile))
			return reject('404');

		// file is okay to send
		response.sendFile(path);
		resolve();
	})
	// handle any failures
	.catch(err => {
		if (err) response.send('404');
		else next();
	})

}