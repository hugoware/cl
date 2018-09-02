import $state from '../../state';

export default class Validate {

	constructor(selector, lesson, slide) {
		this.selector = selector;
		this.command = this.selector.commands.validate[0];
		this.lesson = lesson;
		this.slide = slide;
		// const command = this.selector.command.validate[0];
		// this.validator = this.lesson.validators[command];
	}

	// runes the validation
	validate() {
		// console.log('testing', this.command);
		// include the validation
		// const result = this.validator({
		// 	state: $state
		// });

	}

	dispose() {

	}

}