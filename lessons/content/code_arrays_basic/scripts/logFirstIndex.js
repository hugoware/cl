


import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_default_array,
	validate_console_log_list,
	validate_console_log_list_index
	
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {
		this.screen.highlight.clear();

		test.lines(0, 2);

		validate_default_array(test);
		test.gap();
		validate_console_log_list(test);
		test.gap();
		validate_console_log_list_index(test, 0);
		test.gap().eof();

	},

	onEnter() {
	
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
			message: 'That looks correct! Now press **Run Code** to display the item in the [define code_array l] at position number `0`!'
		});
	},

	onRunCode() {
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(2);
		this.progress.allow();
		this.assistant.say({
			message: `That worked as expected! Zero is the first **index** in the [define code_array] so the value displayed was \`bread\``
		});

	}

});


