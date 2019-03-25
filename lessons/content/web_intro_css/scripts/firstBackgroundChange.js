
import { _ } from './lib';
import { findBoundary } from './utils';
import waitForValidation from './controllers/waitForValidation';
import {
	validate_background_color,
} from './validation';


waitForValidation(module.exports, {

	file: '/style.css',

	validation(test, code) {
		this.state.selectedBackgroundColor = validate_background_color(null, test);
	},

	onValid() {

		const color = this.state.selectedBackgroundColor;
		const message = color === 'green' ? `What a nice color of green! Makes me think of a nice walk in the forest!`
			: color === 'red' ? `What a bold color of red! It definitely draws a lot of attention!`
			: color === 'gray' ? `Using gray? It's neutral, sophisticated, and classy -- I like it!`
			: color === 'purple' ? `Great color! Did you know that purple has been associated with royalty for centuries?`
			: "Oh my! You selected _magenta_? Such a bright and vibrant color!";

		const emote = color === 'magenta' ? 'surprised' : 'normal';

		this.progress.allow();
		this.assistant.say({ emote, message });
	},



});
