
importScripts('/__codelab__/typescript/typescriptServices.js');
import protectCode from '../../compilers/simplescript/protect';
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
		await $lfs.pull(['.ts'], item => {
			files[item.path] = item.content;
		});
		
		// replace modules with imports
		code = resolveImports(file, files);
		
		// apply apply code protection (loop safety, async simplification)
		const protect = protectCode(code);
		
		// compile to typescript
		const compiled = ts.transpile(protect, {
			noResolve: true,
			strictFunctionTypes: true,
			removeComments: false,
			target: 'ES5',
			lib: 'ES2015'
		});

		// share the generated code
		self.postMessage(['compile:ok', { success: true, content: compiled }]);
	}
	// check for errors
	catch (err) {

		let line;
		let column;
		let message;
		let source = file;

		// this was an error importing a module
		if (err.isImportError) {
			line = err.line;
			column = err.column;
			source = err.file;
			message = err.toString();
		}
		// needs to resolve the actual file and error
		else {
			const offset = getErrorFile(code, err.index);
			line = err.lineNumber - offset;
			column = err.column;
			message = err.description;
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