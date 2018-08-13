
import getProjectType from '../queries/get-project-type';
import compileFile, { CompileFileResult } from './compile-file';
import DependencyResolver from '../dependency-resolver';

/** handles compiling a project in response to a file change 
 * @param {string} id the project id
 * @param {string} path the path to the file to compile
*/
export default async function compileProject(id, path) {
	const type = await getProjectType(id);

	// if (type)
	const compiler = compileCommonProject;

	// run the selected compiler
	return await compiler(id, path);
}

// just common resolves for now
async function compileCommonProject(id, path) {
	const messages = [ ];

	// start by compiling the main file
	const result = await compileFile(id, path);

	// append the error, if any
	if (!result.success)
		messages.push(result.error);
	
	// resolve dependencies
	const resolver = new DependencyResolver(id, path);
	const dependencies = await resolver.findDependencies();

	// if there are dependencies, compile them now
	for (const dependency of dependencies) {
		const result = await compileFile(id, dependency);
		if (!result.success)
			messages.push(result.error);
	}

	return messages;
}
