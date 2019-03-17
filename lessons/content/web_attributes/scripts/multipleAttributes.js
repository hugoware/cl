
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
			message: `Pretty neat! The \`width\` and \`height\` [define html_attribute Attributes] changed the size of each \`img\` [define html_element Element]!`
		});
	}

});
