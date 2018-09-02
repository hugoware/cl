import $ from 'jquery';
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
	}

	// clean up - if any
	dispose() {
		$context.off('mouseover.wait');
		$context.off('mouseout.wait');
		$context.off('click.wait');
	}

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
