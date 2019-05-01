
import { $e, $cx, cancelEvent } from './utils';

// ui
export default class Dropdown {

	constructor(options) {
		this.options = options;

		this.target = $e(options.target);
		this.placeholder = this.target.childNodes[0];
		this._placeholder = this.placeholder.innerText;
		this.items = this.target.childNodes[1];

		this.placeholder.addEventListener('click', this.onOpen);
		this.items.addEventListener('click', this.onSelect);

	}

	onOpen = event => {
		if (this.options.onOpen)
			this.options.onOpen();

		this.target.className = $cx('dropdown open');
		return cancelEvent(event);
	}

	onSelect = event => {
		const item = getItem(event.target);
		if (!item) return;

		// check if allowed
		if (/full/.test(item.className))
			return cancelEvent(event);

		// update choice
		this.selection = item.getAttribute('data-value');
		this.placeholder.innerText = this.text = item.getAttribute('data-label');

		// events
		if (this.options.onSelect)
			this.options.onSelect(this.selection, this);
	}

	reset() {
		this.items.scrollTop = 0;
		this.selection = undefined;
		this.placeholder.innerText = this._placeholder;
	}

	close() {
		this.target.className = 'dropdown';
	}

}


function getItem(el) {
	if (!el) return;
	if (el && /(^| )item($| )/.test(el.className)) return el;
	return getItem(el.parentNode);
}
