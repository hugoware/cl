import { _, Showdown } from '../../lib';
import Component from '../../component';
import { evaluateSelector } from '../../utils/selector';
import generateMessage from '../../message-generator/index';
const $convert = new Showdown.Converter();

const MISSING_BOUNDS = { left: 0, top: 0, right: 0 };

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
		this.listen('refresh-hint', this.onRefreshHint);
		this.listen('show-hint', this.onShowHint);
		this.listen('clear-hint', this.onClearHint);
		this.listen('enable-hints', this.onEnableHints);
		this.listen('disable-hints', this.onDisableHints);

		// always looking for the focus area
		this.hint = evaluateSelector('.ace_editor .focus_point');
		
		// handle refreshable events
		window.addEventListener('resize', this.onAutoRefresh);
		window.addEventListener('keydown', this.onAutoRefresh);
		window.addEventListener('keyup', this.onAutoRefresh);
		window.addEventListener('keypress', this.onAutoRefresh);
		window.addEventListener('input', this.onAutoRefresh);

		// hidden by default
		this.onClearHint();
	}

	// is the hint visible
	get isHidden() {
		return !this.hasClass('show');
	}

	onDisableHints = () => {
		this.addClass('disabled');
	}

	onEnableHints = () => {
		this.removeClass('disabled');
	}

	// when resetting the document
	onReset = () => {
		this.onClearHint();
	}

	// leaving the project view
	onDeactivateProject = () => {
		this.onClearHint();
	}

	// updates the marker position
	onAutoRefresh = () => {
		this.onRefreshHint();
	}
	
	// updates the marker position
	onRefreshHint = () => {
		this.refreshPosition();
	}

	// handles showing the hint
	onShowHint = options => {
		if (this.hint.isMissing)
			this.hint.refresh();
		
		// something is wrong?
		if (this.hint.isMissing)
			return;

		// make visible
		if (this.isHidden)
			this.addClass('show');

		// add the highlight, if needed
		this.isHighlighted = !(options.isInfo || options.info);

		// update the position
		this.refreshPosition();

		// check the message
		const hash = _.trim(options.message);
		if (hash === this._hash)
			return;

		// update the message
		this._hash = hash;
		const message = generateMessage(options.message);
		this.ui.message.html(message.content);
	}

	// handles hiding the hint from view
	onClearHint = () => {
		this.removeClass('show');

		// nothing to do
		if (this.hint.isMissing)
			return;

		// remove the highlight
		const instance = this.hint.getInstance();
		instance.removeClass('highlighted');
	}

	// match the cursor position for now
	refreshPosition = () => {
		if (this.isHidden)
			return;
		
		// can't refresh yet
		if (this.hint.isMissing)
			return;
	
		// ensure the bounds to use
		this.hint.refresh();
		const bounds = this.hint.getBounds();
		
		// not sure?
		if (!bounds) {
			debugger;
			return;
		}

		const { left } = bounds;
		const right = isNaN(bounds.right) ? left : bounds.right;
		const mid = (left + right) / 2;
		const top = bounds.top;
		const loc = { top, left: mid };

		// for the focus point, save the position
		// this is used when the focus point is removed
		// but still needs an origin point
		this.prior = location;

		// make sure the focus stays highlighted
		if (this.isHighlighted)
			this.hint.getInstance()
				.addClass('highlighted');

		this.offset({
			top: loc.top + 10,
			left: loc.left
		});
	}

}