import { $ } from '../../lib';
import { broadcast } from '../../events';

export default class ProgressAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	// handles a variety of scenarios to check if
	// validation of the slide is allowed
	update = (obj, actions) => {
		const isAllowed = !!this.allowed;
		let shouldAllow;

		// check for true
		if (obj === true)
			shouldAllow = true;

		// check for falsy value
		if (!obj)
			shouldAllow = false;

		// check for an error object
		if ('error' in obj)
			shouldAllow = !obj.error

		// apply the result
		if (shouldAllow) this.allow();
		else this.block();

		// check for any functions
		if (!actions) return;

		// switching to allowed
		if (!isAllowed && shouldAllow && actions.allow) {
			actions.allow();
			actions.always();
		}
		// switching to denied
		else if (isAllowed && !shouldAllow && actions.deny) {
			actions.deny();
			actions.always();
		}

	}

	// quick access if the next step is allowed
	get allowed() {
		return $('#assistant .slide .next').is(':visible');
	}

	// allow moving to the next slide
	allow = () => {
		broadcast('allow-next');
	}

	// immediately goes to the next slide
	next = () => {
		broadcast('progress-next');
	}
	
	// prevent moving to the next slide
	block = () => {
		broadcast('block-next');
	}

}