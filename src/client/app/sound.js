/// <reference path="./types/index.js" />

import _ from 'lodash';
import { Howl } from 'howler';

const $sounds = new Howl({
	// src: ['/__codelab__/sounds.webm', '/__codelab__/sounds.mp3'],
	preload: true,
	src: ['/__codelab__/app/sounds.mp3'],
	sprite: {
		notify: [0, 500]
	}
});

// handles playing an audio file
function play(key, options = { }) {
	const id = $sounds.play(key);
	if (_.isNumber(options.balance))
		$sounds.stereo(options.balance, id);
}

/** plays a notification noise 
 * @param {SoundOptions} [options] sound choices
*/
function notify(options) {
	play('notify', options);
}

// export sound choices
export default {
	notify
};