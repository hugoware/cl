
const REGISTER_MODULE = `

___CODELAB___register("%PATH%", function (module, exports, require) {
	%CODE%

	// %%INJECT%%
});

`;

// about the weird resolve function
// can't use string replace with secondary function
// in the javascript interpreter -- thinks of the
// function as the replacement and not something
// to perform for each match
//
// actual = actual.replace(/\\.{1,2}\\/ / g, function (match) {
// 	// if (match === '../') relative.pop();
// 	return '';
// });
const BUNDLE_INIT = `
(function() {
	var ___CODELAB___modules = { };
	var ___CODELAB___init = [ ];

	// tries to resolve a path
	function resolvePath(parts, file) {
		var relative = [].slice.call(parts);
		do {
			if (file.substr(0, 2) === './') {
				file = file.substr(2);
			}
			else if (file.substr(0, 3) === '../') {
				file = file.substr(3);
				relative.pop();
			}
			else {
				break;
			}
		}
		while(true);

		// combine the result
		relative.push(file);
		var location = relative.join('/');
		if (location[0] !== '/')
			location = '/' + location;

		// check for
		return location;
	}

	// uses to attach each module
	function ___CODELAB___register(path, init) {
		var module = { exports: { } };

		// name
		var name = path.replace(/\\.[^\\.]*$/, '');
		var parts = name.split('/');
		parts.pop();

		// custom require function
		var require = function(resolve) {
			var path = resolvePath(parts, resolve + '.js');
			var found = ___CODELAB___modules[path];
			// console.log('try1', path, found);

			if (!found) {
				path = resolvePath(parts, resolve + '/index.js');
				found = !found && ___CODELAB___modules[path];
				// console.log('try2', path, found);
			}

			if (!found) {
				throw 'Could not find module: ' + resolve;
			}

			return found.exports;
		}

		// create the module
		init(module, module.exports, require);
		___CODELAB___modules[path] = module;
	}

`;

const BUNDLE_END = `

})();
`;

// creates an absolute path from a relative path
function getAbsolute(path, rel) {
	const parts = [].concat(path);

	// make absolute
	rel = rel.replace(/\.{1,2}\//g, match => {
		if (match === '../') parts.pop();
		return '';
	});

	// fix the path
	parts.push(`${rel}.js`);

	// finalize the path
	let absolute = parts.join('/');
	if (absolute[0] !== '/')
		absolute = `/${absolute}`;
	return absolute;
}

export default class BabelCompiler {

	constructor(options) {
		this.babel = options.babel;
		this.files = options.files;
		this.entry = options.entry;
		this.dependencyMap = { };

		this.compiled = { };
		this.modules = [ ];
	}

	// handles resolving all imported modules in other files
	resolveImports(relativeTo, imports) {

		// remove the filename
		const parts = relativeTo.split('/');
		parts.pop();

		// resolve all imports
		for (let i = 0; i < imports.length; i++) {
			const item = imports[i];

			// create the dependency
			const absolute = getAbsolute(parts, item.source);
			this.dependencyMap[relativeTo] = this.dependencyMap[relativeTo] || { };
			this.dependencyMap[relativeTo][absolute] = { };
			
			// if already compiled, skip
			if (this.compiled[absolute])
				continue;

			// perform the compile
			const code = this.files[absolute];
			this.file = absolute;
			const result = this.babel.transform(code, { presets: ['es2015'] });
			this.compiled[absolute] = result.code;

			// resolve dependencies
			this.resolveImports(absolute, result.metadata.modules.imports);
		}
	}

	// resolves dependency order
	resolveDependencyMap(path, stack) {
		const node = !path ? this.dependencyMap : this.dependencyMap[path];
		stack = stack || [ ];

		// resolve children first, if any
		if (!!node) {
			for (const id in node) {
				if (stack.indexOf(id) > -1)
				throw 'cyclical dependency';
				
				// resolve the children
				this.resolveDependencyMap(id, [path].concat(stack))
			}
		}

		// add to the module list
		if (!!path && path !== this.entry)
			this.modules.push(path);
	}

	// compiles into a runnable file
	compile() {

		// start compiling as required
		const entry = this.files[this.entry];
		
		// try and compile
		this.file = this.entry;
		const result = this.babel.transform(entry, { presets: ['es2015'] });
		this.compiled[this.entry] = result.code;

		// resolve modules
		this.resolveImports(this.entry, result.metadata.modules.imports);

		// add each file based on deepest nested dependency
		this.resolveDependencyMap();
		this.modules.push(this.entry);

		// assemble the final file
		const added = { };
		const bundle = [ ];
		for (let path of this.modules) {
			if (added[path]) continue;
			added[path] = true;

			// register the module
			let code = REGISTER_MODULE.replace('%PATH%', path);
			code = code.replace('%CODE%', this.compiled[path]);
			bundle.push(code);
		}

		// make sure there's something
		if (bundle.length === 0)
			bundle.push('throw "No code files included"');

		// finalize the result
		bundle.unshift(BUNDLE_INIT);
		bundle.push(BUNDLE_END);

		// resolve the final code
		return bundle.join('\n');
	}

}

