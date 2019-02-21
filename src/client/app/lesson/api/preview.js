import _ from 'lodash';
import { broadcast } from '../../events';
import $state from '../../state'

export default class FileAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	addEvent(event, selector, action) {
		$state.preview.addEvent({ event, selector, action });
	}

	clearEvents() {
		$state.preview.clearEvents();
	}


}

// checks the path if it's actually a file
function getPath(path) {
	return _.isString(path) ? path : path.path;
}
