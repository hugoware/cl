import { _, $ } from '../../lib';
import { broadcast } from '../../events';

export default class ProgressAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	// checking if a status is successful or not
	isSuccess({ compare, result, valid }) { 
		let success;

		// alt aliases to check for
		compare = valid || result || compare;

		// check for true
		if (compare === true)
			success = true;

		// check for falsy value
		if (!compare)
			success = false;

		// check for an error object
		if ('error' in compare)
			success = !compare.error

		return success;
	}

	// handles a variety of scenarios to check if
	// validation of the slide is allowed
	check = ({ compare, result, valid, allow = _.noop, deny = _.noop, always = _.noop }) => {
		const isAllowed = !!this.allowed;
		const success = this.isSuccess({ compare, result, valid });

		// switching to allowed
		if (!isAllowed && success && allow) {
			try { allow(); }
			finally { always(); }
		}
		// switching to denied
		else if (isAllowed && !success && deny) {
			try { deny(); }
			finally { always(); }
		}
	}

	// perform updates
	update = options => {
		const allow = options.allow || _.noop;
		const deny = options.deny || _.noop;

		// setup actions
		const params = _.assign({ }, options, { 
			allow: () => {
				allow();
				this.allow();
			},
			deny: () => {
				deny();
				this.block();
			}
		});

		// perform the check with the custom options
		this.check(params);
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