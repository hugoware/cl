import { Dexie } from './lib';

const $db = new Dexie('CodeLab');
$db.version(1).stores({ 
	files: '&path, content' 
});

// a cache of sync files that can be loaded immediately
// using `readFileSync` -- this is only populated when
// `pull()` is called in advance
const $sync = { };

/** converts urls and paths to something more normalized
 * @param {string} path the path to normalize
 * @returns {string} a path that's root relative */
export function normalizePath(path) {
	path = (path || '').toString()
		.replace(/^ *| *$/g, '') // trim the whitespace
		.replace(/\/+/g, '/') // make sure there's no double slashes
		.replace(/^\.?\//, '') // remove the leading slash (relative dot as well)
		.replace(/\.\.\//g, ''); // remove folder relative pathing
	return `/${path}`;
}

/** handles reading file contents 
 * @param {string} path the path to read
 * @returns {string} the file content, if any
*/
export async function readFile(path) {
	const results = await $db.files.where('path').equals(path).toArray();

	// if the file is missing
	if (results.length === 0)
		return FileNotFoundError(path);

	// return the record
	const record = results[0] || { };
	return record.content || '';
}

/** handles writing file contents 
 * @param {string} path the path to write to
 * @param {string} content the data to write
*/
export async function writeFile(path, content = '') {
	return $db.files.put({ path, content });
}


/** handles moving a path from one location to another
 * @param {string} source the path to move
 * @param {string} target the location to change to
 */
export async function moveFile(source, target) {
	const content = await readFile(source);
	if (!content) return;

	// replace the record
	await removeFile(source);
	return await writeFile(target, content);
}

/** handles removing a file from the system 
 * @param {string|string[]} path the file or files that should be removed
*/
export async function removeFile(path) {
	let files = $db.files;

	// query depending on the argument
	const isArray = path instanceof Array || typeof path === 'array';
	files = isArray
		? files.where('path').anyOf(path)
		: files.where({ path });

	// perform the delete
	files.delete();
}

/** removes all cached files */
export async function clear() {
	return $db.files.clear();
}


// /** imports all files and content */
// export async function populate(files) {
	
// 	// remove anything that's there
// 	await clear();

// 	// create the structure and add files
// 	const records = _(files)
// 		.filter(file => !file.content)
// 		.map(file => ({ path: file.path, content: file.content }));
// 	$db.files.bulkAdd(records);
// }

/** pulls a series of files into memory
 * @param {string[]} exts the extensions to use
 * @param {function} [action] optional action to perform on each call
 */
export async function pull(extensions, action) {
	action = action || writeToSync;

	return $db.files.each(item => {
		const { path } = item;
		const len = path.length;
		for (const ext of extensions)
			if (path.substr(len - ext.length) === ext)
				action(item);
	});
}

/** handles extracting just the file name from a path
 * @param {string} path the path to check
 * @returns {string} the file name
 */
export function getFileName(path) {
	path = (path || '').toString();
	path = path.split('?')[0];
	const parts = path.split(/\//g);
	return parts[parts.length - 1];
}

// quick write function to cache local files
function writeToSync(item) {
	$sync[item.path] = item.content
}

// standard error for missing files
function FileNotFoundError(path) {
	const err = new Error(`${path} was not found`);
	err.name = 'File Not Found';
	return err;
}

// immediately try and attach the FS to the context
var LFS = {
	readFile: async (path, callback) => {
		try {
			const content = await readFile(path);
			if (callback) callback(null, content);
			else return content;
		}
		// handle the errors
		catch (err) {
			if (callback) callback(err);
			else throw err;
		}
	},

	readFileSync: path => {

		if (!$sync[path])
			throw FileNotFoundError(path);
		return $sync[path];
	}
};

// install to global contexts
if (typeof self !== 'undefined') self.LFS = LFS;
if (typeof window !== 'undefined') window.LFS = LFS;
if (typeof global !== 'undefined') global.LFS = LFS;

export default {
	// populate,
	pull,
	getFileName,
	normalizePath,
	clear,
	read: readFile,
	remove: removeFile,
	write: writeFile,
	move: moveFile,
};