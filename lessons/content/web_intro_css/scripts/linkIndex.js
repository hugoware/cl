
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	start_link_index,
	finish_link_index,
} from './validation';


waitForValidation(module.exports, {

	file: '/index.html',
	cursor: 62,

	validation(test, code) {

		const limitTo = findBoundary(code, {
			expression: '</head>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo)
			.merge(start_link_index)
			.clearBounds()
			._n.__b
			.merge(finish_link_index)
			.eof();
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: `Great! The background color changed to _orange_ which means that this [define css] file already has some [define css_declaration ls] in it!`
		});
	},

	onEnter() {
		this.editor.hint.disable();
	},

	onExit() {
		this.editor.hint.enable();
	}

});
