
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;


import {
	validate_start,
	validate_mid,
	validate_heading,
	validate_image,
	validate_end
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

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
			.merge(validate_image)
			.clearBounds()
			._n
			.lines(3)
			.merge(validate_end);


	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Well done! Is that your favorite emoji?`,
			emote: 'happy'
		});
	}

});
