
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	first_src,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',
	cursor: 6,

	validation: test => test
		.merge(first_src)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Check it out! The \`img\` [define html_element Element] is now displayed as an actual image in the [define preview_area].`
		});
	},
	
	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines;
		}

	}

});