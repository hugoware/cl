/// <reference path="./types/index.js" />

import _ from 'lodash';
import { Howl } from 'howler';

const $sounds = new Howl({
	// src: ['/__codelab__/sounds.webm', '/__codelab__/sounds.mp3'],
	preload: true,
	src: ['/__codelab__/app/sounds.mp3'],
	sprite: {
		notify: [0, 500],
		success: [1000, 1750],
		error: [3000, 500]
	}
});

// handles playing an audio file
function play(key, options = { }) {
	try {
		const id = $sounds.play(key);
		if (_.isNumber(options.balance))
		$sounds.stereo(options.balance, id);
	}
	catch (err) {
		// sound errors should never break the app
	}
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

// export sound choices
export default {
	notify,
	success,
	error
};