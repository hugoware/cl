
importScripts('/__codelab__/babel.min.js');
import { resolveImports, getErrorFile } from '../../compilers/simplescript/modules';

// import $ts from 'typescript/lib/typescriptServices';
import $lfs from '../app/lfs';

// handle incoming messages
self.onmessage = async (msg) => {
	const command = msg.data[0];

	// check for the work to perform
	if (command === 'compile')
		compileFile(msg.data[1]);
};

// handles standard compiling of pug files
async function compileFile(file) {
	let code;
	try {

		// load all files used
		const files = { };
		await $lfs.pull(['.ts', '.js'], item => {
			files[item.path] = item.content;
		});
		
		// replace modules with imports
		code = resolveImports(file, files);
		const compiled = Babel.transform(code, { presets: ['es2015'] }).code;

		// share the generated code
		self.postMessage(['compile:ok', { success: true, content: compiled }]);
	}
	// check for errors
	catch (err) {

		const { loc = { } } = err;
		let line;
		let column = loc.column;
		let message = err.message;
		let source = file;

		// try clean up
		message = message.replace(/\(\d+\:\d+\)[^$]*/g, '');

		// this was an error importing a module
		if (err.isImportError) {
			line = loc.line;
			source = err.file;
		}
		// needs to resolve the actual file and error
		else {
			const offset = getErrorFile(code, err.index);
			line = loc.line - offset;
		}

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

// notify this has been loaded
self.postMessage(['load:ok']);