


import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_default_array,
	validate_console_log_list,
	validate_console_log_list_index,
	validate_array_assign_index,
	validate_add_item,
	
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {
		this.screen.highlight.clear();

		const boundary = findBoundary(code, {
			expression: 'console.log(list);'
		})

		test.setBounds(boundary);
		test.lines(0, 2);

		validate_default_array(test);
		test.gap();

		validate_array_assign_index(test, 0, 'cheese');
		test.gap();

		validate_array_assign_index(test, 2, 'cookies');
		test.gap();

		validate_add_item(test);
		test.clearBounds();
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
			message: 'That\'s correct! Try pressing **Run Code** so we can see the result!'
		});
	},

	onRunCode() {
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(1);
		this.progress.allow();
		this.assistant.say({
			message: `Very good! You'll notice that there's a new value for \`milk\` inside of the [define code_array l]!`
		});

	}

});


