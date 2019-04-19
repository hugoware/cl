

import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';

export const controller = true;
let $isValid;

import {
	validate_list,
	validate_start_function,
	validate_end_function,
	validate_declare_animal
} from './validation';


waitForValidation(module.exports, {

	file: '/main.js',

	validation(test, code) {

		validate_start_function(test, { });
		test.gap();

		validate_declare_animal(test, { insideFunction: true, variableName: 'animal' });
		const except = test.pull('selectedAnimal');

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

		test.gap().eof();
		

	},

	onValid() {
		this.progress.next();
	}

});
