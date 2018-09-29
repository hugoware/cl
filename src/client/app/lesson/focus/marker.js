
import $ from 'jquery';

export default class Marker {

	constructor(selector) {
		this.selector = selector;
	}

	/** handles displaying a marker */
	show = () => {
		const element = document.createElement('div');
		const inner = document.createElement('div');
		this.marker = $(element);
		this.marker.addClass('focus-marker');
		this.marker.append(inner);

		// add to the view
		this.marker.appendTo(document.body);

		// update the position
		this.update(true);
	}

	/** handles updating a marker position
	 * @param {boolean} skipRefresh uses the existing position for the layer
	 */
	update = skipRefresh => {
		if (this.disposed)
			return;
			
		if (!skipRefresh)
			this.selector.refresh();

		// if missing, nothing to do here
		if (this.selector.isMissing)
			return this.remove();

		const { selector } = this;
		const { center } = selector.commands;
		const bounds = selector.getBounds();
		if (!bounds) return;

		// calculate positions
		let left = center ? bounds.cx : bounds.left;
		left += center ? parseInt(center[0] || 0) : 0;

		let top = center ? bounds.cy : bounds.top;
		top += center ? parseInt(center[1] || 0) : 0;

		// update the position
		this.marker.offset({ left, top });
	}

	/** handles removing a marker entirely */
	remove = () => {
		this.marker.remove();
		delete this.selector;
		delete this.marker;
		this.disposed = true;
	}

}