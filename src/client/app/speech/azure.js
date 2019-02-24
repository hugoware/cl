import { _, Howl } from '../lib';
import $state from '../state';
import $api from '../api';

let $active = {};
const $cache = {};

// no initialization required
export async function init() {
	return new Promise(resolve => resolve());
}

// pausing not used?
export function pause() { }

// performs a speak request
export async function speak(message) {
	
	// stop the current sound
	stop();

	// no speaking
	if (!$state.allowSpeech)
		return;

	// fix the message
	message = _.isArray(message) ? message : [message];
	message = _.filter(message, _.isString).join('\n\n');
	
	// find out the URL for the new sound
	const result = await $api.request('request-speech', {
		voice: 'female',
		text: message
	});

	// check for the sound
	let instance = $cache[result.key];
	if (instance) {
		instance.sound.play();
	}
	else {

		// create the instance
		instance = $cache[result.key] = {
			key: result.key,
			sound: new Howl({
				src: [`/__codelab__/speak/${result.key}.mp3`]
			})
		};

		// once ready, play it
		instance.sound.once('load', () => {
			if ($active.key !== result.key) return;
			$active.sound.play();
		});

	}

	// set as the playing sound
	$active = instance;

	// // Fires when the sound finishes playing.
	// $active.sound.on('end', function () {
	// 	delete $active.sound;
	// });
}

// stops the currently playing audio clip
export function stop() {
	if ($active.sound)
		$active.sound.stop();
}

// 
export default {
	init,
	pause,
	speak,
	stop
};