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
		validate_css_file(this.state, true, test);
	},

	onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: `You got it! Now the \`p\` [define html_element Elements] are also using a new color!`
		});
	},

	onEnter() {
		this.editor.hint.disable();
	},

	onExit() {
		this.editor.hint.enable();
	},

	extend: {
		onConfigure(data) {

			const colors = [ 'white', 'yellow', 'pink', 'aqua', 'silver' ];
			const remove = colors.indexOf(this.state.selectedHeadingColor);
			if (remove > -1)
				colors.splice(remove, 1);

			data.content = "Write a [define css_declaration_block] that selects all `p` [define html_element Elements] and sets the `color` [define css_property l] to any of the following colors."
				+ "\n\n"
				+ "[silent] " + _.map(colors, color => "`" + color + "`").join(', ');
		}
	}

});
