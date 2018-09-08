import _ from 'lodash';

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
				// lesson.lesson is the app object then the lesson instance
				const success = state.lesson.instance.invoke(validator, ...args);
				if (success === true)
					return true;
			}
			// nothing to do
			catch (err) { }
		}

		// next, check if any of the required flags are set
		const id = _.kebabCase(permission).toLowerCase();
		if (state.flags[id] === true)
			return true;
	}

	// did not find the required flag
	return false;
}
