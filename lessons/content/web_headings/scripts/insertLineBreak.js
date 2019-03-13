
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_all_headings,
	validate_single_line_paragraph,
	validate_multi_line_paragraph_with_break 
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_all_headings)
		.merge(validate_single_line_paragraph)
		.merge(validate_multi_line_paragraph_with_break)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That did it! Each phrase is now displayed on a separate line in the [define preview_area].`
		});
	},
	
	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines || (change.hasNewlines && !controller.validation.inTag);
		};

	}

});