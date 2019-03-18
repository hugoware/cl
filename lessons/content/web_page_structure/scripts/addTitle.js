
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	start_of_doc,
	end_of_doc,
	validate_empty_body,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</head>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo)
			.merge(start_of_doc)._n
			
			._t.tag('head')._n
			._t._t.tag('title').singleLine.content(5, 20).close('title')
			.clearBounds()._n
			._t.close('head')._n
			.__t$._n
			.merge(validate_empty_body)
			.__t$._n
			.merge(end_of_doc)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `Great! If you were to open this page in a new window you'd see the title you just added in the browser tab!`
		});
	}

});
