
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_all_headings,
	validate_single_line_paragraph
} from './validation';

let $inTag;

waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_all_headings)
		.merge(validate_single_line_paragraph)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Very good! The \`p\` [define html_element Element] created a new block of text in the [define preview_area].`
		});
	},
	
	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines || (change.hasNewlines && !controller.validation.inTag);
		}

	}

});