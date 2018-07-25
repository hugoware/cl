import Component from '../component'

const DEFAULT_ANIMATION_TIME = 300;

export default class View extends Component {

	constructor(...args) {
		super(...args);
		this.css({ opacity: 0 });

		// don't use the animated hide
		this.$.hide();
	}

	/** handles showing and activating a view */
	async show() {
		this.busy = true;
		this.css({ opacity: 0 });
		
		// use the UI element hide (don't use the overriden hide function)
		this.$.show();

		// fade out
		await this.animate({ opacity: 1 }, { duration: DEFAULT_ANIMATION_TIME });
		this.busy = false;

		// check for an activation function
		if (this.onActivate)
			await this.onActivate();

	}

	/** handles hiding and deactivating a view */
	async hide() {
		this.busy = true;
		
		// check for canceling
		if (this.onDeactivate)
			await this.onDeactivate();
		
		// perform the fadeout
		await this.animate({ opacity: 0 }, { duration: DEFAULT_ANIMATION_TIME });

		// use the UI element hide (don't recursively call hide)
		this.$.hide();
	}

}