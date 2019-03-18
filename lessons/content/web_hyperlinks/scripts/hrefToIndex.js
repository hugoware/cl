
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	animals_start,
	animals_end,
	return_home_link
} from './validation';


waitForValidation(module.exports, {

	file: '/animals.html',

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</body>',
			trimToLine: true
		});

		// set the testing bounds
		test
			.merge(animals_start)._n
			._t$._t$._n
			.merge(return_home_link)
			._n
			._t$._t$._n
			.merge(animals_end)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That's correct! Unlike the \`title\` [define html_element Element] we can see this content displayed in the [define preview_area]`
		});
	}

});
