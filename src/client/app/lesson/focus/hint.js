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
		this.listen('hide-hint', this.onHideHint);

		// always looking for the cursor
		// this.cursor = evaluateSelector('.ace_editor .ace_cursor');
		// this.hint = ;
		
		// handle refreshable events
		window.addEventListener('resize', this.onAutoRefresh);
		window.addEventListener('keydown', this.onAutoRefresh);
		window.addEventListener('keyup', this.onAutoRefresh);
		window.addEventListener('keypress', this.onAutoRefresh);
		window.addEventListener('input', this.onAutoRefresh);

		// hidden by default
		this.onHideHint();
	}

	// is the hint visible
	get isHidden() {
		return !this.hasClass('show');
	}

	get hint() {

		if (!this._hint)
			this._hint = evaluateSelector('.ace_editor .focus_point');

		// if (!this.hint || this.hint.isMissing)
		return this._hint;
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
		this.onRefreshHint();
	}
	
	// updates the marker position
	onRefreshHint = () => {
		if (this.isVisible)
			this.refreshPosition();
		// // don't do anything if already hiding
		// if (this.isHidingHint) return;
		// setTimeout(this.refreshPosition);
	}

	// handles showing the hint
	onShowHint = options => {
		if (this.hint.isMissing)
			this.hint.refresh();
		
		// something is wrong?
		if (this.hint.isMissing)
			return;

		// make visible
		if (!this.is('.show'))
			this.addClass('show');

		// update the position
		this.refreshPosition();

		// check the message
		const hash = _.snakeCase(options.message);
		if (hash === this._hash)
			return;

		// update the message
		this._hash = hash;
		const message = generateMessage(options.message);
		this.ui.message.html(message.content);
		
		// // // hint is not required
		// // if (options === null) 
		// // 	return;
		// // 	// return this.onHideHint();
	
		// // // there's a range to use
		// // const hasFocus = 'index' in options || 'start' in options || 'end' in options || 'zone' in options;
		// // if (hasFocus) {
		// // 	this.broadcast('set-editor-focus-point', options);
		// // 	this.selector = this.position;
		// // 	this.isFocusPoint = true;
		// // 	this.refreshPosition();
		// // }
		// // // choose the location
		// // else {

		// // 	// clears the current focus, if any
		// // 	if (this.isFocusPoint) {
		// // 		this.broadcast('hide-editor-focus-point');
		// // 	}

		// // 	this.selector = this.cursor;
		// // 	this.isFocusPoint = false;
		// // }

		// // // try and refresh
		// // if (this.selector.isMissing) {

		// // 	// try to find the selector again
		// // 	this.selector.refresh();

		// // 	// if it's still missing, don't show anything
		// // 	if (this.selector.isMissing) {
		// // 		this.onHideHint();
		// // 		return;
		// // 	}
		// // 	// shift to the correct location
		// // 	else this.refreshPosition();
		// // }

		// // // if it's hidden, then display
		// // if (this.isHidingHint)
		// // 	setTimeout(() => {
		// // 		this.refreshPosition();
		// // 		this.addClass('show');
		// // 	}, 50);
		
		// // // make sure to activate the hint even if
		// // // the message itself didn't change
		// // this.isHidingHint = false;

		// // // already the same message
		// // if (options.message === this._activeMessage) return;
		// // this._activeMessage = options.message;

		// // // update the message
		// // const html = $convert.makeHtml(options.message);
		// // this.ui.message.html(html);
	}

	// handles hiding the hint from view
	onHideHint = () => {
		console.log('wants to hide');
		return;
		
		if (this.isHidingHint) return;
		this.isHidingHint = true;
		this.removeClass('show');

		// HACK: just select and remove the class
		if (this.isFocusPoint) {
			setTimeout(() => {
				const element = this.position.get();
				element.removeClass('highlighted');
			}, 50);
		}
	}

	// match the cursor position for now
	refreshPosition = () => {
		this.hint.refresh();

		// ensure the bounds to use
		let bounds = this.hint.getBounds();
		// if (!bounds && this.isFocusPoint)
		// 	bounds = this.focusPoint;
		// if (!bounds)
		// 	bounds = MISSING_BOUNDS;

		// calculate the position
		const { left } = bounds;
		const right = isNaN(bounds.right) ? left : bounds.right;
		const mid = (left + right) / 2;
		const top = bounds.top;
		const loc = { top, left: mid };

		// for the focus point, save the position
		// this is used when the focus point is removed
		// but still needs an origin point
		// if (this.isFocusPoint)
		this.focusPoint = location;

		this.offset({
			top: loc.top + 10,
			left: loc.left
		});
	}

}