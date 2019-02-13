import { broadcast } from '../../events';
import $state from '../../state'

export default class ContentAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	// allow moving to the next slide
	getFile = path => {
		return $state.paths[path];
	}

}