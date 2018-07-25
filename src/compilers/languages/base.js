
/**
 * Compiler options
 * @typedef {Object} CompilerOptions
 * @prop {string} source The source file to compile
 * @prop {string} destination The location to save the compiled file
 * @prop {string} localPath The project local path for a file
 * @prop {string} projectPath The project root for the file
 */

/** handles creating a default error when the server
 * fails to write a compiled file
 * @param {string} file the path to the file being saved
 */
export function createServerError(file) {
	return {
		message: `There was a server error compiling ${file}`,
		hint: 'The server had a problem writing the information for this file. This does not mean that there is an error in the code. Try and save again and if the issue continues to happen, ask for help.'
	}
}

export default class BaseCompiler {

	/** Handles compiling a file
	 * @param {CompilerOptions} source the options for compiling a file
	 */
	async compile() {
		throw 'compiler_not_implemented';
	}

}