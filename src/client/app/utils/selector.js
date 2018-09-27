/// <reference path="../types/index.js" />

import $ from 'jquery';
import _ from 'lodash';

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

	// check for special commands so we can minimize selectors
	selector = selector.replace(/[a-zA-Z]+\([^\)]*\)( |$)+/g, executeFunctionSelector);

	// remove all special rules that I added
	selector = selector.replace(/\:{2}[^ $]+/g, match => {
		match = match.substr(2);

		// check for arguments
		const parts = match.split(/\(|\)/g);
		const command = parts[0];
		const args = _.trim(parts[1]).split(/,/g);
		commands[command] = args;

		// remove it
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
function executeFunctionSelector(str) {
	const { command, args } = parseFunctionSelector(str);

	// file openn
	switch(command) {
		case 'fileOpen':
			return `.tab-bar .tab[file="${args[0]}"]`;

		case 'fileBrowser':
			return `#file-browser [file="${args[0]}"]`;

		default:
			throw 'unknown command';
	}
}


// special commands
function parseFunctionSelector(str) {
	const parts = str.split('(');
	const command = parts[0];

	// get the arguments
	let args = parts.slice(1).join('(');
	args = args.substr(0, args.length - 1);
	args = _.map(args.split(','), _.trim);

	// check the final
	return { command, args };
}

