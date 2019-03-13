
import { _ } from './lib';
import { validate_all_headings } from './validation';
import waitForValidation from './controllers/waitForValidation';

waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_all_headings)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That's a lot of heading [define html_element Elements]! Each one is displayed using a different size than the others.`
		});
	},

	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines || (change.hasNewlines && !controller.validation.inTag);
		};

	}
	
});