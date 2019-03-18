/// <reference path="../../types/index.js" />
import { _, $ } from '../../lib';

export default class Highlight {

	constructor(selector, options = { }) {
		this.selector = selector;
		this.options = options;
	}

	/** handles displaying a marker */
	show = () => {
		const element = document.createElement('div');
		this.highlight = $(element);
		this.highlight.addClass('focus-highlight');

		// add to the view
		this.highlight.appendTo(document.body);

		// update the position
		this.update(true);
	}

	/** handles updating a marker position
	 * @param {boolean} skipRefresh uses the existing position for the layer
	 */
	update = skipRefresh => {
		if (this.disposed)
			return;

		// check if needing to refresh or not
		if (!skipRefresh)
			this.selector.refresh();

		const { selector, options } = this;
		const bounds = selector.getBounds();
		if (!bounds) return;

		// update the position
		if (!options.adjustmentCalculated) {
			options.adjustmentCalculated = true;
			options.offsetX = _.find([options.left, options.x, options.offsetX], _.isNumber);
			options.offsetY = _.find([options.top, options.y, options.offsetY], _.isNumber);
			options.expandX = _.find([options.expandX, options.growX], _.isNumber);
			options.expandY = _.find([options.expandY, options.growY], _.isNumber);
			if (!_.isNumber(options.expandX)) options.expandX = 0;
			if (!_.isNumber(options.expandY)) options.expandY = 0;
			if (!_.isNumber(options.offsetX)) options.offsetX = 0;
			if (!_.isNumber(options.offsetY)) options.offsetY = 0;
		}
		
		// finalize positions
		let { left, top, width, height } = bounds;
		width += options.expandX;
		height += options.expandY;
		left += options.offsetX;
		top += options.offsetY;

		// calculate the result
		this.highlight.offset({ left, top });
		this.highlight.height(height);
		this.highlight.width(width);
	}

	/** handles removing a marker entirely */
	remove = () => {
		this.highlight.remove();
		delete this.selector;
		delete this.highlight;
		this.disposed = true;
	}

}