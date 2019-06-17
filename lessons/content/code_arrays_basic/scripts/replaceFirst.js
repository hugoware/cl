


import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_default_array,
	validate_console_log_list,
	validate_console_log_list_index,
	validate_array_assign_index
	
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

		let content = this.file.content({ path: '/main.js' });
		const index = content.indexOf('console.log(list);');
		content = content.replace('console.log(list);', '\n\nconsole.log(list);')

		// set the new starting position
		this.file.content({ path: '/main.js', replaceRestore: true, content });
		this.editor.cursor({ path: '/main.js', index });
		
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
			message: 'That should do it! Try pressing **Run Code** so we can see the result!'
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
			message: `Great! When the [define code_array l] was created, the first item was the word \`bread\`, but now it has been replaced with the word \`cheese\`!`
		});

	}

});


