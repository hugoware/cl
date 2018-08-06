
import _ from 'lodash';
import Component from '../component';
import { cancelEvent } from '../utils/index';

const DEFAULT_ANIMATION_TIME = 300;

/** @typedef {Object} DialogOptions
 * @prop {function} onCancel called when cancel is pressed
 * @prop {function} onActivate called when a dialog is activated
 */

export default class Dialog extends Component {

	constructor(options, ...args) {
		super(options, ...args);

		// creates the dialog window
		this.dialog = new Component({
			template: 'dialog',
			ui: {
				content: '.dialog'
			}
		});

		// attach the component to the dialog
		this.dialog.ui.content.append(this.$);
		this.dialog.appendTo(document.body);

		// check for custom params
		if (this.is('[dialog-width]'))
			this.dialog.ui.content.css({ maxWidth: `${this.attr('dialog-width')}px` });

		// check if auto-closing
		this.shouldAutoClose = (options || { }).autoClose !== false;

		// check for common items
		this.on('click', '.actions .confirm', this.handleConfirm);
		this.on('click', '.actions .cancel', this.handleCancel);
		this.listen('on-press-escape', this.handleCancel);

		// allow pressing outside of the area to cancel
		this.on('click', cancelEvent);
		this.dialog.on('click', this.handleCancel);

		// hidden by default
		this.dialog.$.hide();
		this.busy = true;
	}

	/** @type {DialogOptions} */
	get options() {
		if (!this._options) this.options = { };
		return this._options;
	}

	set options(options) {
		this._options = options;
	}

	/** handles showing and activating the dialog box */
	async show(options) {
		this.options = options;
		this.busy = true;
		this.dialog.css({ opacity: 0 });
		this.addClass('showing');
		
		// use the UI element hide (don't use the overriden hide function)
		this.dialog.$.show();
		
		// check for an activation function
		if (this.onActivate)
			await this.onActivate(options);

		// fade out
		await this.dialog.animate({ opacity: 1 }, { duration: DEFAULT_ANIMATION_TIME });
		this.removeClass('showing');
		this.busy = false;

	}

	/** handles hiding the dialog box */
	async hide(instant) {
		this.addClass('hiding');
		this.busy = true;
		
		// check for canceling
		if (this.onDeactivate)
			await this.onDeactivate();
		
		// perform the fadeout
		if (!instant)
			await this.dialog.animate({ opacity: 0 }, { duration: DEFAULT_ANIMATION_TIME });

		// use the UI element hide (don't recursively call hide)
		this.removeClass('hiding');
		this.dialog.$.hide();
	}

	// handles when a cancel button is pressed
	handleCancel = () => {
		if (this.busy) return;
		
		// check for a cancel function
		if (_.isFunction(this.onCancel))
			this.onCancel();

		// if autoclosing the dialog (no events)
		if (this.shouldAutoClose)
			this.hide();
	}

	// handles when a confirm button is pressed
	handleConfirm = () => {
		if (this.busy) return;

		if (_.isFunction(this.onConfirm))
			this.onConfirm();
	}

}