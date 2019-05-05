
import compile from './code-compiler';

// return web content as required
export default async function handleRequest(request, response, project) {

	await compile(request, response, project, {
		defaultEntry: '/main.js',
		renderView: 'projects/game/preview',
		missingView: 'projects/game/missing',
		onError: ex => `window.showProjectError();`
	})

}
