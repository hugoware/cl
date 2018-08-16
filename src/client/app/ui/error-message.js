import _ from 'lodash';
import Component from '../component';
import $showdown from 'showdown';

// shared markdown converter
const $convert = new $showdown.Converter();

const DEFAULT_ERROR_MESSAGE = 'There was an unexpected error';

export default class ErrorMessage extends Component {

	constructor(config) {
		super(config);

		// move all messages to the same object
		this.errors = config.errors;
		this.warnings = config.warnings;
		this.messages = _.assign({ }, this.errors, this.warnings);
		// this.allowMultiple = !!config.allowMultiple;

		// create some extra children
		this.ui.content = Component.create('div');
		this.ui.content.addClass('content');
		this.append(this.ui.content);

		// hidden by default
		this.hide();
	}

	/** sets the error messages for this display
	 * @param {Object<string, string>} errors the errors to displau
	 */
	setErrors = errors => {
		_.assign(this.messages, errors);
		_.assign(this.errors, errors);
	}

	/** sets the warning messages for this display
	 * @param {Object<string, string>} warnings the warnings to displau
	 */
	setWarnings = warnings => {
		_.assign(this.messages, warnings);
		_.assign(this.warnings, warnings);
	}

	/** changes the style of the error message
	 * @param {string} type the kind of message
	 */
	setAs = type => {
		this.removeClass('as-warning as-error');
		this.addClass(`as-${type}`);
	}

	/** applies an error object to determine what message to show */
	apply = (error, args) => {
		let key;

		// try and find the error
		if (_.isObject(error) && !_.isString(error))
			key = error.error || error.err;

		// make sure the error code is found
		else if (_.isString(error))
			key = error;

		// find the message, if any
		const template = this.messages[key] || this.messages.default;
		const message = _.isFunction(template) ? template(args) : template;

		// just in case
		if (!message) {
			console.log('[unhandled error]', error);
			debugger;
		}

		// set the message and show it
		const html = $convert.makeHtml(message);
		this.ui.content.html(html || DEFAULT_ERROR_MESSAGE);
		this.show();
	}

	/** clears the current error message */
	clear = () => {
		this.hide();
	}

}
