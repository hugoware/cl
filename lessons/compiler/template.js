import { _ } from './lib';
import waitForFile from './controllers/waitForFile';
import waitForTab from './controllers/waitForTab';

// import controllers
$IMPORTS$

// lesson controller
class $LESSON_TYPE$Lesson {

	// setup the lesson
	constructor(project, lesson, api) {
		this.state = { };
		this.lesson = lesson;
		this.project = project;
		this.api = api;

		// core lesson data
		this.data = $DATA$;

		// timing
		this._delays = { };
		this._intervals = { };

		// expose API tools
		this.assistant = api.assistant;
		this.events = api.events;
		this.preview = api.preview;
		this.screen = api.screen;
    this.progress = api.progress;
    this.file = api.file;
		this.editor = api.editor;
		this.sound = api.sound;
		this.flags = api.flags;

		// setup controllers
		this.controllers = { };

		// setup each included entry
		const refs = {
			$REFS$
		};

		// setup each reference
		_.each(refs, (ref, key) => {
			if (ref.controller) {
				this.controllers[key] = ref;

				// handle resets
				if (ref.onActivateLesson)
					ref.onActivateLesson.call(this);
			}
		});

		// debugging
		if (/localhost/gi.test(window.location.origin))
			window.LESSON = this;
	}

	// returns the active controller
	get controller() {
		const { slide } = this.lesson;
		return slide && this.controllers[slide.controller];
	}

	// returns the current slide
	get slide() {
		return this.lesson.slide;
	}

	// helpers
	activateSlide(slide) {

		// check for common controller scenarios
		if (slide.waitForFile) {
			slide.controller = _.uniqueId(`controller_`);
			const controller = this.controllers[slide.controller] = { };
			waitForFile(controller, {
				file: slide.waitForFile
			});
		}

		if (slide.waitForTab) {
			slide.controller = _.uniqueId(`controller_`);
			const controller = this.controllers[slide.controller] = { };
			waitForTab(controller, {
				file: slide.waitForTab
			});
		}

		if (slide.onActivate) {
			slide.onActivate.call(this, slide);
		}

	}

	// // leaves a slide
	// deactivateSlide(slide) {

	// }

	// executes an action if available
	invoke(action, ...args) {
		const { controller } = this;
		if (!controller)
			return;

		action = toActionName(action);

		// check the action
		if (controller.invoke)
			return controller.invoke.call(this, action, ...args);

		return controller[action].apply(this, args);
	}

	// checks if there's an action for this event
	respondsTo(action) {
		const { controller } = this;
		if (!controller)
			return false;

		action = toActionName(action);

		// tasks lists will handle this themselves
		// it's safe to return true here since there
		// are no gate keepers
		if (controller.respondsTo)
			return controller.respondsTo(action);

		// perform normally
		return !!controller[action];
	}


	// resets any required information between slides
	clearTimers() {
		_.each(this._delays, cancel => cancel());
		_.each(this._intervals, cancel => cancel());
	}

	// resets any required information between slides
	clear() {
		this.clearTimers();
	}

	// sets a timed delay
	delay(time, action) {
		const ref = setTimeout(action, time);
		const cancel = this._delays[ref] = () => {
			clearTimeout(ref);
			delete this._delays[ref];
		};

		return cancel;
	}

	// sets a timed interval
	interval(time, action) {
		const ref = setInterval(action, time);
		const cancel = this._intervals[ref] = () => {
			clearInterval(ref);
			delete this._intervals[ref];
		};

		return cancel;
	}

}

// converts to an invoke action name
function toActionName(name) {
	if (!/on[A-Z]/.test(name))
		name = `on${name.charAt(0).toUpperCase()}${name.substr(1)}`;
	return name;
}

// register the lesson for use
window.registerLesson('$LESSON_ID$', $LESSON_TYPE$Lesson);
