

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_basic_1
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(3)
			.merge(validate_basic_1)
			._n
			.lines(3);

	},

	onValid() {

		$isValid = true;

		this.assistant.say({
			message: `Looks good! Press the **Run Code** button so we can see the output!`
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
				message: 'Fantastic! Each of the expressions worked as expected and printed their values in the [define codelab_code_output] area!',
				emote: 'happy'
			});
		}

	}

});
