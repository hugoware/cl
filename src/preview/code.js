
import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';
import $database from '../storage/database';
import $typescript from 'typescript';
import protectCode from '../compilers/simplescript/protect';
import { resolveImports, getErrorFile } from '../compilers/simplescript/modules';
import { find } from '../storage/file-system/index';


// return web content as required
export default async function handleRequest(request, response, project) {
	const { id } = project;

	// there are no look ups, just use the project as is
	const source = $path.resolveProject(id);
	const compiled = $path.resolveCache(`/projects/${id}/compiled.js`);

	// check if already cached
	// const exists = await $fsx.exists(compiled);
	const exists = false; // await $fsx.exists(compiled);

	// if it's not compiled, then generate it now
	if (!exists)
		await compileProject(source, compiled);

	// grab the user info
	const results = await $database.users.find({ id: project.ownerId })
		.project({ first: 1, avatar: 1, anonymous: 1 })
		.toArray();

	// find the owner
	let user = results[0] || getAnonymous();
	if (user.anonymous) user = getAnonymous();

	// now, render the result
	const data = await $fsx.readFile(compiled);
	const code = data.toString();
	response.render('projects/code', { code, project, user });
}

// compiles a project to be used in the code window
async function compileProject(source, compiled) {
	
	// gather up all files
	const files = await find(source, ['.ts']);
	const imports = { };
	for (let i = 0, total = files.length; i < total; i++) {
		const path = files[i];
		const relative = $path.removeLeadingSlash(path);
		const absolute = $path.resolve(source, relative);
		const data = await $fsx.readFile(absolute);
		imports[path] = data.toString();
	}
	
	// perform the compile
	let code = resolveImports('/main.ts', imports);
	code = protectCode(code);

	// compile
	let result;
	try {
		result = $typescript.transpile(code, {
			noResolve: true,
			strictFunctionTypes: true,
			removeComments: false,
			target: 'ES5',
			lib: 'ES2015'
		});
	}
	// there was an error - save a compiled
	// version that notifies there was a problem
	catch (ex) {
		result = `window.__CODELAB__.projectError();`;
	}

	// write the result
	await $fsx.ensureFile(compiled);
	return await $fsx.writeFile(compiled, result);
}

// fake account
function getAnonymous() {
	return { first: 'CodeLab Student', avatar: '' };
}