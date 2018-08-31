import _ from 'lodash';
import $ from 'jquery';
import { evaluateSelector } from '../../../utils/selector';


/** sets a highlighting zone 
 * @param {string[]|string} selectors the selector to process
 */
export function setHighlight(selectors) {
	selectors = getSelectorArray(selectors);
	_.each(selectors, selector => {
		selector = evaluateSelector(selector);
		console.log('highlight', selector);
	})
}

/** sets a marker at a specified target
 * @param {string[]|string} selectors the selector to process
 */
export function setMarker(selectors) {
	selectors = getSelectorArray(selectors);
	_.each(selectors, selector => {
		selector = evaluateSelector(selector);
		console.log('marker', selector);
	})

}

// makes sure the argument is an array
function getSelectorArray(arg) {
	arg = _.isString(arg) ? [arg] : arg;
	arg = _.isArray(arg) ? arg : [arg];
	return _.compact(arg);
}

// refreshes all positions
function update() {
	requestAnimationFrame(update);

	// refresh all positions - if any

}

requestAnimationFrame(update);

// refresh the view if the window resizes
// listen('window-resize', update);

export default {
	setMarker,
	setHighlight
}