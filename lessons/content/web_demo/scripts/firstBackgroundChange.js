
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_css_file,
} from './validation';


waitForValidation(module.exports, {

	file: '/style.css',

	validation(test, code) {
		this.state.selectedBackgroundColor = validate_css_file(test);
	},

	onValid() {

		const color = this.state.selectedBackgroundColor;
		const message = color === 'orange' ? `Orange is so bright and vibrant! One of my favorites!`
			: color === 'red' ? `What a bold color of red! It definitely draws a lot of attention!`
			: color === 'blue' ? `Blue is a great color! You might have noticed that we like that color around here!`
			: color === 'purple' ? `Great color! Did you know that purple has been associated with royalty for centuries?`
			: "Oh my! You selected _magenta_? Such a bright and vibrant color!";

		const emote = color === 'magenta' ? 'surprised' : 'normal';

		this.progress.allow();
		this.assistant.say({ emote, message });
	},



});
