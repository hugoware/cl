
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_all_headings,
	validate_single_line_paragraph,
	validate_multi_line_paragraph 
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_all_headings)
		.merge(validate_single_line_paragraph)
		.merge(validate_multi_line_paragraph)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'surprised',
			message: `Great! It may seem odd, but even though both phrases are on the same line **that's the expected result**!`
		});
	},
	
	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines || (change.hasNewlines && !controller.validation.inTag);
		};

	}

});