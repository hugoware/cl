
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	start_link_about,
	finish_link_about,
} from './validation';


waitForValidation(module.exports, {

	file: '/about.html',
	cursor: 61,

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</head>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo)
			.merge(start_link_about)
			.clearBounds()
			._n.__b
			.merge(finish_link_about)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: `Wonderful! Now the same [define css] [define css_stylesheet] is being used on two separate pages!`
		});
	},

	onEnter() {
		this.editor.hint.disable();
	}

});
