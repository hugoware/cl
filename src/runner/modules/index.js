
import $url from 'url';

import timerModule from './timer.ts';
import consoleModule from './console.ts';

const $modules = { 
	timer: timerModule,
	console: consoleModule
};

export const CODE_START_DELIMITER = '//##CODELAB-START##';


/** returns the actual starting offset for a code file
 * @param {string} code the code to check
 * @returns {number} the line number offset
 */
export function getErrorFile(code, index) {
	const files = code.substr(index).split(/\#\#CODELAB\_FILE\#\#:/);
	files.pop();
	return files.join('##CODELAB_FILE##:').split(/\n/g).length;
}

/** handles inlining modules and file imports for code execution
 * @param {string} code the code to scan and import for
 * @param {Object<string, string>} fileImports the local files to include
  */
export function resolveImports(entry, sources) {
	const imports = [ ];

	// compile the file to gather all imports
	let code = sources[entry];
	const map = generateMap(entry, code);
	code = captureImports(map, sources, imports);

	// create the file with the imports at the top
	return imports.concat([ code ]).join('\n');
}


// handles gathering imports to apply at the end
function captureImports(map, sources, imports = [], imported = { }) {

	// start expanding out each imported request
	for (let i = 0, total = map.imports.length; i < total; i++) {
		const item = map.imports[i];

		// clear the import each time
		map.lines[item.index] = `// ${map.lines[item.index]}`;

		// if this is already imported, don't bother
		if (imported[item.source])
			continue;

		// since it hasn't been imported, add it to the import list
		const module = $modules[item.source];
		const file = sources[item.source];

		// check if anything was found
		if (!(module || file)) {
			const error = new Error(`Missing import: ${item.source}`);
			error.isImportError = true;
			error.line = item.index + 1;
			error.column = 0;
			error.file = item.source;
			throw error;
		}

		// since it was found, process as required
		imported[item.source] = true;
		if (module)
			imports.push(module);
		
		// it's a file to process
		else {
			const importedMap = generateMap(item.source, file);
			const importedCode = captureImports(importedMap, sources, imports, imported);
			imports.push(importedCode);
		}
	}

	// when finishing, update the first line
	map.lines[0] += `  //##CODELAB_FILE##:${map.path}`

	return map.lines.join('\n');
}



// extracts all import requests for a file
function generateMap(path, code) {
	const imports = [ ];

	// start checking each line
	const lines = code.split(/\n/g);
	for (let i = 0, total = lines.length; i < total; i++) {
		const line = lines[i];

		// is this an import?
		if (!/^ ?import +(\"|\')[^\"\']+(\"|\') ?;? ?$/.test(line))
			continue;

		// if it's an import, extract the name
		let source = line.replace(/^ ?import/, '')
			.replace(/(\'|\"|\;| )/g, '');

		// resolve relative to this path
		if (/\//.test(source)) {
			source = $url.resolve(path, source);
			source += '.ts';
		}

		// save it to the map
		imports.push({ index: i, source });
	}

	// return the map
	return { path, lines, imports };
}
