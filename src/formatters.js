import _ from 'lodash';

/** returns a simple formatted name string with valid characters 
 * @param {string} str the string to format
*/
export function toName(str) {
	str = _.trim(str).replace(/a-z0-9 \-_/i, '');
	str = removeExtraSpaces(str);
	return _.trim(str);
}

/** formats a string to a simple alias
 * @param {string} str the string to format
 */
export function toAlias(str) {
	str = _.trim(str).replace(/[^a-z0-9]/, '_').toLowerCase();
	return _.snakeCase(str);
}

/** removes excessive spaces from a string 
 * @param {string} str the string to remove spaces from
*/
export function removeExtraSpaces(str) {
	return _.trim(str).replace(/ +/, ' ');
}

/** handles formatting a value with multiple formatters
 * @param {any} val the value to format
 * @param {...function} actions the series of formatters to use
 */
export function format(val, ...actions) {
	for (const action of actions)
		val = action(val);
	return val;
}

// share the formatters
format.removeExtraSpaces = removeExtraSpaces;
format.toName = toName;
format.toAlias = toAlias;
format.trim = _.trim;

export default format;