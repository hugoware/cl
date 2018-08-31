
import $ from 'jquery';
import _ from 'lodash';

// uses a selector to get bounds and position values
export function evaluateSelector(selector) {

	// tracking additional commands that might
	// be used for actions
	const commands = {};

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

	// create the selector instance
	const instance = {
		selector,
		commands,

		// update the position of the selected element
		refresh: () => {
			instance.element = $(selector);
			instance.isMissing = !instance.element[0];

			// nothing to work with
			if (instance.isMissing)
				return;

			// get the updated bounds
			const bounds = instance.element[0].getBoundingClientRect();
			const { left, right, top, bottom } = bounds;
			const width = right - left;
			const height = bottom - top;
			instance.bounds = _.assign({ left, right, top, bottom, width, height }, {
				cx: (right + left) / 2,
				cy: (bottom + top) / 2,
			});
		}
	};

	// prepare for use
	instance.refresh();
	return instance;
}
