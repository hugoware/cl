
import { _ } from './lib';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_doctype,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.merge(validate_doctype)
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That looks good! In the past the \`doctype\` had more complexities you had to be aware of, but fortunately it's been greatly simplified in modern web development.`
		});
	}

});
