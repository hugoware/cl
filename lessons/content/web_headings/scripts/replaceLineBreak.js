
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_all_headings,
	validate_single_line_paragraph,
	validate_multiple_paragraphs 
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_all_headings)
		.merge(validate_single_line_paragraph)
		.merge(validate_multiple_paragraphs)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Much better! Now each phrase is on a seprate line and inside of its own [define html_element].`
		});
	},
	
	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines || (change.hasNewlines && !controller.validation.inTag);
		};

	}

});