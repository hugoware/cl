
import _ from 'lodash';
import $cache from '../cache';

export const name = 'serve project preview';
export const route = '/*';
export const priority = 1;

// get the project handlers
import previewWebProject from '../preview/web';
import previewCodeProject from '../preview/code';

// determines the correct home view
export async function handle(request, response, next) {

	// application resources
	if (/^\/?__(codelab|monaco)__/i.test(request.path))
		return next();

	// determine if this is requesting a project
	const parts = _.trim(request.hostname).split('.');
	let id = parts.shift();

	// if for some reason this has the www
	if (/www/i.test(id))
		id = parts.shift();

	// if this doesn't appear to be a project at all
	if (id.length !== 6)
		return next();

	// since this is requesting a project, get the
	// default info for the project
	const project = await $cache.projects.get(id);

	// process the request
	const handler = project.type === 'web' ? previewWebProject
		: project.type === 'code' ? previewCodeProject
		: null;

	// if there's not a handler, there's no reason
	// to continue the process (which should end up as a 404)
	if (!handler)
		return next();

	// make sure it exists first
	// try {

		// perform the request
		await handler(request, response, project);
	// }
	// // failed to read the file
	// catch (err) {
	// 	response.send('404');
	// }

}