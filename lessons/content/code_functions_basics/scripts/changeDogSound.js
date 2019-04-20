

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_list,
	validate_start_function,
	validate_end_function,
	validate_call_func,
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		validate_start_function(test, {
			includeArgument: true
		});

		test.gap();
		
		validate_list(test, {
			insideFunction: true,
			animals: {
				'dog': 'woof',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();
			
		validate_end_function(test);

		test.gap();

		validate_call_func(test, { arg: 'dog' });

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
			message: 'That looks correct! Press **Run Code** and check that the result has updated.'
		});

	},

	onRunCode() {
		this.screen.highlight.clear();
		return true;
	},

	onExit() {
		this.screen.highlight.clear();
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(1);

		this.progress.allow();
		this.assistant.say({
			message: 'There we go! Now the message reads **"dog says woof"** instead of the old message!',
			emote: 'happy'
		});

	}

});

