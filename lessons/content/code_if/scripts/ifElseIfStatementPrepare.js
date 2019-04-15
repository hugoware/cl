
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_variables,
	validate_if,
	validate_else_if,
	validate_else,
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		const boundary = findBoundary(code, {
			expression: /else *\{/
		});

		test.setBounds(boundary);
		test.lines(2);
		validate_variables(test, { flip: true });
		test.lines(2);
		validate_if(test);
		test.lines(2);
		validate_else_if(test)

		test._n;
		test.clearBounds();
		test.lines(2);
		validate_else(test);
		test.lines(2).eof();
		

	},

	onValid() {

		$isValid = true;

		this.assistant.say({
			message: `Simple enough! Press **Run Code** and let's see what message is displayed!`
		});

	},

	onInvalid() {
		$isValid = false;
	},

	onEnter() {
		$isValid = false;

		// make room for the else if
		let content = this.file.content({ path: '/main.js' })
		const index = content.indexOf('else {');
		content = content.replace(/else \{/g, '\n\nelse {');
		this.file.content({ path: '/main.js', content, replaceRestore: true });

		this.editor.cursor({ path: '/main.js', index });

	},

	extend: {

		onRunCode() {
			this.screen.highlight.clear();
			return true;
		},

		onRunCodeEnd() {
			if (!$isValid) return;

			this.screen.highlight.codeOutput();

			this.progress.allow();
			this.assistant.say({
				message: `That's interesting! No message was displayed to the [define codelab_code_output] area.`,
			});
		}

	}

});
