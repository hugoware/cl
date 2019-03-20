import { listen , broadcast } from "../../events";

export default class EventAPI {

	constructor(lesson) {
		this.lesson = lesson;
		this.events = [ ];
	}

	/** listens for an event */
	listen(...args) {
		const dispose = listen(...args);
		this.events.push(dispose);
	}

	/** allow broadcasting from the lessons */
	broadcast(...args) {
		broadcast(...args);
	}

	/** disposes all active events */
	clear() {
		for (let i = this.events.length; i-- > 0;) {
			this.events[i]();
			this.events.splice(i, 1);
		}

	}

}