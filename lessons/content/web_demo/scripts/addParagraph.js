
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;


import {
	validate_start,
	validate_mid,
	validate_heading,
	validate_paragraph,
	validate_end
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',
	// cursor: 92,

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</body',
			trimToLine: true
		});


		// set the testing bounds
		test.setBounds(limitTo)
			.merge(validate_start)
			.lines(3)
			.merge(validate_mid)
			.lines(1)
			.merge(validate_heading)
			.lines(1)
			.merge(validate_paragraph)
			.lines(1)
			.clearBounds()
			.lines(5)
			.merge(validate_end);


	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Great! Now you've added two [define html_element s] to the page!`,
			emote: 'happy'
		});
	}

});
