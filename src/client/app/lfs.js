import Dexie from 'dexie';
const $db = new Dexie('CodeLab');
$db.version(1).stores({ 
	files: '&path, content' 
});

// a cache of sync files that can be loaded immediately
// using `readFileSync` -- this is only populated when
// `pull()` is called in advance
const $sync = { };

/** handles reading file contents 
 * @param {string} path the path to read
 * @returns {string} the file content, if any
*/
export async function readFile(path) {
	if (module.exports.adjustPath)
		path = module.exports.adjustPath(path);

	const results = await $db.files.where('path').equals(path).toArray();
	const data = (results || [])[0];
	return data.content;
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
export async function moveFile() {
	return $db.files.where({ path: source }).modify({ path: target });
}


/** removes all cached files */
export async function clear() {
	return $db.files.clear();
}


/** imports all files and content */
export async function populate(files) {
	
	// remove anything that's there
	await clear();

	// create the structure and add files
	const records = _(files)
		.filter(file => !file.content)
		.map(file => ({ path: file.path, content: file.content }));
	$db.files.bulkAdd(records);
}

/** pulls a series of files into memory
 * @param {string[]} exts the extensions to use
 * @param {function} [action] optional action to perform on each call
 */
export async function pull(extensions, action) {
	action = action || writeToSync;

	return $db.files.each(item => {
		const path = item.path;
		const len = path.length;
		for (const ext of extensions)
			if (path.substr(len - ext.length) === ext)
				action(item);
	});
}

// quick write function to cache local files
function writeToSync(item) {
	$sync[item.path] = item.content
}

// immediately try and attach the FS to the context
var LFS = {
	readFile: async (path, callback) => {
		const content = await readFile(path)
		if (callback) callback(content);
		return content;
	},

	readFileSync: path => {
		return $sync[path];
	}
};

// install to global contexts
if (typeof self !== 'undefined') self.LFS = LFS;
if (typeof window !== 'undefined') window.LFS = LFS;
if (typeof global !== 'undefined') global.LFS = LFS;

export default {
	populate,
	pull,
	read: readFile,
	write: writeFile,
	move: moveFile,
};