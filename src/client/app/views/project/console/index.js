import _ from 'lodash';
import Component from '../../../component';
import ConsoleMessage from './message';

/** @typedef {Object} CompilerError
 * @prop {string} file the file that had the error
 * @prop {string} message the full error message
 * @prop {number} line the line number of the error
 * @prop {number} column the column of the error message
 * @prop {string} [code] optional error code info
 * @prop {string} [hint] optional info about the error
 */

 /** @typedef {Object} CompilerResult
	* @prop {boolean} success did this compile successfully
	* @prop {CompilerError} error the most recent error thrown
  * @prop {Object<string, CompilerError>} all all pending compiler errors
  */

export default class Console extends Component {

	constructor(context) {
		super({
			context,
			template: 'console',

			ui: {
				items: '.items'
			}
		});

		this.listen('compiler-result', this.onCompileResult);

	}

	onCompileResult = result => {
		this.update(result);
	}

	/** @param {CompilerResult} result */
	update = result => {

		if (result.success)
			return this.ui.items.empty();

		// get everything in alphabetical order
		const keys = _.keys(result.all);
		keys.sort();

		// make sure the recent error is first?

		// start creating each error
		for (const key of keys) {
			const error = result.all[key];

			// create the message
			const message = Component.findOrCreate(ConsoleMessage, this, `console-message:${key}`);
			message.update(error);

			// place in the correct location
			const leading = error === result.error;
			message[leading ? 'prependTo' : 'appendTo'](this.ui.items);
		}

	}

}
