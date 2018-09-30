/// <reference path="../../types/index.js" />

import _ from 'lodash';
import $state from '../../state';
import { evaluateAllSelectors } from '../../utils/selector';
import { listen, broadcast } from '../../events';

// wait events
import WaitForValidation from './validate';
import WaitForExists from './exists';
import WaitForEvent from './event';

// the frequency to check for polling changes
const POLL_INTERVAL = 300;

// tracking wait handlers
const $poll = [ ];
const $events = [ ];

// tracks the active interval, if any
let $waiting;
let $success;

// dispose of events
listen('reset', clear);
listen('deactivate-project', clear);

/** handles waiting events for a slide 
 * @param {WaitInstruction} events the events that should be waited for
*/
export function waitFor(events) {
	const { instance } = $state.lesson;
	const { slide } = instance;

	// always clear success
	$success = false;

	// check each selector value
	evaluateAllSelectors(events, selector => {
		const { hasCommands, commands } = selector;

		// determine what to do
		if ('validate' in commands) {
			const validation = new WaitForValidation(selector, slide);
			$poll.push(validation);
		}
		// there's no commands, so this is waiting for
		// something to "exist"
		else if (!hasCommands) {
			const exists = new WaitForExists(selector);
			$poll.push(exists);
		}
		// for now, this is probably a UI event of some sort
		else if ('event' in commands || 'click' in commands || 'hover' in commands) {
			const event = new WaitForEvent(selector, handleResult);
			$events.push(event);
		}
	});

	// setup the interval, if needed
	if (!$waiting && _.some($poll))
		$waiting = setInterval(processQueue, POLL_INTERVAL);
}


/** clears all wait conditions */
export function clear() {
	clearInterval($waiting);
	$waiting = null;

	// remove all polling events
	for (let i = $poll.length; i-- > 0;) {
		$poll[i].dispose();
		$poll.splice(i, 1);
	}

	// remove all listener events
	for (let i = $events.length; i-- > 0;) {
		$events[i].dispose();
		$events.splice(i, 1);
	}

}

// handle a successful attempt to move to the next slide
function handleResult(success) {
	if (success === $success) return;
	$success = success;
	broadcast('slide-wait-for-result', success);
}

// evaluate each polled event
function processQueue() {
	let success;
	for (const item of $poll)
	success = success !== false ? item.validate() : success;
	
	// make sure this worked
	handleResult(success);
}

// share functions
export default {
	clear,
	waitFor
};