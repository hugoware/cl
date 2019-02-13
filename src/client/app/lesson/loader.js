import { _ } from '../lib';

// shared lesson cache
const $lessons = { };

// how often to check for the loaded lesson
const TIME_PER_INTERVAL = 500;

// handles saving a script registration
function registerLesson(id, lesson) {
	console.log('register lesson:', id);
	$lessons[id] = lesson;
}

// sets the registration script for the page
function linkRegisterScript() {
	window.registerLesson = registerLesson;
}

/** handles loading an instance of a lesson */
export async function load(id) {
	return new Promise((resolve, reject) => {

		// lesson has already been loaded
		if ($lessons[id]) {
			const instance = $lessons[id];
			return resolve(instance);
		}

		// set a timeout limit
		let limit = 5000;

		// just make sure the register function is still set
		linkRegisterScript();

		// lesson needs to be loaded
		const script = document.createElement('script');
		let wait = setInterval(() => {

			// check if the script is loaded
			if (_.isFunction($lessons[id])) {
				clearInterval(wait);
				const instance = $lessons[id];
				return resolve(instance);
			}

			// count down
			limit -= TIME_PER_INTERVAL;
			if (limit > 0)
				return linkRegisterScript();

			// ran out of time
			clearInterval(wait);
			reject('lesson-timeout')

		}, TIME_PER_INTERVAL);
		
		// there was a problem
		script.onerror = err => {
			clearInterval(wait);
			reject('lesson-error', err);
		};
		
		// set the script to load
		script.src = `/__codelab__/lessons/${id}/index.js`;
		document.body.appendChild(script);
	});
}

export default {
	load
};