

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
		
		test.gap();

		validate_call_func(test, { arg: 'bird' });

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
			message: 'Good! Now press **Run Code** and to see what message is shown!'
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

		this.progress.allow();
		this.screen.highlight.outputLine(2);
		this.assistant.say({
			message: `That's exactly what we should see. The [define javascript_argument] \`animal\` has the value **"bird"**, which doesn't match any of the conditions.`
		});

	}

});

