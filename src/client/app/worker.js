import _ from 'lodash';
import { getExtension } from './utils';

const $cache = { };

// a map of file extensions to workers
const $workers = {
	'jade': 'pug',
	'pug': 'pug',
	'sass': 'scss',
	'scss': 'scss',
	'html': 'html',
	'ts': 'typescript',
	'typescript': 'typescript',
	// 'rb': 'ruby',
	// 'ruby': 'ruby',
	// 'css': 'css',
	// 'js': 'js'
};

// helper class to use async with workers
class WorkerHelper {

	constructor(name) {
		this.worker = new Worker(`./__codelab__/${name}.js`);
		this.worker.onmessage = this.handleMessage;
		this.pending = { };
	}

	// waits for incoming messages
	handleMessage = msg => {
		const data = msg.data;
		const args = data[1];
		const parts = _.trim(data[0]).split(':');
		const command = parts[0];
		const result = parts[1];
		const handler = this.pending[command];
		delete this.pending[command];

		// no handler -- this shouldn't really happen
		if (!handler) return;

		// resolve the message
		const { resolve, reject } = handler;
		if (result === 'ok') resolve(args);
		else reject(args);
	}

	/** cancels existing work, if any */
	cancel = key => {
		this.worker.terminate();

		// handle cleanup
		if (!key) this.pending = { };
		else delete this.pending[key];
	}

	/** sends a worker request
	 * @param {string} command the name of the command
	 * @param {object} [args] the arguments, if any
	 */
	request = async (command, ...args) => {
		
		// check for anything already queued
		if (this.pending[command]) {
			this.pending[command].reject('work_interrupted');
			delete this.pending[command];
		}

		// create the work request
		return new Promise((resolve, reject) => {
			this.pending[command] = { resolve, reject };
			this.worker.postMessage([command, ...args]);
		});
	}

}

// creates a worker when missing
async function create(name) {
	return new Promise(resolve => {
		const worker = new WorkerHelper(name);
		worker.pending.load = { 
			resolve: () => resolve(worker)
		};
	});
}

// detrmines the best worker for a file name
function getWorkerForFile(file) {
	const ext = getExtension(file, { removeLeadingDot: true });
	return $workers[ext];
}

/** gets access to a worker class
 * @param {string} name the name of the worker to load
 * @returns {WorkerHelper}
 */
export default async function getWorker({ name, file }) {
	if (file) name = getWorkerForFile(file);

	// no worker required for this file
	if (!$workers[name])
	return null;
	
	// load the worker
	console.log('load worker:', name);
	return new Promise(async (resolve) => {

		// check the cache first
		let worker = $cache[name];
		if (worker)
			return resolve(worker);
		
		// create the worker
		worker = await create(name);
		$cache[name] = worker;
		resolve(worker);
	});
}