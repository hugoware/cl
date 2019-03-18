
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	start_of_doc,
	end_of_doc,
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
			._t._t.tag('title').singleLine.content(5, 20).close('title')._n
			._t._t.open('meta')._s.matchAttributeSequence.attrs([
				[ 'name', 'author' ],
				[ 'value', /^[^"']{1,20}/, 'Expected an author name' ]
			])._s$.close('/>')
			.clearBounds()._n
			._t.close('head')._n
			.__t$._n
			._t.tag('body')._n
			._t._t.tag('h1').singleLine.content(5, 25).close('h1')._n
			._t._t.tag('p').singleLine.content(5, 25).close('p')._n
			._t.close('body')._n
			.merge(end_of_doc)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That's correct! The \`meta\` [define html_element Element] won't appear on the page, but now [define search_engine s] will know the author of the page!`
		});
	}

});
