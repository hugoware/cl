
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
		this.listen('reset', this.onReset);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('finish-project', this.onFinishProject);
		this.listen('show-hint', this.onShowHint);
		this.listen('hide-hint', this.onHideHint);

		// always looking for the cursor
		this.selector = evaluateSelector('.ace_editor .ace_cursor');
		
		// handle refreshable events
		window.addEventListener('resize', this.onAutoRefresh);
		window.addEventListener('keydown', this.onAutoRefresh);
		window.addEventListener('keyup', this.onAutoRefresh);
		window.addEventListener('keypress', this.onAutoRefresh);
		window.addEventListener('input', this.onAutoRefresh);

		// hidden by default
		this.onHideHint();
	}

	// when resetting the document
	onReset = () => {
		this.onHideHint();
	}

	// leaving the project view
	onDeactivateProject = () => {
		this.onHideHint();
	}

	// updates the marker position
	onAutoRefresh = () => {

		// don't do anything if already hiding
		if (this.isHidingHint) return;
		this.refreshPosition();
	}

	// handles showing the hint
	onShowHint = (options) => {
		
		// hint is not required
		if (options === null)
			return this.onHideHint();

		// showing for the first time
		if (this.isHidingHint && !this.selector.isMissing)
			setTimeout(() => {
				this.refreshPosition();
				this.addClass('show');
			}, 250);
		
		// make sure to activate the hint even if
		// the message itself didn't change
		this.isHidingHint = !this.selector.isMissing;

		// already the same message
		if (options.message === this._activeMessage)
			return;

		// update the message
		this._activeMessage = options.message;
		const html = $convert.makeHtml(options.message);
		this.ui.message.html(html);
	}

	// handles hiding the hint from view
	onHideHint = () => {
		this.isHidingHint = true;
		this.removeClass('show');
	}

	// match the cursor position for now
	refreshPosition = () => {
		this.selector.refresh();
		const bounds = this.selector.getBounds();
		this.offset({ top: bounds.top, left: bounds.left });
	}

}