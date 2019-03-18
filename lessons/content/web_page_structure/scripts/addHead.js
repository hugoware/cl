
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	start_of_doc,
	end_of_doc,
	validate_empty_head,
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
			.clearBounds()
			._n._t$
			._n._t$
			.merge(end_of_doc)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That looks correct! We'll come back to this [define html_element Element] later, but for now let's continue creating the page structure.`
		});
	}

});
