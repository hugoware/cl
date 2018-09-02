/// <reference path="../../types/index.js" />

import _ from 'lodash';
import $state from '../../state';
import { evaluateAllSelectors } from '../../utils/selector';
import { broadcast } from '../../events';

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

/** handles waiting events for a slide 
 * @param {WaitInstruction} events the events that should be waited for
*/
export function waitFor(events) {
	const { lesson } = $state.lesson;
	const { slide } = lesson;

	// check each selector value
	evaluateAllSelectors(events, selector => {
		const { hasCommands, commands } = selector;
		console.log('waiting for', selector);

		// determine what to do
		if ('validate' in commands) {
			const validation = new WaitForValidation(selector, lesson, slide);
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
			const event = new WaitForEvent(selector, handleSuccess);
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
function handleSuccess() {
	clear();
	broadcast('next-slide');
}


// evaluate each polled event
function processQueue() {
	let success;
	for (const item of $poll)
		success = success !== false ? item.validate() : success;

	// make sure this worked
	if (success === true)
		handleSuccess();
}

// share functions
export default {
	clear,
	waitFor
};