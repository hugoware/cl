import _ from 'lodash';
import { listen } from '../../events';
import { evaluateAllSelectors } from '../../utils/selector';

// ui display types
import Highlight from './highlight';
import Marker from './marker';

// tracking highlight items
const $items = [ ];

/** sets a highlighting zone 
 * @param {string[]|string} selectors the selector to process
 */
export function setHighlight(selectors) {
	evaluateAllSelectors(selectors, selector => {

		// just in case
		if (selector.isMissing)
			return console.warn('missing highlight selector', selector.selector);

		// save the highlight
		const highlight = new Highlight(selector)
		$items.push(highlight);

		// show the highlight area
		highlight.show();
	});
}

/** sets a marker at a specified target
 * @param {string[]|string} selectors the selector to process
 */
export function setMarker(selectors) {
	evaluateAllSelectors(selectors, selector => {

		// just in case
		if (selector.isMissing)
			return console.warn('missing highlight selector', selector.selector);
		
		// create the marker
		const marker = new Marker(selector)
		$items.push(marker);

		// show the marker
		marker.show();
	});
}

/** clears all markers and highlights */
export function clear() {
	for (let i = $items.length; i-- > 0;) {
		$items[i].remove();
		$items.splice(i, 1);
	}
}

// // makes sure the argument is an array
// function getSelectorArray(arg) {
// 	arg = _.isString(arg) ? [arg] : arg;
// 	arg = _.isArray(arg) ? arg : [arg];
// 	return _.compact(arg);
// }

// refreshes all positions
function update() {
	requestAnimationFrame(update);
	
	// check the frequency
	const now = +new Date;
	if (update.nextUpdate > now) return;
	update.nextUpdate = now + 16;

	// refresh all positions - if any
	for (let i = $items.length; i-- > 0;) {
		const item = $items[i];
		if (item.disposed) $items.splice(i, 1);
		else item.update();
	}

}

// handles refreshing the view
listen('window-resize', update);
requestAnimationFrame(update);

export default {
	setMarker,
	setHighlight,
	clear
};