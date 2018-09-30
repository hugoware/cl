
import Component from '../../component';
import { evaluateSelector } from '../../utils/selector';
import $showdown from 'showdown';
const $convert = new $showdown.Converter();

export default class HintDisplay extends Component {

	constructor() {
		super({
			template: 'hint-display',
			ui: {
				message: '.message'
			}
		});

		// handle showing and hiding
		this.listen('show-hint', this.onShowHint);
		this.listen('hide-hint', this.onHideHint);
		
		// handle refreshable events
		window.addEventListener('resize', this.onAutoRefresh);
		window.addEventListener('keydown', this.onAutoRefresh);
		window.addEventListener('keyup', this.onAutoRefresh);
		window.addEventListener('keypress', this.onAutoRefresh);
		window.addEventListener('input', this.onAutoRefresh);

		// hidden by default
		this.onHideHint();
	}

	// updates the marker position
	onAutoRefresh = () => {

		const selector = evaluateSelector('.ace_editor .ace_cursor');
		const bounds = selector.getBounds();
		this.offset({ top: bounds.top, left: bounds.left });

	}

	// handles showing the hint
	onShowHint = (options) => {
		
		// hint is not required
		if (options === null)
			return this.onHideHint();

		// showing for the first time
		if (this.isHidingHint)
			setTimeout(() => this.addClass('show'));
		
		// already the same message
		if (options.message === this._activeMessage)
			return;

		// update the message
		this.isHidingHint = false;
		this._activeMessage = options.message;
		const html = $convert.makeHtml(options.message);
		this.ui.message.html(html);
	}

	// handles hiding the hint from view
	onHideHint = () => {
		this.isHidingHint = true;
		this.removeClass('show');
	}

}