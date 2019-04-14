

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

		validate_variables(test, this.state.cookies, this.state.people);
		test.lines(2).eof();

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

		onRunCodeEnd(runner) {
			if (!$isValid) return;

			const value = _.toString(runner.output[9]);
			const isSame = _.toString(this.state.cookies * this.state.people) === value;
			const message = isSame
				? "Oh, that's funny! You changed the numbers but still ended up with the same total as before! In any case, changing [define code_variable ls] will normally cause [define javascript_expression ls] to end up with different results!"
				: `Perfect! Changing the value of [define code_variable sl] earlier in the code caused the [define javascript_expression l] for \`||totalCookies|total cookies||\` to have a different result!`;

			this.screen.highlight.outputLine(9);
			this.progress.allow();
			this.assistant.say({
				message: message,
				emote: isSame ? 'surprise' : 'happy'
			});
		}

	}

});
