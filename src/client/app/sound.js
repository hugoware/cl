/// <reference path="./types/index.js" />

import { _, Howl } from './lib';

const $sounds = new Howl({
	// src: ['/__codelab__/sounds.webm', '/__codelab__/sounds.mp3'],
	preload: true,
	src: ['/__codelab__/app/sounds.mp3'],
	sprite: {
		notify: [0, 500],
		success: [1000, 1750],
		error: [3000, 500],
		taskComplete: [6500, 900],
		taskListComplete: [3900, 2500],
	}
});

// handles playing an audio file
function play(key, options = { }) {
	// hack - seems like sounds can conflict with speech
	setTimeout(() => {
		try {
			const id = $sounds.play(key);
			if (_.isNumber(options.balance))
			$sounds.stereo(options.balance, id);
		}
		// sound errors should never break the app
		catch (err) { }
	});
}

/** plays a notification noise 
 * @param {SoundOptions} [options] sound choices
*/
function notify(options) {
	play('notify', options);
}

/** plays a success noise 
 * @param {SoundOptions} [options] sound choices
*/
function success(options) {
	play('success', options);
}

/** plays a error noise 
 * @param {SoundOptions} [options] sound choices
*/
function error(options) {
	play('error', options);
}

/** plays a task noise 
 * @param {SoundOptions} [options] sound choices
*/
function task(all, options) {
	play(all ? 'taskListComplete' : 'taskComplete', options);
}

// export sound choices
export default {
	notify,
	success,
	error,
	task
};