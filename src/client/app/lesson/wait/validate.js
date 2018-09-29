import $state from '../../state';

export default class Validate {

	constructor(selector, slide) {
		this.selector = selector;
		this.command = this.selector.commands.validate[0];
		this.debounce = 0 | (this.selector.commands.validate[1] || 0);
		this.slide = slide;

		// look up the validation function

		console.log('created validator', this.command, this.debounce);
		// const command = this.selector.command.validate[0];
		// this.validator = this.lesson.validators[command];
	}

	// runs the validation for the view
	validate() {
		console.log('testing?');
		// console.log('testing', this.command);
		// include the validation
		// const result = this.validator({
		// 	state: $state
		// });

	}

	dispose() {

	}

}