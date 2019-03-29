import _ from 'lodash';
import $sound from '../../sound';

export default class SoundAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	notify = $sound.notify
	success = $sound.success
	error = $sound.error
	task = $sound.task

}