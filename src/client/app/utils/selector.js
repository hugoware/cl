/// <reference path="../types/index.js" />

import { $, _ } from '../lib';
import $uiSelectors from '../ui-selectors';

/** evaluates an array of selectors or a single strinc
 * @param {string|string[]} selectors the selectors to process
 * @returns {SelectorReference[]}
 */
export function evaluateAllSelectors(selectors, action) {
	selectors = getSelectorArray(selectors);
	selectors = _(selectors).compact().map(evaluateSelector).value();
	_.each(selectors, action);
	return selectors;
}

/** evaluates a single selector and creates a reference to the element
 * @param {any} selector the lesson selector information
 * @returns {SelectorReference}
 */
export function evaluateSelector(selector) {

	// clean up
	selector = _.trim(selector).replace(/\$/g, '#');

	// tracking additional commands that might
	// be used for actions
	const commands = {};

	// remove all special rules that I added
	selector = selector.replace(/:{2}[^\(]+\([^\)]*\)( |$)*/g, match => {
		match = match.substr(2);

		// check for arguments
		let command;
		const parts = match.substr(0, match.length - 1).replace(/^[^\(]+\(/, cmd => {
			command = cmd.substr(0, cmd.length - 1);
			return '';
		});

		// extract all arguments
		const args = _.trim(parts).split(/ ?, ?/g);

		// determine what to do with this result
		const result = applyCustomCommand(command, args);
		if (_.isString(result))
			return result;

		// else, assume this is an actual command
		commands[result.command] = result.args;
		return '';
	});

	// clean up
	selector = _.trim(selector);
	const hasSelector = _.some(selector);
	const hasCommands = _.some(commands);

	// create the selector instance
	const instance = {
		selector,
		commands,
		hasSelector,
		hasCommands,

		// gives back the element
		getInstance() {
			return $(selector)
		},

		// update the position of the selected element
		refresh: () => {

			// find the element, if needed
			if (hasSelector) {
				instance.element = $(selector);
				instance.isMissing = !instance.element[0];
			}
			else {
				instance.isMissing = true;
			}
		},

		// get the updated bounds
		getBounds() {
			if (instance.isMissing) return;

			// get the bounding info
			const bounds = instance.element[0].getBoundingClientRect();
			const { left, right, top, bottom } = bounds;
			const width = right - left;
			const height = bottom - top;

			// updates the bounds
			instance.bounds = _.assign({ left, right, top, bottom, width, height }, {
				cx: (right + left) / 2,
				cy: (bottom + top) / 2,
			});

			// return the data
			return instance.bounds;
		}
	};

	// prepare for use
	instance.refresh();
	return instance;
}

// makes sure the argument is an array
function getSelectorArray(arg) {
	arg = _.isString(arg) ? [arg] : arg;
	arg = _.isArray(arg) ? arg : [arg];
	return _.compact(arg);
}

// special commands
function applyCustomCommand(command, args) {

	// file openn
	switch(command) {

		// matches for a specific tab to be open
		case 'fileOpen':
			return `.tab-bar .tab[file="${args[0]}"]`;

		// selects a specific item in the file browser
		case 'fileBrowser':
			return `#file-browser [file="${args[0]}"]`;

		// action to select common UI elements
		case 'ui': {
			const selector = $uiSelectors[args[0]];
			if (!selector)
				throw `invalid ui selector: ${args[0]}`;
			return selector;
		}

		// nothing special, use as is
		default:
			return { command, args };
	}
}
