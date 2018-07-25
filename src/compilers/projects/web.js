

// export default async function compile(id, path) {

// 	// compile this file, if needed
// 	await compile(path);

// 	// last, check for dependencies
// 	const resolver = new DependencyResolver(this, path);
// 	const dependencies = await resolver.findDependencies();

// 	// if there are dependencies, compile them now
// 	const self = this;
// 	for (const dependency of dependencies)
// 		await self.compile(dependency);

// }

// /** uses an appropriate compiler to write a compiled version of the targeted file
//  * @param {string} path The path to the file to compile
//  */
// async function compile(path) {

// 	// check for a relevant compiler
// 	const compiler = getCompiler(path);
// 	if (!compiler)
// 		return Promise.resolve();

// 	// gather the paths to use
// 	const source = this.resolvePath(path);
// 	const destination = this.resolvePath(path, true);

// 	// find the appropriate compiler
// 	// console.log('wants to write', source, 'to', destination);
// 	const result = await compiler.compile({
// 		source, destination,
// 		projectDirectory: this.path,
// 		localPath: path
// 	});

// }


// // import Project from './base';
// // import DependencyResolver from '../../dependency-resolver';
// // import getCompiler from '../../compilers';

// // export default class WebProject extends Project {

// // 	/** handles writing file contents */
// // 	async write(path, data, doNotCreateIfMissing) {
		
// // 		// perform the normal write - if any exception
// // 		// is thrown, this should exit 
// // 		await super.write(path, data, doNotCreateIfMissing);


// // 		return Promise.resolve();
// // 	}

// // 	/** uses an appropriate compiler to write a compiled version of the targeted file
// // 	 * @param {string} path The path to the file to compile
// // 	 */
// // 	async compile(path) {

// // 		// check for a relevant compiler
// // 		const compiler = getCompiler(path);
// // 		if (!compiler)
// // 			return Promise.resolve();

// // 		// gather the paths to use
// // 		const source = this.resolvePath(path);
// // 		const destination = this.resolvePath(path, true);

// // 		// find the appropriate compiler
// // 		// console.log('wants to write', source, 'to', destination);
// // 		const result = await compiler.compile({
// // 			source, destination,
// // 			projectDirectory: this.path,
// // 			localPath: path
// // 		});

// // 	}

// // }