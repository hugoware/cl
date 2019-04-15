
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_variables,
	validate_if,
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(2);
		validate_variables(test);
		test.lines(2);
		validate_if(test);
		test.lines(2).eof();
		

	},

	onValid() {

		$isValid = true;

		this.assistant.say({
			message: `That looks correct! Press **Run Code** and let's see what message is displayed!`
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
			this.screen.highlight.clear();
			return true;
		},

		onRunCodeEnd() {
			if (!$isValid) return;

			this.screen.highlight.outputLine(1);

			this.progress.allow();
			this.assistant.say({
				message: `That worked! Because the [define code_variable l] \`totalStudents\` is greater than \`totalBooks\` the message was displayed!`,
				emote: 'happy'
			});
		}

	}

});
