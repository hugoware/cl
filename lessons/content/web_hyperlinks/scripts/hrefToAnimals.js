
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	index_start,
	index_end
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</body>',
			trimToLine: true
		});

		// set the testing bounds
		test
			.merge(index_start)._n
			._t$._t$._n
			._t._t.open('a')._s.attrs([
				[ 'href', '/animals.html' ]
			])._s$.close('>')._n
			._t._t._t.text('See the animals')._n
			._t._t.close('a')
			._n
			._t$._t$._n
			.merge(index_end)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That's correct! Unlike the \`title\` [define html_element Element] we can see this content displayed in the [define preview_area]`
		});
	}

});
