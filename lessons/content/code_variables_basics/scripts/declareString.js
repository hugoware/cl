
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;

let $color;

import {
	declare_number,
	declare_string
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		test.lines(2);
		declare_number(test);
		test.lines(2);
		declare_string(test);
		test.lines(2);

		$color = test.pull('color');

	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Fantastic! Now you've created a [define code_variable l] called \`color\`. This [define code_variable l] is a [define javascript_string l] with the value \`"${$color}"\`!`,
			emote: 'happy'
		});
	}

});
