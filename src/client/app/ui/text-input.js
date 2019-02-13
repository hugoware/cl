import { _, measureText } from '../lib';
import Component from '../component';
import { cancelEvent } from '../utils/index';

export default class TextInput extends Component {

	constructor(config) {
		super(config);

		// save the config
		this.config = config;

		// configure
		this.addClass('ui-text-input');

		// create the content editable area
		this.input = Component.bind('input');
		this.input.addClass('input');
		this.input.prop('type', 'text');
		this.append(this.input);

		// listen for events
		this.input.on('input', this.onInput);
		this.input.on('keyup', this.onKeyUp);

		// initial sync
		matchInput(this, '');
	}

	/** returns the current suffix, if any
	 * @returns {string} the current suffix
	 */
	get suffix() {
		return this._suffix ? this._suffix.text() : '';
	}

	/** sets a suffix tail value for an input
	 * @param {string} value the value to assign
	 */
	set suffix(value) {
		const isNothing = _.isNil(value);

		// check if the suffix needs to be created
		if (!this._suffix) {
			if (isNothing) return;
			createSuffix(this);
		}

		// check if removing
		if (isNothing) 
			return this.removeClass('with-suffix');

		// change the value
		this.addClass('with-suffix');
		this._suffix.text(value);
	}

	/** gets the current set value
	 * @returns {string} the current value
	 */
	get value() {
		return this.input.val();
	}

	/** sets the input field value
	 * @param {string} value the value to assign
	 */
	set value(value) {
		this.input.val(value);
		matchInput(this, value);
	}

	/** focuses selection on the text input */
	select = () => {
		this.input.selectText();
	}

	// sync input sizes
	onInput = event => {
		matchInput(this, event.target.value);
	}

	// check for events
	onKeyUp = event => {
		
		// if this was the enter key
		if (event.which === 13)
			this.raiseEvent('confirm-entry', { value: event.target.value });

	}

}

// matches the input size to the text
function matchInput(instance, text, { fontSize = '19px', fontFamily = 'sans-serif' } = { }) {
	const size = measureText({
		text,
		fontSize,
		fontFamily,
		lineHeight: '1px',
		fontWeight: 'normal',
		fontStyle: 'normal',
	});

	// determine the width to use
	let width = size.width.value;
	if (!isNaN(instance.config.minWidth))
		width = Math.max(width, 0 | instance.config.minWidth);

	// replace the width
	instance.input.width(width + 2);
}

// adds a suffix layer
function createSuffix(instance) {
	if (instance._suffix) return;
	instance._suffix = Component.bind('div');
	instance._suffix.addClass('suffix');
	instance.append(instance._suffix);
}