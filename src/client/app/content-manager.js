import _ from 'lodash';
import { broadcast } from './events';
import $errorManager from './error-manager';
import getWorker from './worker';
import $lfs from './lfs';

const $compiled = { };
const $errors = { };

const NEVER_COMPILED = { lastCompile: 0 };

/** returns the content for a requested path
 * @param {string} path the path of the file to load
 * @param {boolean} [doNotCompile] will skip the compile step if requested
 * @returns {string} the compiled content (if compiled)
 */
export function get(path) {
	return new Promise(async (resolve) => {
		let data = $compiled[path];
		if (data)
			return resolve(data.content);
		
		// if there's nothing found, compile it now
		const result = await compile(path, { silent: true });
		const content = result.success ? result.content : '';
		return resolve(content);
	});
}

/** checks the last write time for a file
 * @param {string} path the path of the file to check for
 * @returns {number} the timestamp of the last write time
 */
export function getLastWriteTime(path) {
	const data = $compiled[path] || NEVER_COMPILED;
	return data.lastCompile || 0;
}

/** moves path names and then performs a recompile 
 * @param {string} source the path of the file to move
 * @param {string} target the destination to overwrite
*/
export async function move(source, target) {

}

/** removes existing compiled content, if any
 * @param {string} path the path of the file to remove
 */
export async function remove(path) {
	delete $compiled[path];
}

/** handles recompiling content
 * @param {string} path the path of the file to write
 * @param {string} content the content to replace
 */
export async function update(path, content) {
	await $lfs.write(path, content);
	return await compile(path);
}

// tries to compile a file, if possible
export function compile(path, { silent } = { }) {

	// create a handler for when the work is ready to use
	const notifyFinished = !silent 
		? () => broadcast('compile-file', path)
		: _.noop;

	// kick off the work
	return new Promise(async (resolve) => {
		let data = await $lfs.read(path);

		// check for a worker
		const worker = await getWorker({ file: path });

		// no compile step required
		if (!worker) {
			notifyFinished();
			return resolve({ success: true, content: data });
		}

		// run the compile step
		const lastCompile = +new Date;
		const result = await worker.request('compile', path);

		// if there's an error, update
		if (!result.success) {
			$errorManager.add(path, result.error);
			$compiled[path] = { lastCompile, content: result.content || '' };
		}
		// the compile worked
		else {
			$errorManager.remove(path);
			$compiled[path] = { lastCompile, content: result.content };
		}
		// notify this was compiled
		if (result.success) notifyFinished();
		resolve(result);
	});
}

// share functions
export default {
	getLastWriteTime,
	get,
	remove,
	update,
	compile,
	move
};