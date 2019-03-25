export const controller = true;


import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_css_file,
} from './validation';


waitForValidation(module.exports, {

	file: '/style.css',

	validation(test, code) {
		validate_css_file(this.state, false, test);
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: `Great! Now the \`h1\` [define html_element Element] on this page is using a new color!`
		});
	}

});
