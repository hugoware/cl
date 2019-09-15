
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;


import {
	validate_start,
	validate_mid,
	validate_heading,
	validate_paragraph,
	validate_image,
	validate_stylesheet,
	validate_end
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',
	cursor: 66,

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</head',
			trimToLine: true
		});


		// set the testing bounds
		test.setBounds(limitTo)
			.merge(validate_start)
			.lines(1)
			.merge(validate_stylesheet)
			.clearBounds()
			.lines(1)
			.merge(validate_mid)
			.lines(1)
			.merge(validate_heading)
			.lines(1)
			.merge(validate_paragraph)
			.lines(1)
			.merge(validate_image)
			.lines(5)
			.merge(validate_end);


	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Wow! [define css] can definitely change what a web page looks like!`,
			emote: 'happy'
		});
	}

});
