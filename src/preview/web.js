
import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';
import $pug from 'pug';
import $scss from 'node-sass';

// common resources that require no processing
const RESOURCES = [
	'html', 'htm', 'css', 'js', 'txt',
	'png', 'jpg', 'jpeg', 'gif'
];

// return web content as required
export default async function handleRequest(request, response, project) {

	// check for the file
	const { id } = project;
	const path = $path.removeLeadingSlash(request.path);
	const source = $path.resolveProject(id);

	// check the path
	let target = $path.resolve(source, `./${path}`);
	let ext = $path.extalias(target);

	// if there's not an extension, then we need to 
	// figure out what this file is looking for
	if (!ext) {
		let defaultTo = await getDefault(target);

		// no default document was found, try and serve
		// the 404 page
		if (!defaultTo)
			return serve404(source, response, project);

		// use whatever was found
		target = defaultTo.path;
		ext = defaultTo.ext;
	}

	// try and serve the file, if possible
	serveFile(target, ext, source, response, project);
}


// finds a default file for a path
async function getDefault(relativeTo, name = 'index') {
	let path;
	let exists;
	return new Promise(async resolve => {

		// check for each possible default document type
		path = `${relativeTo}/${name}.pug`;
		exists = await $fsx.exists(path)
		if (exists)
			return resolve({ path, ext: 'pug' });

		// check for HTML files
		path = `${relativeTo}/${name}.html`;
		exists = await $fsx.exists(path)
		if (exists)
			return resolve({ path, ext: 'html' });

		// nothing was found
		resolve(null);
	});
}


// check for a 404 page
async function serve404(source, response, project) {

	// if there wasn't a default document, try one more
	// time to check and see if there's a usable 404 page
	const defaultTo = await getDefault(source, '404');

	// if there's still not a default, then we should
	// just give up here
	if (defaultTo)
		serveFile(defaultTo.target, defaultTo.ext, source, response, project);
	else
		response.send('needs default 404 page', { project });
}


// tries to serve a file
async function serveFile(path, ext, source, response, project) {

	// make sure it's a real file
	const exists = await $fsx.exists(path);
	if (!exists)
		return serve404(source, response, project);

	// if the file found is something that can just be
	// served directly, do it now (don't bother compile)
	if (ext && _.includes(RESOURCES, ext))
		return response.sendFile(target);

	// check if this was already compiled
	const { id } = project;
	const target = path.substr(source.length);
	const cache = $path.resolveCache(`/projects/${id}/${target}`);
	const cached = await $fsx.exists(cache);

	// make sure the cached file is ready
	if (!cached)
		await $fsx.ensureFile(cache);

	// serve the correct file
	if (ext === 'pug') {
		response.type('text/html');
		if (!cached) 
			await generatePugFile(path, source, cache);
	}

	else if (ext === 'scss') {
		response.type('text/css');
		if (!cached) 
			await generateScssFile(path, source, cache);
	}

	// unsupported
	else {
		return response.send('unsupported');
	}

	// since everything was generated
	response.sendFile(cache);

}


// handles creating and caching a pug file
async function generatePugFile(path, source, cache) {


	const content = $pug.renderFile(path, { basedir: source });
	return $await.writeFile(cache, content);
	
	// await $fsx.ensureFile(cache);

	
	// return await $fsx.writeFile(cache, 'pug');
	
}


// handles caching and creating an scss file
async function generateScssFile(path, source, cache) {
	
	console.log('wants to generateScssFile');
	
	return await $fsx.writeFile(cache, 'scss');
}