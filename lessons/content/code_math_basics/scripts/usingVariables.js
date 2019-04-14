

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
			.lines(2);

		validate_variables(test);
		test.lines(2)
			.eof()

		// for the next test
		this.state.cookies = test.pull('cookies');
		this.state.people = test.pull('people');

	},

	onValid() {

		$isValid = true;

		this.assistant.say({
			message: `That looks correct! Press **Run Code** and let's see the result!`
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

			this.screen.highlight.outputLine(9);
			this.progress.allow();
			this.assistant.say({
				message: `Wonderful! The [define code_variable l] \`||totalCookies|total cookies||\` was declared using the result of the [define javascript_expression l] using two other [define code_variable ls].`,
				emote: 'happy'
			});
		}

	}

});
