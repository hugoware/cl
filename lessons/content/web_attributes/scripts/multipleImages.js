
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	multiple_images,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(multiple_images)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Wow! This web page is starting to look like a zoo!`
		});
	}

});
