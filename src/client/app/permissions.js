import _ from 'lodash';

// map of possible permission flags
const PERMISSIONS = [
	'create_file',
	'create_folder',
	'delete_file',
	'delete_folder',
	'upload_file',
	'rename_project',
	'close_file',
	'open_file',
	'save_file',
];

/** handles binding permissions to the state object */
export default function setupPermissionMap(state) {
	state.permissions = { };
	
	// create an object to test user permissions
	_.each(PERMISSIONS, set => {
	
		// the first property is the name
		const requires = set.split(/ /g);
		const key = _.snakeCase(requires[0]).toUpperCase();

		// convert to expected case
		_.each(requires, (prop, index) => {
			requires[index] = _.kebabCase(prop).toLowerCase();
		});

		// check for permissions
		Object.defineProperty(state.permissions, key, {
			get: () => {
				console.log('is checking', key, requires, state.flags);

				// if not running a lesson, there's no
				// permissions to work with
				if (!state.lesson)
					return true;
				
				// all permissions allowed
				if(state.flags['sandbox-mode'])
					return true;
				
				// has any value
				for (const match of requires)
					if (state.flags[match]) return true;

				// did not find the required flag
				return false;
			}
	
		});

	});

}
