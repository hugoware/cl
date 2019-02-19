
// import controllers
$IMPORTS$

// performs the oxford comma
function $oxford(items, conjunction) {
	const total = items.length;

	// determine the best
	if (total === 1)
		return items.join('')
	else if (total == 2)
		return items.join(` ${conjunction} `);

	// return the result
	else {
		const last = items.pop();
		return `${items.join(', ')}, ${conjunction} ${last}`;
	}
}

// pluralizes a word
function $plural(count, single, plural, none, delimeter = '@') {
	const value = Math.abs(count);
	const message = value === 1 ? single
		: value > 1 ? (plural ? plural : `${single}s`)
			: none || plural;
	return message.replace(delimeter, count);
}

// lesson controller
class $LESSON_TYPE$Lesson {

	// setup the lesson
	constructor(project, lesson, api, utils) {
		this.state = { };
		this.lesson = lesson;
		this.project = project;
		this.api = api;

		// core lesson data
		this.data = $DATA$;

		// other utilities
		utils.plural = $plural;
		utils.oxford = $oxford;

		// share utility function
		const _ = window._ = utils._;
		utils._.assign(_, utils);

		// timing
		this._delays = { };
		this._intervals = { };

		// expose API tools
		this.assistant = api.assistant;
		this.screen = api.screen;
    this.progress = api.progress;
    this.validate = api.validate;
    this.content = api.content;
		this.editor = api.editor;
		this.sound = api.sound;

		// setup controllers
		this.controllers = { };

		// setup each included entry
		const refs = {
			$REFS$
		};

		// setup each reference
		_.each(refs, (ref, key) => {
			if (ref.controller) this.controllers[key] = ref;
			else _.assign(this, ref);
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

	// executes an action if available
	invoke(action, ...args) {
		if (!this.respondsTo(action)) return null;
		action = toActionName(action);
		const { controller } = this;
		return controller[action].apply(this, args);
	}

	// checks if there's an action for this event
	respondsTo(action) {
		action = toActionName(action);
		const { controller } = this;
		return !!controller && controller[action];
	}


	// resets any required information between slides
	clear() {
		_.each(this._delays, cancel => cancel());
		_.each(this._intervals, cancel => cancel());
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
