
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
	const { path } = request;
	const { id } = project;
	const source = $path.resolveProject(id);

	// check if this is for a resource file
	const ext = $path.extalias(path);
	if (_.includes(RESOURCES, ext)) {
		const resource = $path.resolveProject(id, path);
		return response.sendFile(resource);
	}

	// get the up to date project data
	const projects = await $database.projects.find({ id: project.id })
		.project({ name: 1, description: 1, modifiedAt: 1 })
		.toArray();

	// grab the user info
	const results = await $database.users.find({ id: project.ownerId })
		.project({ first: 1, anonymous: 1 })
		.toArray();

	// use the project
	project = projects[0] || project;

	// get the last modified time
	let modifiedAt = project && project.modifiedAt;
	if (isNaN(modifiedAt)) modifiedAt = 1;

	// find the owner
	let user = results[0] || getAnonymous();
	if (user.anonymous) user = getAnonymous();

	// there are no look ups, just use the project as is
	const compiled = $path.resolveCache(`/projects/${id}/app`);

	// check if already cached
	let isValid = await $fsx.exists(compiled);
	if (!!isValid) {
		const stats = await $fsx.stat(compiled);
		isValid = modifiedAt <= stats.mtimeMs;
	}

	// if it's not compiled, then generate it now
	isValid = false;
	if (!isValid) {
		await compileProject(source, '/app.js', compiled, modifiedAt);
	}

	// now, render the result
	const data = await $fsx.readFile(compiled);
	const code = data.toString();
	response.render('projects/mobile/preview', { code, project, user });
}

// compiles a project to be used in the code window
async function compileProject(source, entry, compiled, timestamp) {
	return new Promise(async resolve => {

		// gather up all files
		const files = await find(source, ['.js', '.html', '.css']);

		// check if the entry file exists - if not
		// then check if there's only one file in
		// the project -- if so, run that instead
		let hasEntry = files.indexOf(entry) > -1;
		if (!hasEntry && files.length === 1) {
			entry = files[0];
			hasEntry = true;
		}

		// make sure there's a app.js
		if (!hasEntry)
			return resolve({
				noEntry: true,
				noFiles: files.length <= 0,
				isDefaultEntry: entry === '/app.js',
				entry,
				success: false,
				files
			});

		// collect up each file content
		const imports = { };
		const markup = [ ];
		const style = [ ];

		// gather all files
		for (let i = 0, total = files.length; i < total; i++) {
			const path = files[i];
			const relative = $path.removeLeadingSlash(path);
			const absolute = $path.resolve(source, relative);
			const data = await $fsx.readFile(absolute);
			const content = data.toString();

			// save to the correct location
			if (/\.js$/.test(path)) imports[path] = content;
			else if (/\.css$/.test(path)) style.push(content);
			else markup.push(content);
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
		const code = `
	<script>
		var app = window.APP = { };
		ons.ready(function() {
			setTimeout(function() { 
				document.getElementById('codelab-splash-introduction').className += ' hide';
				setTimeout(function() { 
					${result}
				}, 150);
			}, 2000);
		});
	</script>

	<style type="text/css" >
		${style.join('\n')}
	</style>

	${markup.join('\n')}
`;

		await $fsx.ensureFile(compiled);
		await $fsx.writeFile(compiled, code);
		await $fsx.utimes(compiled, timestamp, timestamp);

		resolve({ success: true });
	});
}

// fake account
function getAnonymous() {
	return { first: 'CodeLab Student', avatar: '' };
}