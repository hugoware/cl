
import { $ } from '../../lib';

export default class Marker {

	constructor(selector, options = { }) {
		this.selector = selector;
		this.options = options;
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

		const { selector, options } = this;
		const bounds = selector.getBounds();
		if (!bounds) return;

		// get adjustments
		const width = bounds.right - bounds.left;
		const height = bounds.bottom - bounds.top;
		let x = options.x || 0;
		let y = options.y || 0;
		if (options.tr || options.br || options.r) x = 1;
		if (options.bl || options.br || options.b) y = 1;
		if (options.center) x = y = 0.5;
		if (options.r || options.l) y = 0.5;
		if (options.b || options.t) x = 0.5;

		// calculate positions
		const left = (bounds.left + (width * x)) + (options.offsetX || 0);
		const top = (bounds.top + (height * y)) + (options.offsetY || 0);
		
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