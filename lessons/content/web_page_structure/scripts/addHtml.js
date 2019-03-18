
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_html,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_html)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Perfect! This [define html_element Element] ensures that the web browser knows that it's dealing with an [define html] document.`
		});
	}

});
