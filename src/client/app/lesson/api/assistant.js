import _ from 'lodash';
import { broadcast } from '../../events';

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
	say = (message, options) => {
		options = options || { };
		options.message = message;
		broadcast('set-message', options)
	}

	// shortcut for displaying messages without speaking
	show = message => 
		this.say(message, { silent: true });

	/** changes the emotion */
	emote = emotion => {
		broadcast('set-emotion', emotion);
	}

}