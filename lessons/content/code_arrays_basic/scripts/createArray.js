


import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_default_array,
	validate_console_log_list
	
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(0, 2);

		validate_default_array(test);
		test.gap();
		validate_console_log_list(test);
		test.gap().eof();

	},

	onActivate() {
		$isValid = false;
	},

	onInvalid() {
		$isValid = false;
	},

	onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'That looks correct! Now press **Run Code** so we can see the results!'
		});
	},

	onRunCode() {
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		this.progress.allow();
		this.assistant.say({
			message: `Great! The **Output Area** is showing the contents of the [define code_array l].`
		});

	}

});


