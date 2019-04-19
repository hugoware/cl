

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

		validate_declare_animal(test, { variableName: 'animal' });
		const except = test.pull('animalVariable');

		test._n._n;
		
		validate_list(test, {
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test._n;
			
		validate_declare_animal(test, {
			variableName: 'otherAnimal',
			except
		});


		test._n.lines(2).eof();
		

	},

	onValid() {
		this.progress.next();
	}

});
