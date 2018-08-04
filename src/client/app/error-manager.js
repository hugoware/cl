/// <reference path="./types/index.js" />
import _ from 'lodash';
import { broadcast } from './events';

/** all current errors
 * @type {Object<string, ProjectError>} */
const $errors = { };

// notifies if any changes to the error state
function update(addedError) {
	const state = { 
		hasErrors: _.some($errors)
	};

	// without errors, it can stop now
	if (!state.hasErrors)
		return broadcast('project-errors', state);

	// gather up the error info
	if (!!addedError) state.error = addedError;
	state.all = $errors;
	broadcast('project-errors', state);
}

/** includes another error message for the error manager
 * @param {string} id the id of the error message
 * @param {object} err the information about the error
 * @param {boolean} [silent] do not broadcast the change
 */
export function add(id, err, silent) {
	$errors[id] = err;
	if (!silent) update(err);
}

/** removes a single error message 
 * @param {string} id the id of the error message to remove
 * @param {boolean} [silent] do not broadcast the change
*/
export function remove(id, silent) {
	delete $errors[id];
	if (!silent) update();
}

/** completely clears all pending error messages 
 * @param {boolean} [silent] do not broadcast the change
*/
export function clear(silent) {
	for (const key in $errors)
		delete $errors[key];
	if (!silent) update();
}

// common functions
export default {
	add,
	remove,
	clear,

	// a map of all errors
	errors: $errors
}