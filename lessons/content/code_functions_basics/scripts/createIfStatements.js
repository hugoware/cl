

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;

import {
	validate_list
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test._n._n;

		validate_list(test, {
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test._n
			.lines(2)
			.eof();
		

	},

	onValid() {

		this.progress.allow();

		this.assistant.say({
			message: `Wow! That was a lot of \`if\` statements to type in!`
		});

	}

});
