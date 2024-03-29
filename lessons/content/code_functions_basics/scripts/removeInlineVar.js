

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

		validate_start_function(test, { });
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

		validate_call_func(test, { noArgument: true });

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
		this.progress.next();
	},

	onRunCode() {
		return true;
	}

});
