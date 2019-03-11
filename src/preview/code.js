
import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';
import $database from '../storage/database';
// import $typescript from 'typescript';
// import protectCode from '../compilers/simplescript/protect';
// import { resolveImports, getErrorFile } from '../compilers/simplescript/modules';
import { find } from '../storage/file-system/index';
import * as Babel from '../resources/public/babel.min';
import BabelCompiler from '../compiler/babel'

// common resources that require no processing
const RESOURCES = [
	'html', 'htm', 'css', 'txt',
	'png', 'jpg', 'jpeg', 'gif'
];

// return web content as required
export default async function handleRequest(request, response, project) {
	let { path } = request;
	const { id } = project;
	const source = $path.resolveProject(id);

	// check if this is for a resource file
	const ext = $path.extalias(path);
	if (_.includes(RESOURCES, ext)) {
		const resource = $path.resolveProject(id, path);
		return response.sendFile(resource);
	}

	// not there's not a path, then let's look for
	// main.js as the default file
	if (!path || path === '/')
		path = '/main.js';

	// get the up to date project data
	const projects = await $database.projects.find({ id: project.id })
		.project({ name: 1, description: 1 })
		.toArray();

	// grab the user info
	const results = await $database.users.find({ id: project.ownerId })
		.project({ first: 1, avatar: 1, anonymous: 1 })
		.toArray();

	// use the project
	project = projects[0] || project;

	// find the owner
	let user = results[0] || getAnonymous();
	if (user.anonymous) user = getAnonymous();

	// there are no look ups, just use the project as is
	const alias = _.snakeCase(path);
	const compiled = $path.resolveCache(`/projects/${id}/${alias}.js`);

	// check if already cached
	const exists = await $fsx.exists(compiled);

	// if it's not compiled, then generate it now
	if (!exists) {
		const result = await compileProject(source, path, compiled);

		// nothing could be compiled
		if (!result.success) {
			result.project = project;
			result.user = user;
			return response.render('projects/code/list', result);
		}
	}

	// now, render the result
	const data = await $fsx.readFile(compiled);
	const code = data.toString();
	response.render('projects/code/preview', { code, project, user });
}

// compiles a project to be used in the code window
async function compileProject(source, entry, compiled) {
	return new Promise(async resolve => {
		
		// gather up all files
		const files = await find(source, ['.js']);
		
		// check if the entry file exists - if not
		// then check if there's only one file in
		// the project -- if so, run that instead
		let hasEntry = files.indexOf(entry) > -1;
		if (!hasEntry && files.length === 1) {
			entry = files[0];
			hasEntry = true;
		}

		// make sure there's a main.js
		if (!hasEntry)
			return resolve({
				noEntry: true,
				noFiles: files.length <= 0,
				isDefaultEntry: entry === '/main.js',
				entry,
				success: false,
				files
			});

		// collect up each file content
		const imports = { };
		for (let i = 0, total = files.length; i < total; i++) {
			const path = files[i];
			const relative = $path.removeLeadingSlash(path);
			const absolute = $path.resolve(source, relative);
			const data = await $fsx.readFile(absolute);
			imports[path] = data.toString();
		}
		
		// compile
		let result;
		try {

			const compiler = new BabelCompiler({
				entry,
				babel: Babel,
				files: imports
			});

			result = compiler.compile();

		}
		// there was an error - save a compiled
		// version that notifies there was a problem
		catch (ex) {
			result = `window.__CODELAB__.projectError();`;
		}

		// write the result
		await $fsx.ensureFile(compiled);
		await $fsx.writeFile(compiled, result);
		
		resolve({ success: true });
	});
}

// fake account
function getAnonymous() {
	return { first: 'CodeLab Student', avatar: '' };
}