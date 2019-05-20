
import compile from './code-compiler';
import generateManifest from '../compiler/manifest';

// return web content as required
export default async function handleRequest(request, response, project) {

	// check for manifest files
	if (/^\/manifest\.json/i.test(request.path))
		return generateManifest(request, response, project);

	await compile(request, response, project, {
		defaultEntry: '/main.js',
		renderView: 'projects/game/preview',
		missingView: 'projects/game/missing',
		onError: ex => `window.showProjectError();`
	})

}
