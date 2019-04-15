
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;

import {
	validate_ask,
	validate_if,
	validate_else_if,
	validate_else,
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(2);
		validate_ask(test);
		test.lines(2);
		validate_if(test);
		test.lines(2);
		validate_else_if(test)

		test._n;
		test.lines(2);
		validate_else(test);
		test.lines(2).eof();
		
	},

	onValid() {
		this.progress.next();
	}

});
