/// <reference path="../../types/index.js" />

import _ from 'lodash';
import Component from '../../component';
import { evaluateSelector } from '../../utils/selector';
import $state from '../../state';

const PREVENT_MESSAGE_HIDE_DELAY = 6000;
const PREVENT_MESSAGE_QUICK_HIDE_DELAY = 1500;
const PREVENT_MESSAGE_MARGIN = 50;

// tracking mouse coordinates
const $mouse = { };
window.addEventListener('mousemove', event => {
	$mouse.x = event.clientX;
	$mouse.y = event.clientY;
	
	// try to clear the popup, if possible
	PreventActionPopUp.clear();
});

/** helper function to run a block of code but require a condition before it works
 * @param {PermissionCheck} options
 */
export function requirePermission(check) {
	const { required, requires, permissions, args = [ ] } = check;

	// reset the prevent message for this attempt
	delete PreventActionPopUp.instance.__activated;
	
	// if this can be done, just execute the action
	// TODO: there's some naming differences that need to be
	// fixed -- prefer `permissions`
	let allowed = permissions || requires || required;
	if (_.isString(allowed) || _.isArray(allowed))
		allowed = $state.checkPermissions(allowed, ...args);

	// execute if they have permission
	if (!!allowed) {
		try {
			const allow = check.allow || check.allowed;
			if (_.isFunction(allow))
				allow();
		}
		finally {
			return true;
		}
	}

	// if this is just a silent check
	if (!!check.silent) return;

	// if this was already activated, don't display the message
	if (PreventActionPopUp.instance.__activated)
		return;

	// otherwise, display the error
	const { message } = check;
	PreventActionPopUp.instance.onPreventAction(null, message);
	return false;
}

export default class PreventActionPopUp extends Component {

	// helper to make the message clear quicker if the
	// mouse is moved in a time range
	static clear() {
		if (PreventActionPopUp.instance
			&& '__autoHide' in PreventActionPopUp.instance
			&& +new Date > PreventActionPopUp.instance.__autoHide)
			PreventActionPopUp.instance.onHide();
	}

	constructor() {
		super({
			template: 'prevent-popup',

			ui: {
				message: '.message',
				explain: '.explain',
			}
		});

		// get the default message
		this.defaultExplainMessage = this.ui.explain.text();

		// only one instance
		PreventActionPopUp.instance = this;

		// handle events for moving over the definitions
		this.listen('prevent-action', this.onPreventAction);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onHide);
		this.listen('window-resize', this.matchPosition);
	}

	// match the position on the screen
	matchPosition = () => {
		let x;
		let y;

		// has an element selector
		if (this.selector) {
			this.selector.refresh();
			const bounds = this.selector.getBounds();
			x = bounds.cx;
			y = bounds.cy;
		}
		// just a coordinate
		else if (this.position) {
			x = this.position.x;
			y = this.position.y;
		}
		// targeting a specific element
		else if (this.component || this.element) {
			const target = this.component ? this.component.$[0] : this.element;
			const bounds = target.getBoundingClientRect();
			x = 0 | ((bounds.left + bounds.right) / 2);
			y = 0 | ((bounds.bottom + bounds.top) / 2);
		}

		// stay on screen
		x = Math.max(x, PREVENT_MESSAGE_MARGIN);
		y = Math.max(y, PREVENT_MESSAGE_MARGIN);

		// keep it in view
		const width = this.$.width();
		const height = this.$.height();
		y = Math.min(y, window.innerHeight - height - PREVENT_MESSAGE_MARGIN);
		x = Math.min(x, window.innerWidth - width - PREVENT_MESSAGE_MARGIN);

		// get aligned
		this.$.css({ left: `${x}px`, top: `${y}px` });
	}

	// handle activating a project
	onActivateProject = () => {
		if ($state.lesson)
			$state.lesson.instance.onDeny = this.onDeny;
	}

	// handles displaying the view
	onPreventAction = (location, message, explain) => {
		delete this.selector;
		delete this.position;
		delete this.component;
		delete this.element;

		// determine what the location is
		if (_.isString(location))
			this.selector = evaluateSelector(location);

		// this is some coordinates
		else if (location && _.isNumber(location.x) && _.isNumber(location.y))
			this.position = location;

		// is another component
		else if (location instanceof Component)
			this.component = location;

		// maybe a DOM element
		else if (_.isObject(location) && location.getBoundingClientRect)
			this.element = location;

		// using the mouse
		else this.position = _.assign({ }, $mouse);
		
		// update the message
		this.ui.message.text(message);
		this.ui.explain.text(explain || this.defaultExplainMessage);

		// set some class info, as required
		this.removeClass('hide show');

		// trigger the show and hide
		clearTimeout(this.__hide);
		setTimeout(() => this.addClass('show'), 0);
		this.__hide = setTimeout(this.onHide, PREVENT_MESSAGE_HIDE_DELAY);
		this.__autoHide = +(new Date) + PREVENT_MESSAGE_QUICK_HIDE_DELAY;

		// set this as active
		this.matchPosition();
	}

	// displays the deny message via alt channels
	onDeny = (options = { }) => {
		const { message = "Action Not Available", explain } = options;
		this.onPreventAction(null, message, explain);
		this.__activated = true;
	}

	// hides the view
	onHide = () => {
		this.addClass('hide');
		clearTimeout(this.__hide);

		// remove tracking for hide events
		delete this.__autoHide;
		delete this.__hide;
	}

}
