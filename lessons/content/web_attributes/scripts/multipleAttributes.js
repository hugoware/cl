
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	multiple_images_with_sizes,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(multiple_images_with_sizes)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Check it out! The \`img\` [define html_element Element] is now displayed as an actual image in the [define preview_area].`
		});
	}

});
