import { broadcast } from '../../events';

export default class ProgressAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	// allow moving to the next slide
	allow = () => {
		broadcast('allow-next');
	}
	
	// prevent moving to the next slide
	block = () => {
		broadcast('block-next');
	}

}