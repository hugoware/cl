import _ from 'lodash';
import { broadcast } from './events';
import getWorker from './worker';
import $lfs from './lfs';

const $compiled = { };
const $errors = { };
const $timers = { };

/** returns the content for a requested path
 * @param {string} path the path of the file to load
 * @param {boolean} [doNotCompile] will skip the compile step if requested
 * @returns {string} the compiled content (if compiled)
 */
export function get(path) {
	return new Promise(async (resolve) => {
		let data = $compiled[path];
		console.log('will get', path, data);
		if (data)
			return resolve(data);
		
		// if there's nothing found, compile it now
		const result = await compile(path, { silent: true });
		const content = result.success ? result.content : '';
		return resolve(content);
	});
}

/** moves path names and then performs a recompile 
 * @param {string} source the path of the file to move
 * @param {string} target the destination to overwrite
*/
export async function move(source, target) {

}

/** handles recompiling content
 * @param {string} path the path of the file to write
 * @param {string} content the content to replace
 */
export async function update(path, content) {
	$lfs.write(path, content);
	return await compile(path);
}

// tries to compile a file, if possible
export function compile(path, { silent } = { }) {
	return new Promise(async (resolve) => {
		let data = await $lfs.read(path);
		console.log('compile', path, data);

		// check for a worker
		const worker = await getWorker({ file: path });
		if (!worker)
			return resolve({ success: true, content: data });

		// run the compile step
		const result = await worker.request('compile', path);
		const previouslyHadErrors = _.some($errors);

		// if there's an error, update
		if (!result.success) {
			$errors[path] = result.error;
			$compiled[path] = '';
		}
		// the compile worked
		else {
			delete $errors[path];
			$compiled[path] = result.content;
		}

		// check for compiler events
		const nowHasErrors = _.some($errors);
		if (previouslyHadErrors && !nowHasErrors)
			broadcast('compiler-result', { success: true });

		// there's some sort of remaining error
		else broadcast('compiler-result', {
			success: false,
			error: $errors[path],
			all: $errors
		});

		// notify this was compiled
		if (result.success && !silent)
			broadcast('compile-file', path);

		resolve(result);
	});
}


// share functions
export default {
	get,
	update,
	compile,
	move
};