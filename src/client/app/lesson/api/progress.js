import { $ } from '../../lib';
import { broadcast } from '../../events';

export default class ProgressAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	// handles a variety of scenarios to check if
	// validation of the slide is allowed
	update = ({ compare, result, valid, allow = _.noop, deny = _.noop, always = _.noop }) => {
		const isAllowed = !!this.allowed;
		let shouldAllow;

		// alt aliases to check for
		compare = valid || result || compare;

		// check for true
		if (compare === true)
			shouldAllow = true;

		// check for falsy value
		if (!compare)
			shouldAllow = false;

		// check for an error object
		if ('error' in compare)
			shouldAllow = !compare.error

		// apply the result
		if (shouldAllow) this.allow();
		else this.block();

		// switching to allowed
		if (!isAllowed && shouldAllow && allow) {
			allow();
			always();
		}
		// switching to denied
		else if (isAllowed && !shouldAllow && deny) {
			deny();
			always();
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
		this.allow();
	}
	
	// prevent moving to the next slide
	block = () => {
		broadcast('block-next');
	}

}