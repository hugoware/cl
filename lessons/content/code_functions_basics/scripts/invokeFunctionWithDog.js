

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
				'dog': 'bark',
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
			message: 'Great! Now press **Run Code** to see the result.'
		});

	},

	onExit() {
		this.screen.highlight.clear();
	},

	onRunCode() {
		this.screen.highlight.clear();
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;
		this.screen.highlight.outputLine(1);

		this.progress.allow();
		this.assistant.say({
			message: 'Fantastic! The [define javascript_argument] was passed from where the ||`showAnimalSound`|show animal sound|| [define javascript_function] was used and into the `animal` [define javascript_argument]!'
		});

	}

});

