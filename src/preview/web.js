
import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';
import { spawn as $spawn } from 'threads';

// the amount of time to allow for compiling a
// pug file before giving up
const COMPILE_TIMEOUT = 3000;

// common resources that require no processing
const RESOURCES = [
	'html', 'htm', 'css', 'js', 'txt',
	'png', 'jpg', 'jpeg', 'gif'
];

// return web content as required
export default async function handleRequest(request, response, project) {

	// check for the file
	const { id } = project;
	let path = decodeURI(request.path);
	path = $path.removeLeadingSlash(path);
	const source = $path.resolveProject(id);

	// check the path
	let target = $path.resolve(source, `./${path}`);
	let ext = $path.extalias(target);

	// if there's not an extension, then we need to 
	// figure out what this file is looking for
	if (!ext) {

		// check if the view name exists
		let defaultTo = await getDefault(target);
		
		// if not, check for an index file in the
		// same location
		if (!defaultTo)
			defaultTo = await getDefault(target, '/index')

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
async function getDefault(relativeTo, name = '') {
	let path;
	let exists;
	return new Promise(async resolve => {

		// check for each possible default document type
		path = `${relativeTo}${name}.pug`;
		exists = await $fsx.exists(path)
		if (exists)
			return resolve({ path, ext: 'pug' });

		// check for HTML files
		path = `${relativeTo}${name}.html`;
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
	const defaultTo = await getDefault(source, '/404');
	
	// if there's still not a default, then we should
	// just give up here
	response.status(404);
	if (defaultTo)
		serveFile(defaultTo.path, defaultTo.ext, source, response, project);
	else
		response.render('projects/missing', { project });
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
		return response.sendFile(path);

	// check if this was already compiled
	const { id } = project;
	const target = path.substr(source.length);
	const cache = $path.resolveCache(`/projects/${id}/${target}`);

	// check if already cached
	let cached = await $fsx.exists(cache);

	// check if expired
	if (cached) {
		const targetState = await $fsx.stat(path);
		const cachedState = await $fsx.stat(cache);

		// cache was invalidated
		if (targetState.mtime.getTime() > cachedState.mtime.getTime())
			cached = false;
	}

	// make sure the cached file is ready
	if (!cached)
		await $fsx.ensureFile(cache);

	// serve the correct file
	let mime;
	if (ext === 'pug') {
		mime = 'text/html';
		if (!cached) 
			await generatePugFile(path, source, cache);
	}
	else if (ext === 'scss') {
		mime = 'text/css';
		if (!cached) 
			await generateScssFile(path, source, cache);
	}
	
	// since everything was generated
	if (!mime) {
		response.send('unsupported');
	}
	else {
		response.type(mime);
		response.sendFile(cache);
	}

}


// handles creating and caching a pug file
async function generatePugFile(path, source, cache) {
	return await compile(path, source, cache, function(params, done) {
		const $pug = require('pug');
		const content = $pug.renderFile(params.path, { basedir: params.source })
		done({ content });
	});
}


// handles caching and creating an scss file
async function generateScssFile(path, source, cache) {
	return await compile(path, source, cache, function (params, done) {
		const $scss = require('node-sass');
		const result = $scss.renderSync({
			file: params.path,
			includePaths: [ params.source ],
			follow: false,
			precision: 2,
			outputStyle: 'compressed'
		});

		// send back the file
		const content = result.css.toString();
		done({ content });
	});
}


// simplifies compiling content
async function compile(path, source, cache, action) {
	return new Promise(resolve => {

		// create the thread to run
		const thread = $spawn(action);

		// clean up
		function finalize(content) {
			finalize = () => { };
			clearTimeout(timeout);
			thread.kill();
			resolve(content || 'error');
		}

		// llmit the time
		const timeout = setTimeout(() => finalize('timeout'), COMPILE_TIMEOUT);

		// handle results
		thread.on('message', result => finalize(result.content));
		thread.on('error', err => {
			finalize('error');
		});

		// kick off the work
		thread.send({ path, source });
	})
	// write the updated content
	.then(content => {
		return $fsx.writeFile(cache, content)
	});
}
