/// <reference path="../../types/index.js" />
import { $ } from '../../lib';

export default class Highlight {

	constructor(selector) {
		this.selector = selector;
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

		const { selector } = this;
		const bounds = selector.getBounds();
		if (!bounds) return;

		// update the position
		const { left, top, width, height } = bounds;
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