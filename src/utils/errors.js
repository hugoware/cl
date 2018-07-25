import _ from 'lodash';

/** Handles finding a string result for an exception
 * @param {string|Error} error The error to resolve 
 */
export function resolveError(error) {
	if (_.isError(error)) return error.message;
	if (_.isString(error)) return error;
	
	// display the missing error
	error = (error || 'null').toString();
	console.log(`[unexpected error] ${error}`);
	return 'unknown_error';
}

/** handles and resolves errors 
 * @param {string|Error} err The error to resolve
 * @param {Object<string, function>} handlers actions to resolve errors with
*/
export function handleError(error, handlers) {
	
	// determine how to handle this error
	const key = resolveError(error);
	const action = handlers[key]
		|| handlers['unknown_error']
		|| handlers['unknown-error']
		|| handlers['unknown']
		|| handlers['default'];

	// check for the action to run, if any
	if (_.isFunction(action)) action(error);
	else console.log(`[unhandled error] ${error}`);
}

/** Identifies an error message from an error object
 * @param {string|Error} err The error to resolve
 * @param {Object<string, string>} messages error messages to resolve using
 */
export function errorMessage(err, messages) {
	const key = resolveError(err);
	return messages[key]
		|| messages['unknown_error']
		|| messages['unknown-error']
		|| messages['unknown']
		|| messages['default'];
}

/** maps an object into an error object
 * @param {Object<string,object|string>} map a collection of errors or maps of errors
 * @returns {Object} map of errors
 */
export function mapErrors(map) {
	const errors = { };

	// map each error
	_.each(map, (err, key) => {
		errors[key] = key;
		
		// strings are the only error
		if (_.isString(err))
			errors[`${key}_${err}`] = true;

		// assign each remaining value as
		// it's own error key
		else _.map(err, msg => {
			errors[`${key}_${msg}`] = true;
		})

	});

	return errors;
}

/** resolves a complete error object for server requests
 * @param {Object<string,object|string>} map a collection of errors or maps of errors
 * @returns {Object} map of errors and a 'failure' flag
 */
export function createError(mapOrKey, error) {
	let map;

	// single key with error
	if (_.isString(error))
		map = { [mapOrKey]: error };
	
	// single argument error 
	else if (_.isString(mapOrKey))
		map = { [mapOrKey]: 'error' };

	// just a standard error object
	else map = mapOrKey;

	// finish the mapping
	return {
		success: false,
		errors: mapErrors(map)
	}
}