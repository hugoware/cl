
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

export default {
	now,
	fromNow,
	fromTime
};