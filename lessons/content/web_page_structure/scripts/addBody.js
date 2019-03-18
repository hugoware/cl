
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	start_of_doc,
	end_of_doc,
	validate_empty_head,
	validate_empty_body,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</html>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo)
			.merge(start_of_doc)._n
			.merge(validate_empty_head)
			._n._t$
			._n
			.merge(validate_empty_body)
			.clearBounds()
			._n
			.merge(end_of_doc)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Perfect! Now that we have a basic page structure we can start adding [define html_element Elements] to the \`head\` and \`body\`.`
		});
	}

});
