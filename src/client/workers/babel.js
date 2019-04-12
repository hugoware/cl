
import $url from 'url';
import $lfs from '../app/lfs';
import BabelCompiler from '../../compiler/babel';

importScripts('/__codelab__/babel.min.js');


// handle incoming messages
self.onmessage = async (msg) => {
	const command = msg.data[0];

	// check for the work to perform
	if (command === 'compile')
		compileFile(msg.data[1]);
};

// handles standard compiling of pug files
async function compileFile(file) {
	let compiler;
	try {

		// load all files used
		const files = { };
		await $lfs.pull(['.js'], item => {
			files[item.path] = item.content;
		});

		// creates a common client compiler
		compiler = new BabelCompiler({
			entry: file,
			babel: Babel,
			files
		});

		// compiles the final code
		const compiled = compiler.compile();
		
		// share the generated code
		self.postMessage(['compile:ok', { success: true, content: compiled }]);
	}
	// check for errors
	catch (err) {

		const { loc = { } } = err;
		let line;
		let column = loc.column;
		let message = err.message;
		let source = compiler ? compiler.file : file;

		// try clean up
		message = message.replace(/\(\d+\:\d+\)[^$]*/g, '');

		// // this was an error importing a module
		// if (err.isImportError) {
		// 	line = loc.line;
		// 	source = err.file;
		// }
		// // needs to resolve the actual file and error
		// else {
		// 	const offset = getErrorFile(code, err.index);
		// 	line = loc.line - offset;
		// }

		// try and determine the real line number
		self.postMessage(['compile:ok', {
			success: false,
			error: {
				line, column, message,
				file: source,
				path: source
			}
		}]);
	}

}


/** returns the actual starting offset for a code file
 * @param {string} code the code to check
 * @returns {number} the line number offset
 */
export function getErrorFile(code, index) {
	const files = code.substr(index).split(/\#\#CODELAB\_FILE\#\#:/);
	files.pop();
	return files.join('##CODELAB_FILE##:').split(/\n/g).length;
}


// notify this has been loaded
self.postMessage(['load:ok']);