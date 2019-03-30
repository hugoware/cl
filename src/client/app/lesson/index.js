/// <reference path="../types/index.js" />

import { _, $ } from '../lib';
import $state from '../state';
import $api from '../api';
import $focus from './focus';
import $wait from './wait';
import LessonAPI from './api';

import { load } from './loader';
import { broadcast, listen, remove } from '../events';

/** creates a default lesson */
export default class Lesson {

	/** Handles creating an instance of a lesson
	 * @param {string} id the id of the lesson to load
	 * @returns {Lesson} an instance of a lesson
	 */
	static async load(project) {
		const type = await load(project.lesson);
		return new Lesson(project, type);
	}

	// creates a new lesson
	constructor(project, type) {

		// setup the lesson
		this.api = new LessonAPI(this);
		this.instance = new type(project, this, this.api);

		// // lock and unlock states for files
		// this.files = { };

		// // tracking slide events
		// this.events = [ ];

		// by default, start so that a navigation
		// should happen
		/** @type {number} the current slide index */
		this.index = -1;

		/** @type {number} the total number of slides to display */
		this.totalSlides = _.size(this.slides);

		// prepare the lesson for use
		initialize(this);
	}

	/** the last index slide in the lesson
	 * @returns {number} the last slide index
	 */
	get lastIndex() {
		return this.totalSlides - 1;
	}

	// set the active slide
	/** @type {LessonSlide} the active lesson slide */
	get slide() {
		return this.slides[this.index];
	}

	/** @type {Object<string, LessonSnippet>} the snippets for the lesson */
	get snippets() {
		return this.instance.data.snippets;
	}

	/** @type {Object<string, LessonDefinition>} the snippets for the lesson */
	get definitions() {
		return this.instance.data.definitions;
	}

	/** returns access to the slides and questions for this lesson
	 * @returns {LessonSlide[]} the collection of slides
	 */
	get slides() {
		return this.instance.data.lesson;
	}

	/** a image resource
	 * @returns {Object<string,Resource>} size information for an image
	 */
	get resources() {
		return this.instance.data.resources;
	}

	// /** a highlight zone in the document
	//  * @returns {Object<string,LessonZone>} the object map of zones
	//  */
	// get zones() {
	// 	return this.instance.data.zones;
	// }

	/** checks if a file path is allowed to be edited
	 * @param {string} path the path to the file
	 */
	canEditFile = path => {
		return this.files[path] !== true;
	}

	/** does this slide respond to an action
	 * @param {string} action the action to check for
	 */
	respondsTo(action) {
		return this.instance.respondsTo(action);
	}

	/** executes a controller action, if any
	 * @param {string} action the action to check for
	 * @param {...any} args the arguments to pass
	 */
	invoke(action, ...args) {
		return this.instance.invoke(action, ...args);
	}

	/** checks if there are tasks for a slide */
	get hasTasks() {
		return !!_.get(this, 'instance.controller.taskList', false);
	}

	/** returns all tasks for this controller */
	get tasks() {
		return this.instance.controller.state;
	}

	/** returns a snippet by ID */
	getSnippet = type => {
		return this.snippets[type];
	}

	/** returns a resource by path */
	getResource = path => {
		return _.find(this.resources, { path });
	}

	/** returns a definition by ID */
	getDefinition = type => {
		return this.definitions[type];
	}

	/** gets zone information for a path (and specific zone) */
	getZone = (path, id) => {
		const zones = this.getZones(path);
		return zones[id];
	}

	/** finds a zone map for the provided file
	 * @param {string} path the file to find
	 */
	getMap = path => {
		path = path.replace('$', '.');
		return this.maps[path];
	}
	
	/** finds special words and replaces them with the lesson words
	 * @param {string} message the message to update
	 * @return {string} the updated message
	 */
	replaceCustomWords = message => {
		const isArray = _.isArray(message);
		message = isArray ? message : [message];

		// update each line
		for (let i = 0, total = message.length; i < total; i++) {
			if (_.isString(message[i]))
				message[i] = message[i].replace(/\%[a-z0-9]+\%+/gi, match => {
					match = match.substr(0, match.length - 1).substr(1);
					return this.instance.state[match];
				});
		}

		// give back the result
		return isArray ? message : message[0];
	}

	/** navigates to a spcific slide, handles toggling
	 * any state changes along the way
	 * @param {number} index the slide number to navigate to
	 */
	go = async index => {
		const { lastIndex } = this;
		
		// make sure the location is valid
		if (index < 0 || index > lastIndex) 
			return;

		// leaving the active slide
		this.instance.invoke('exit');
		broadcast('leave-slide');
		this.instance.clear();
		
		// determine the new position and the 
		// delta required to navigate there
		index = _.clamp(index, 0, lastIndex);
		let current = this.index;
		const backwards = current > index;
		const direction = backwards ? -1 : 1;

		// set the starting slide
		if (_.isNumber(this.startAt)) {
			index = this.startAt;
			delete this.startAt;
		}

		// invert the current slide, if needed
		let safety = 9999;
		while (current !== index) {
			if (--safety < 0) throw 'exceeded limit';

			// invert anything existing
			if (backwards) {
				const previous = this.slides[current];
				applySlide(this, previous, true);
			}

			// adjust the position
			current += direction;

			// apply the new slide
			const next = this.slides[current];
			applySlide(this, next);
		}

		// make sure to get the target slide every time
		this.index = index;
		const { slide } = this;

		// finalize the current slide
		applySlide(this, slide);
		setActiveSlide(this, slide);
	}

	/** navigates to the next slide */
	next = async () => {

		// if we're at the end and finishing, just
		// hide the edit mode
		if (this.slide && this.slide.isLast) {
			$state.flags['open-mode'] = true;
			broadcast('lesson-finished');
		}

		// always create a restore point
		$state.createRestorePoint();

		// move to the next slide
		await this.go(this.index + 1);

		// if this is moving to the next slide, then
		// we want to go ahead and save it's done
		if (this.slide && this.slide.isLast)
			return endLesson(this);

	}
	
	// /** navigates to the previous slide */
	// previous = async () => {
	// 	const { slide } = this;
	// 	if (slide && slide.isCheckpoint) return;
	// 	return await this.go(this.index - 1);
	// }

	// /** returns temporary modified file content
	//  * @param {string} path the path of the temp file
	//  */
	// getModified = path => {
	// 	const modified = _.find(this.instance.modified, { path });
	// 	return modified ? modified.content : null;
	// }

	/** handles clean up */
	dispose = () => {
		$wait.clear();
		$focus.clear();

		// cleanup watcher events
		// disposeSlideEvents(this);
	}

}

// prepares slides in advance
function initialize(lesson) {	
	const total = _.size(lesson.slides);
	const prior = { };

	// special lesson types
	$(document.body).toggleClass('is-project-lesson', lesson.instance.data.isProject);

	_.each(lesson.slides, (slide, index) => {
		slide.id = _.uniqueId('slide:');
		slide.isLast = index === (total - 1);
		slide.isFirst = index === 0;
		slide.isQuestion = _.some(slide.choices);
		slide.isSlide = !slide.isQuestion;

		// check for a controller
		if ('controller' in slide && !lesson.instance.controllers[slide.controller])
			throw `Missing controller: ${slide.controller}`;

		// debug helper
		if ($state.isLocal && slide.start)
			lesson.startAt = index;

		if (!slide.mode)
			slide.mode = prior.mode;
		
		// if modes change, then title must be
		// manually reset
		if (slide.mode !== prior.mode)
			prior.title = null;

		if ('mode' in slide)
			prior.mode = slide.mode;

		if (!slide.title)
			slide.title = prior.title;
			
		if (!!slide.clearTitle || !!slide.hideTitle || !!slide.noTitle)
			slide.title = null;

		if ('title' in slide)
			prior.title = slide.title;

		slide.hasTitle = _.some(slide.title);
		slide.hasSubtitle = _.some(slide.subtitle);
	});

	// always create a starting restore point
	$state.createRestorePoint();
}

// sets the active slide
function setActiveSlide(lesson, slide) {
	const { index, lastIndex } = lesson;

	// remove all active highlights
	$wait.clear();
	$focus.clear();

	// // check for setting the cursor
	// if (slide.cursor)
	// 	broadcast('set-editor-cursor', slide.cursor);

	// check for markers
	setTimeout(() => {
		const markers = slide.markers || slide.marker;
		if (markers) $focus.setMarker(markers);
		
		// check for any highlights
		const highlights = slide.highlights || slide.highlight;
		if (highlights) $focus.setHighlight(highlights);
	}, 100)

	// setup the wait events
	// let wait = slide.waitFor || slide.wait;
		
	// register wait events
	// if (wait) $wait.waitFor(wait);

	// set a few other values
	// slide.isWaiting = _.some(wait) || !!slide.runValidation;
	// slide.isFirst = index === 0;
	slide.isLast = index === lastIndex;
	// slide.isCheckpoint = slide.allowBack !== true;

	// // broadcast all actions, if any
	// _.each(slide.actions, action => {
	// 	const parts = _.map(action.split(/,/g), _.trim);
	// 	broadcast.apply(null, parts);
	// });

	// set the events for this slide
	// disposeSlideEvents(lesson);
	// registerSlideEvents(lesson, slide);

	// deactivate the 

	// show the objective list if needed
	console.log(slide);
	if (slide.showObjectiveList === true || slide.showObjectiveList === false)
		broadcast('toggle-objective-list', slide.showObjectiveList);

	// let other systems know the slide changed
	lesson.instance.invoke('configure', slide);
	broadcast('slide-changed', slide);
	lesson.instance.activateSlide(slide);
	lesson.instance.invoke('enter');
	setTimeout(() => {

		// check for finalizing initialization logic
		if (!lesson._hasFinishedInit) {
			lesson._hasFinishedInit = true;
			
			// check for startup tasks
			const init = _.get(lesson, 'instance.data.init', {});

			// set default flag states
			_.each(init.flags, key => {
				$state.flag[key] = true;
			});

			_.each(init.files || init.open, path => {
				$state.flags.OPEN_FILE = true;
				$state.openFile(path);
			});
		}

		// prepare the controller
		lesson.instance.invoke('init');
		lesson.instance.invoke('ready');

	}, 100);
}

// // clears all slide events
// function disposeSlideEvents(lesson) {
// 	for (let i = lesson.events.length; i-- > 0;)
// 		remove(lesson.events.shift());
// }

// // setup all events
// function registerSlideEvents(lesson, slide) {
// 	_.each(slide.events, params => {
// 		params = _.map(params.split(','), _.trim);
// 		const key = params.shift();
// 		const action = lesson.getAction(params.shift());
// 		const args = _.map(params, arg => {
// 			console.log('convert to args', arg);
// 			return arg;
// 		});

// 		// listen for events
// 		const id = listen(key, (...event) => {
// 			const pass = [].concat(args).concat(event);
// 			action(...pass);
// 		});

// 		// save the event
// 		lesson.events.push(id);

// 	});
// }

// applies the flags for a slide
function applySlide(lesson, slide, invert) {
	if (!slide) return;

	// check for flags
	// const { flags = { }, zones = { } } = slide;
	// const { flags = { } } = slide;

	// // revert changes
	// if (invert) {

	// 	// state flags
	// 	_.each(flags.add, key => delete $state.flags[key]);
	// 	_.each(flags.remove, key => $state.flags[key] = true);

	// 	// change file states
	// 	_.each(slide.files, (flag, path) => {
	// 		if (flag === 'lock') lesson.files[path] = false;
	// 		else if (flag === 'unlock') lesson.files[path] = true;
	// 	});
		
	// }
	// else {

	// apply flags without a controller
	const flags = _.trim(slide.flags || '').split(/ +/g);
	_.each(flags, flag => {
		const add = flag.charAt(0) === '+';
		const key = flag.substr(1);
		$state.flags[key] = add;
	});


		// state flags
		// _.each(flags.add, key => $state.flags[key] = true);
		// _.each(flags.remove, key => delete $state.flags[key]);
		
		// change file states
	// 	_.each(slide.files, (flag, path) => {
	// 		if (flag === 'lock') lesson.files[path] = true;
	// 		else if (flag === 'unlock') lesson.files[path] = false;
	// 	});
	// }
	
	// // update each zone
	// _.each(slide.zones, (zones, file) => {
	// 	const map = lesson.maps[file];
	// 	_.each(zones, (state, id) => {
	// 		updateZone(map, id, state, invert);
	// 	});
	// });

}

// marks a lesson as completed
async function endLesson(lesson) {
	
	// try and update the project state
	const { projectId } = $state;
	try {
		const result = await $api.request('finish-lesson', { projectId });
		if (!result.success) throw 'finish_lesson_failed';
	}
	// if there was any error, the assistant should probably
	// let them know something went wrong
	catch(err) {
		broadcast('assistant-speak', { 
			emotion: 'sad',
			message: 'Oops! Seems like there was a problem updating the lesson!'
		});
	}

}



// // creates a cheerio object for validation
// function toCheerioObject(str, options = {}) {

// 	// just converting a cheerio object
// 	if (_.isObject(str))
// 		return Cheerio(str);

// 	// failed validation
// 	str = `<root>${str}</root>`;
// 	try {
// 		XmlChecker.check(`<?xml version="1.0" ?>${str}`);
// 	}
// 	catch (err) {
// 		return null;
// 	}

// 	// parse the html
// 	return Cheerio(str, {
// 		withDomLvl1: false,
// 		xmlMode: true
// 	});
// }