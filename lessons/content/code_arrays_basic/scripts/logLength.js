


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
	validate_log_length
	
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	disableHints: true,

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
		test.gap();

		validate_log_length(test);
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
			message: 'Perfect! Try pressing **Run Code** so we can see the result!'
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
			message: `Wonderful! Using \`console.log\` with the \`length\` [define javascript_property l] shows that there are now **4** items in the [define code_array l]!`
		});

	}

});


