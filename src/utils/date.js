import _ from 'lodash';
import $moment from 'moment';

/** gets the current time 
 * @returns {string} the complete time string
*/
export function now() {
	return $moment().format();
}

/** returns a time stamp away from 
 * @param {number} amount the amount to adjust by the unit
 * @param {string} unit the unit to adjust by
 * @returns {string} the complete time string
*/
export function fromNow(amount, unit) {
	return $moment().add(amount, unit).format();
}

/** adjusts a time unit from the starting timestamp 
 * @param {string} timestamp the timestamp to adjust from
 * @param {number} amount the amount to adjust by the unit
 * @param {string} unit the unit to adjust by
 * @returns {string} the complete time string
*/
export function fromTime(timestamp, amount, unit) {
	return $moment(timestamp).add(amount, unit).format();
}

/** displays the time ago string for a timestamp 
 * @param {string} timestamp the timestamp to adjust from
 * @param {number} [amount] the amount to adjust by the unit
 * @param {string} [unit] the unit to adjust by
 * @returns {string} the time ago string
*/
export function timeAgo(timestamp, amount, unit) {
	const time = $moment(timestamp);
	if (_.isNumber(amount) && _.isString(unit)) time.add(amount, unit);
	return time.fromNow()
}

/** sorts dates in ascending order - allows for an optional property
 * @param {any[]} collection the collection of items to sort
 * @param {string} [prop] if using objects, the date property to sort using
 */
export function sort(collection, prop) {
	return _(collection)
		.map(item => ({ 
			item,
			ts: timestamp(item, prop)
		}))
		.orderBy('ts')
		.map('item')
		.reverse()
		.value();
}

// creates a numeric timestamp
function timestamp(val, prop) {
	return $moment(prop ? val[prop] : val).toDate().getTime();
}

export default {
	now,
	fromNow,
	fromTime,
	sort,
	timeAgo
};