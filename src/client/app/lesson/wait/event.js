import { _, $ } from '../../lib';
import $state from '../../state';
import { listen, remove } from '../../events';
const $context = $(document.body);
const ALWAYS_VALID = () => true;

// waits for a user interaction
export default class UserEvent {

	constructor(selector, onSuccess) {
		this.selector = selector;

		// events to dispose
		this.events = { };
		this.onSuccess = onSuccess;

		// setup hover events
		if (selector.commands.hover)
			setupHover(this);

		// setup click events
		else if (selector.commands.click)
			setupClick(this);

		// setup a global listener
		else setupEvent(this);
	}

	// clean up - if any
	dispose() {
		$context.off('mouseover.wait');
		$context.off('mouseout.wait');
		$context.off('click.wait');

		// clear any timers
		clearTimeout(this.__debounce);
		clearTimeout(this.__delay);

		// check for alt events
		remove(this.__disposeListener);
		delete this.__disposeListener;
	}

}

// setup a custom event handler
function setupEvent(instance) {
	const { onSuccess, selector } = instance;
	const { commands } = selector;

	// find the validation action
	const event = commands.event[0];
	const validator = commands.event[1];
	const action = $state.lesson.getValidator(validator) || ALWAYS_VALID;
	const debounce = (0 | (commands.event[2] || 0)) || action.debounce;
	const hasDelay = _.isNumber(action.delay);

	// validation process
	const validate = args => action.apply($state.lesson.instance, args);
	const cancel = () => {
		clearTimeout(instance.__delay);
		delete instance.__delay;
	};
	const finish = success => {
		cancel();
		if (success && action.success) action.success();
		onSuccess(success); 
	};

	
	// handles validation
	instance.onValidation = (...args) => {
		clearTimeout(instance.__debounce);

		// perform with a delay to allow anything to catch up
		instance.__debounce = setTimeout(() => {
			let success = validate(args);

			// check if anything needs to be done
			if (!!success === !!instance.success)
				return;

			// cache the result
			instance.success = success;

			// failures are reported right away
			if (!success)
				return finish(false);

			// if there's a delay, that means we want to wait to see if
			// the validation is still true after the required time limite;
			if (hasDelay) {

				// already pending
				if ('__delay' in instance) return;

				// save the success delay
				instance.__delay = setTimeout(() => {
					success = validate(args);
					finish(success);
				}, action.delay);

			}
			// otherwise, the return is immediate
			else finish(success);

		}, debounce);
	};

	// if this wants to be executed immediately
	if (action.init === true)
		try { 
			setTimeout(action, 250); 
		} catch(ex) {
			/* don't crash */
		}

	// wait for this event
	instance.__disposeListener = listen(event, instance.onValidation);
}

// wait for simple click events
function setupClick(instance) {
	instance.events.click = instance.onSuccess;
	$context.on('click.wait', instance.selector.selector, instance.events.click);
}

// setup a hover wait event
function setupHover(instance) {

	// set the timeout limit
	let timeout = instance.commands.hover[0];
	timeout = timeout.replace(/ms$/i, '');
	timeout = timeout.replace(/s$/i, '000');
	timeout = parseInt(timeout);

	// set to true, after a delay, when moved over
	instance.events.mouseover = () => {
		clearTimeout(instance.delay);
		instance.delay = setTimeout(instance.onSuccess, timeout);
	};

	// undo if the mouse is moved out
	instance.events.mouseout = () => {
		clearTimeout(instance.delay);
	};

	// wait for events
	$context.on('mouseover.wait', instance.selector.selector, instance.events.mouseover);
	$context.on('mouseout.wait', instance.selector.selector, instance.events.mouseout);
}
