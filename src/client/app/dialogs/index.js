
import Component from '../component';

const DEFAULT_ANIMATION_TIME = 300;

/** @typedef {Object} DialogOptions
 * @prop {function} onCancel called when cancel is pressed
 * @prop {function} onActivate called when a dialog is activated
 */

export default class Dialog extends Component {

	constructor(...args) {
		super(...args);

		// creates the dialog window
		this.dialog = new Component({
			template: 'dialog',
			ui: { content: '.dialog' }
		});
		
		// attach the component to the dialog
		this.dialog.ui.content.append(this.$);
		this.dialog.appendTo(document.body);

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
	async show() {
		this.busy = true;
		this.dialog.css({ opacity: 0 });
		
		// use the UI element hide (don't use the overriden hide function)
		this.dialog.$.show();
		
		// check for an activation function
		if (this.onActivate)
			await this.onActivate();

		// fade out
		await this.dialog.animate({ opacity: 1 }, { duration: DEFAULT_ANIMATION_TIME });
		this.busy = false;

	}

	/** handles hiding the dialog box */
	async hide(instant) {
		this.busy = true;
		
		// check for canceling
		if (this.onDeactivate)
			await this.onDeactivate();
		
		// perform the fadeout
		if (!instant)
			await this.dialog.animate({ opacity: 0 }, { duration: DEFAULT_ANIMATION_TIME });

		// use the UI element hide (don't recursively call hide)
		this.dialog.$.hide();
	}

	dispose() {
		this.remove();
	}

}