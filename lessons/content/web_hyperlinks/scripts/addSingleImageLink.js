
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
			.merge(animals_start)._n
			._t$._t$._n;

		// include animal facts
		this.state.animalType = animal_fact(test, allowed);

		// resume testing
		test.clearBounds()
			._t$._t$._n
			.merge(return_home_link)._n
			._t$._t$._n
			.merge(animals_end)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Great! Now we have an \`img\` [define html_element Element] that's also a [define hyperlink link] to another page!`
		});
	}

});
