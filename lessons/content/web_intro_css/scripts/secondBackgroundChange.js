
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_background_color,
} from './validation';


waitForValidation(module.exports, {

	file: '/style.css',

	validation(test, code) {
		validate_background_color(this.state.selectedBackgroundColor, test);
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: 'That looks great! The background color has changed in the [define preview_area]!'
		});
	},

	onEnter() {
		this.editor.hint.enable();
	}


});
