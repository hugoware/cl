import _ from 'lodash';
import Component from '../../../component';
import ConsoleMessage from './message';
import { clear } from '../../../error-manager';

export default class Console extends Component {

	constructor(context) {
		super({
			context,
			template: 'console',

			ui: {
				heading: '.heading',
				messages: '.messages'
			}
		});

		this.listen('reset', this.onReset);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('project-errors', this.onProjectErrors);

	}

	// clears all errors
	onDeactivateProject = () => {
		this.reset();
	}

	// clears all errors
	onReset = () => {
		this.reset();
	}

	// checks for incoming errors
	onProjectErrors = result => {
		this.update(result);
	}

	/** handles resetting the error console */
	reset = () => {
		this.ui.messages.empty();
		clear();
	}

	/** @param {ProjectErrorState} result */
	update = result => {

		// toggle if the console is visible or not
		const doc = Component.bind(document.body);
		doc.toggleClass('console-visible', result.hasErrors);

		// handle messages
		if (!result.hasErrors)
			return this.ui.messages.empty();

		// get everything in alphabetical order
		const keys = _.keys(result.all);
		keys.sort();

		// start creating each error
		for (const key of keys) {
			const error = result.all[key];

			// create the message
			const message = Component.findOrCreate(ConsoleMessage, this, `console-message:${key}`);
			message.update(error);

			// place in the correct location
			const leading = error === result.error;
			message[leading ? 'prependTo' : 'appendTo'](this.ui.messages);
		}

		// move the heading back to the top
		this.ui.heading.prependTo(this.ui.messages);
	}

}
