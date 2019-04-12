
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;

let $valid;
let $color;
let $age;

import {
	declare_number,
	declare_string,
	alert_messages
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		const color = this.state.selectedColor;
		const age = this.state.selectedAge;

		test.lines(2);
		declare_number(test, age);
		test.lines(2);
		declare_string(test, color);
		test.lines(2);
		alert_messages(test);
		test.lines(2);

		// capture the new colors
		$color = test.pull('color');
		$age = _.toString(test.pull('num'));

	},

	onValid() {
		$valid = true;
		this.assistant.say({
			message: "That looks good so far, press **Run Code** and let's see if the `alert` messages display the new values."
		});
	},

	onEnter() {
		$valid = false;

		this.state.selectedColor = 'red';
		this.state.selectedAge = 33;
	},

	extend: {

		onRunCode() {
			return $valid;
		},

		onRunCodeAlert(runner) {

			if (runner.alerts[1] === $color) {
				this.progress.allow();
				this.assistant.say({ 
					message: `Great work! There's the \`color\` value displaying \`"${$color}"\` as expected!`,
					emote: 'happy'
				});
			}
			else if (runner.alerts[0] === $age) {
				this.assistant.say({ 
					message: `There's the \`age\` value and it's now showing \`${$age}\` instead of it's previous value!`
				});
			}

		}

	}

});
