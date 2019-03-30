import { listen , broadcast, remove } from "../../events";

export default class EventAPI {

	constructor(lesson) {
		this.lesson = lesson;
		this.events = [ ];

		// make sure nothing stays attached after leaving a lesson
		listen('deactivate-project', () => {
			this.clear();
		});
	}

	/** listens for an event */
	listen(...args) {
		const id = listen(...args);
		this.events.push(id);
		return () => remove(id);
	}

	/** allow broadcasting from the lessons */
	broadcast(...args) {
		broadcast(...args);
	}

	/** disposes all active events */
	clear() {
		for (let i = this.events.length; i-- > 0;) {
			remove(this.events[i]);
			this.events.splice(i, 1);
		}

	}

}