
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	input_only,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(input_only)
		.eof(),

	onValid() {
		this.progress.next();
	}

});
