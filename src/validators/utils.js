
/** converts a value to a string without performing any extra formatting
 * @param {string} val the value to stringify
 */
export function stringify(val) {
	return (val || '').toString();
}

/** handles applying an error to an error block
 * @param {string} key the category for the message
 * @param {any} err the message, type, or condition to mark if there was an error or not
 * @param {object?} errors the errors object, used when performing a series of validations
 * @returns {boolean} was there an error or not
 */
export function resolveError(key, err, errors) {
	const isError = !!err;

	// apply the error, if needed
	if (isError && !!errors) {

		// add the has errors as a getter so it's not
		// included when serialized
		if (!errors.hasErrors)
			Object.defineProperty(errors, 'hasErrors', { get: () => true });
			
		// save this error tyoe
		errors[`${key}_${err}`] = errors[key] = true;
	}

	return isError ? `${key}_${err}` : null;
}
