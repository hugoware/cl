
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;


import {
	validate_start,
	validate_mid,
	validate_heading,
	validate_end
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',
	cursor: 92,

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
			.clearBounds()
			.lines(3)
			.merge(validate_end);


	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Way to go! You just wrote some [define html] code!`,
			emote: 'happy'
		});
	}

});
