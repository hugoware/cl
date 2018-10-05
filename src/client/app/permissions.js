import _ from 'lodash';
import * as $helpers from './lesson/helpers';

/** checks for permission flags for the project and lesson */
export default function checkPermissions(state, permissions, args = [ ]) {
	permissions = _.isArray(permissions) ? permissions : [ permissions ];

	// if not running a lesson, there's no
	// permissions to work with
	if (!state.lesson)
		return true;

	// all permissions allowed
	if (state.flags['sandbox-mode'] || state.flags['open-mode'])
		return true;

	// start checking each requested permission
	const validation = state.lesson.slide.validation || { };
	for (const permission of permissions) {

		// check for a local validation function
		const func = _.camelCase(permission);
		const validator = validation[func];
		if (_.isString(validator)) {
			try {

				// execute the command - check for utility functions
				// that perform common actions
				let success;
				if (/^\:{2}/.test(validator)) {

					// extract the arguments
					const extracted = extractValidator(validator);
					const params = [ extracted.args, args ];
					success = $helpers[extracted.command].apply(state.lesson.instance, params)
				}
				else {
					success = state.lesson.instance[validator](...args);
				}

				// check if this worked or not
				if (success === true)
					return true;
			}
			// nothing to do
			catch (err) { }
		}
		// without custom validation, just check flag states
		else {
			const id = _.kebabCase(permission).toLowerCase();
			if (state.flags[id] === true)
				return true;
		}
	}

	// did not find the required flag
	return false;
}


// parses global commands
function extractValidator(str) {
	const openParen = str.indexOf('(');
	const command = str.substr(2, openParen - 2);
	const args = str.substr(0, str.length - 1)
		.substr(openParen + 1)
		.split(/ ?, ?/g);

	// extract the command
	console.log(command, args);
	return { command, args };
}
