
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;

let $value;


import {
	declare_number
} from './validation';


waitForValidation(module.exports, {

	cursor: 5,

	file: '/main.js',

	validation(test, code) {

		test.lines(2);
		declare_number(text);
		test.lines(2);

		$value = test.pull('num', 0);

	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That's correct! You just created a [define code_variable l] called \`age\` that has the value of \`${$value}\`!`,
			emote: 'happy'
		});
	}

});
