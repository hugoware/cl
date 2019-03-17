
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	input_readonly,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(input_readonly)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Great! The \`readonly\` [define html_attribute Attribute] has changed the behavior of the \`input\` [define html_element Element]!`
		});
	}

});
