

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;
let $hasInsertedNewline;

import {
	validate_list,
	validate_start_function,
	validate_end_function,
	validate_call_func,
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		const boundary = findBoundary(code, {
			expression: 'else {',
			trimToLine: true
		});

		// // add a newline for readability
		// if (!$hasInsertedNewline) {
		// 	$hasInsertedNewline = true;
		// 	const content = code.substr(0, boundary) + '\n' + code.substr(boundary);
		// 	console.log('epl', content);
		// 	this.file.content({ content, path: '/main.js', replaceRestore: true });
		// }

		test.setBounds(boundary);

		validate_start_function(test, {
			includeArgument: true
		});

		test.gap();
		
		validate_list(test, {
			insideFunction: true,
			animals: {
				'dog': 'woof',
				'cat': 'meow',
				'mouse': 'squeak',
				'bird': 'tweet'
			}
		});

		test.gap();
			
		validate_end_function(test);

		test.gap();

		validate_call_func(test, { arg: 'dog' });
		
		test.gap();
		
		validate_call_func(test, { arg: 'bird' });

		test.gap().eof();
		

	},

	onActivate() {
		$isValid = false;
		$hasInsertedNewline = false;
	},

	onInvalid() {
		$isValid = false;
	},

	onValid() {
		$isValid = true;
		
		this.assistant.say({
			message: 'try and run the code - see what happens'
		});

	},

	onRunCode() {
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		this.progress.allow();
		this.assistant.say({
			message: 'the message is not sure, because theres no argument provided'
		});

	}

});

