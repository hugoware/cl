

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_list,
	validate_declare_animal
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		validate_declare_animal(test, {
			variableName: 'animal'
		});

		test._n._n;
		
		validate_list(test, {
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test._n
			.lines(2)
			.eof();
		
		this.state.animalVariable = test.pull('animalVariable');

	},

	onValid() {

		$isValid = true;

		this.assistant.say({
			message: `great, press run code and try it out`
		});

	},

	onInvalid() {
		$isValid = false;
	},

	onEnter() {
		$isValid = false;
	},

	extend: {

		onRunCode() {
			this.screen.highlight.clear();
			return true;
		},

		onRunCodeEnd() {
			if (!$isValid) return;

			this.screen.highlight.outputLine(1);

			this.progress.allow();
			this.assistant.say({
				message: `Looks like it worked as expected`,
			});
		}

	}

});
