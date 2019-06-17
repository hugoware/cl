


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

	disableHints: true,

	validation(test, code) {
		this.screen.highlight.clear();

		test.lines(0, 2);

		validate_default_array(test);
		test.gap();
		validate_console_log_list(test);
		test.gap();
		validate_console_log_list_index(test, 0);
		test.gap();
		validate_console_log_list_index(test, 2);
		test.lines(0, 2).eof();

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
			message: 'That\'s it! Try pressing **Run Code** so we can see the result!'
		});
	},

	onRunCode() {
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(3);
		this.progress.allow();
		this.assistant.say({
			message: `Very good! The last item in the [define code_array l] is \`apples\`. It might take a little time, but you'll get used to the way [define code_array_index ls] work with [define code_array ls]!`
		});

	}

});


