
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;

let $color;

import {
	declare_number,
	declare_string,
	alert_messages
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(2);
		declare_number(test);
		test.lines(2);
		declare_string(test);
		test.lines(2);
		alert_messages(test);
		test.lines(2);

		this.state.selectedColor = test.pull('color');
		this.state.selectedAge = test.pull('num');


	},

	onValid() {
		this.progress.next();
	},

});
