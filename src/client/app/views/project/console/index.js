import { _ } from '../../../lib';
import Component from '../../../component';
import ConsoleMessage from './message';
import { clear } from '../../../error-manager';
import $state from '../../../state';

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

		// error console is always visible -- maybe do a better job with scrolling and
		// keeping line focus?
		const doc = Component.bind(document.body);
		// doc.toggleClass('console-visible', result.hasErrors);
		doc.toggleClass('console-visible', true);

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

		// handle messages
		if (!result.hasErrors) {
			this.ui.messages.empty();
			// move the heading back to the top
			this.ui.heading.prependTo(this.ui.messages);
			return;
		}

		// get everything in alphabetical order
		const keys = _.keys(result.all);
		keys.sort();

		// clear the state
		$state.hasConsoleMessages = false;

		// start creating each error
		for (const key of keys) {
			$state.hasConsoleMessages = true;
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
