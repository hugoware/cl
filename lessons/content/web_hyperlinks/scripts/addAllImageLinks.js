
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	animals_start,
	animals_end,
	animal_fact,
	return_home_link
} from './validation';


waitForValidation(module.exports, {

	file: '/animals.html',

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '<a href="/index.html"',
			trimToLine: true
		});

		const allowed = [
			'fox',
			'bear',
			'cat',
		];

		// set the testing bounds
		test.setBounds(limitTo)
			.merge(animals_start)
			.lines(1, 3);

		// include animal facts
		animal_fact(test, allowed);
		test.lines(1, 3);

		animal_fact(test, allowed);
		test.lines(1, 3);

		animal_fact(test, allowed);

		// resume testing
		test.clearBounds()
			.lines(1, 3)
			.merge(return_home_link)
			.lines(1, 3)
			.merge(animals_end)
			.eof();
	},

	onValid() {
		const animal = this.selectedAnimal;
		this.progress.allow();
		this.assistant.say({
			message: `Fantastic! That looks like you got all of them!`
		});
	},

	onEnter() {
		this.editor.hint.disable();
	}

});
