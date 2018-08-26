import Component from '../component'

const DEFAULT_ANIMATION_TIME = 500;

export default class View extends Component {

	constructor(...args) {
		super(...args);
		// this.css({ opacity: 0 });

		// don't use the animated hide
		this.$.hide();
	}

	/** handles showing and activating a view */
	async show() {
		return new Promise(async resolve => {

			// already visible or showing
			if (this.hasClass('show'))
				return resolve();

			// disable the view
			this.busy = true;
			
			// use the UI element hide (don't use the overriden hide function)
			setTimeout(() => this.addClass('show'));
			this.$.show();

			// check for an activation function
			if (this.onActivate)
				await this.onActivate();

			// wait a moment
			setTimeout(() => {
				this.busy = false;
				resolve();
			}, DEFAULT_ANIMATION_TIME);

		});

	}

	/** handles hiding and deactivating a view */
	async hide() {
		return new Promise(async resolve => {
			
			// already hidden or hiding
			if (!this.hasClass('show'))
				return resolve();

			// disable the view
			this.busy = true;
			this.removeClass('show');
			
			// check for canceling
			if (this.onDeactivate)
				await this.onDeactivate();

			// wait a moment
			setTimeout(() => {
				// use the UI element hide (don't recursively call hide)
				this.$.hide();
				resolve();
			}, DEFAULT_ANIMATION_TIME);

		});

	}

}