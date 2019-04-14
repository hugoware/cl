

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_basic_1,
	validate_basic_2,
	validate_basic_3,
	validate_variables
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(3)
			.merge(validate_basic_1)
			._n
			.lines(2)
			.merge(validate_basic_2)
			._n
			.lines(2)
			.merge(validate_basic_3)
			._n
			.lines(2)
			.merge(validate_variables)
			.lines(2);

	},

	onValid() {

		$isValid = true;

		this.assistant.say({
			message: `Very good! Press **Run Code** and let's see what happens next!`
		});

	},

	onInvalid() {
		$isValid = false;
	},

	onEnter() {
		$isValid = false;
	},

	extend: {

		onRunCode() {
			return true;
		},

		onRunCodeEnd() {
			if (!$isValid) return;

			this.progress.allow();
			this.assistant.say({
				message: `That's it! Each \`console.log\` message is displaying the correct result for their expression!`,
				emote: 'happy'
			});
		}

	}

});
