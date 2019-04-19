

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
	validate_declare_animal
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		validate_start_function(test, { });
		test.gap();

		validate_declare_animal(test, { insideFunction: true, variableName: 'animal' });
		const animalVariable = this.state.animalVariable = test.pull('animalVariable');

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
		this.assistant.say({
			message: 'Now press **Run Code** so we can see the result'
		});
	},

	onRunCode() {
		return true;
	},

	onRunCodeEnd() {
		if (!$isValid) return;

		const { animalVariable } = this.state;
		const sound = {
			'dog': 'bark',
			'cat': 'meow',
			'mouse': 'squeak'
		}[animalVariable];


		this.progress.allow();
		this.assistant.say({
			message: `That worked as expected, the sound was for - "${sound}" because var "${animalVariable}" `
		});

	}

});
