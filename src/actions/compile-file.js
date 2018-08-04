
import $path from '../path';
import getCompiler from '../compilers/languages';

/** @typedef {Object} CompileFileResult
 * @prop {boolean} success did this compile successfully
 * @prop {object} [error] error messages when failing to compile
 */

/** uses an appropriate compiler to write a compiled version of the targeted file
 * @param {string} projectId the ID of the project to compile
 * @param {string} type the project type that's being compiled
 * @param {string} path The path to the file to compile
 */
export default async function compile(projectId, path) {

	// check for a relevant compiler
	const compiler = getCompiler(path);
	if (!compiler)
		return { success: true };

	// gather the paths to use
	const root = $path.resolveProject(projectId);
	const source = $path.resolveProject(projectId, path);
	const destination = $path.resolveProject(projectId, path, true);

	// find the appropriate compiler
	return await compiler.compile({
		source, destination,
		projectDirectory: root,
		localPath: path
	});

}