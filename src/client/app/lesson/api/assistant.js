import _ from 'lodash';
import { broadcast } from '../../events';
import $state from '../../state';

export default class AssistantAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// common emotions
		this.emote.clear = () => this.emote();
		this.emote.surprised = () => this.emote('surprised');
		this.emote.happy = () => this.emote('happy');
		this.emote.sad = () => this.emote('sad');
	}

	/** speaks a message */
	say = ({ message, emote, silent }) => {
		message = trimLeading(message);
		broadcast('set-message', { message, emote, silent });
	}
	
	// return to the original message
	revert = ({ silent = false } = { }) => {
		const { slide } = $state.lesson;
		broadcast('set-message', { 
			message: slide.content,
			emote: slide.emote || slide.emotion,
			silent
		});
	}

	// shortcut for displaying messages without speaking
	show = ({ message, emote }) => 
		this.say({ message, emote, silent: true });

	/** changes the emotion */
	emote = emotion => {
		broadcast('set-emotion', emotion);
	}

}

function trimLeading(str) {
	return _.map(_.trim(str).split(/\n/g), _.trim).join('\n');
}