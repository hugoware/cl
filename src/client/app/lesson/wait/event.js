import _ from 'lodash';
import $ from 'jquery';
import $state from '../../state';
import { listen, remove } from '../../events';
const $context = $(document.body);

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
	const debounce = 0 | (commands.event[2] || 0);
	const action = $state.lesson.getValidator(validator);
	
	// handles validation
	instance.onValidation = (...args) => {

		// perform with a delay to allow anything to catch up
		clearTimeout(instance.__debounce);
		instance.__debounce = setTimeout(() => {

			// check the validation
			const success = action.apply($state.lesson.instance, args);
			onSuccess(success);
		}, debounce);
	};

	// perform validation immediately
	if (_.isFunction(instance.onValidation.init))
		instance.onValidation.init();

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
