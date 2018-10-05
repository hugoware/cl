/// <reference path="../types/index.js" />

import _ from 'lodash';
import $cheerio from 'cheerio';
import $xml from 'xmlchecker';
import $jquery from 'jquery';
import $state from '../state';
import $api from '../api';
import $focus from './focus';
import $wait from './wait';
import { load } from './loader';
import { broadcast } from '../events';

// can't seem to use this anywhere in a playground
window.cheerio = $cheerio;

/** creates a default lesson */
export default class Lesson {

	/** Handles creating an instance of a lesson
	 * @param {string} id the id of the lesson to load
	 * @returns {Lesson} an instance of a lesson
	 */
	static async load(project) {
		const type = await load(project.lesson);

		// get the data
		const { progress = { } } = project;
		const { state = { }, modified = [ ] } = progress;
		const utils = {

			// libraries
			_, $: $jquery,

			// parsing html snippets
			$html: (str, options = { }) => {
				
				// just converting a cheerio object
				if (_.isObject(str))
					return $cheerio(str);

				// failed validation
				str = `<root>${str}</root>`;
				try {
					$xml.check(`<?xml version="1.0" ?>${str}`); 
				}
				catch (err) {
					return null;
				}

				// parse the html
				return $cheerio(str, {
					withDomLvl1: false,
					xmlMode: true
				});
			},

			// other utilities
			getZoneContent: $state.getZoneContent
		};

		// create the lesson and save additional information
		// that's shared in other placed by the lesson
		const instance = new type(state, project, utils);
		instance.project = project;
		instance.state = state;
		instance.modified = modified;

		return new Lesson(instance);
	}

	// creates a new lesson
	constructor(lesson) {
		this.instance = lesson;

		// lock and unlock states for files
		this.files = { };

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

	/** a highlight zone in the document
	 * @returns {Object<string,LessonZone>} the object map of zones
	 */
	get zones() {
		return this.instance.data.zones;
	}

	/** checks if a file path is allowed to be edited
	 * @param {string} path the path to the file
	 */
	canEditFile = path => {
		return this.files[path] !== true;
	}

	/** finds a validator by name for the lesson
	 * @param {string} key the name of the validator
	 * @returns {function} the validation function
	 */
	getValidator = key => {
		return this.instance[key];
	}

	/** returns a snippet by ID */
	getSnippet = type => {
		const snippet = this.snippets[type];
		snippet.zones = this.zones[type];
		return snippet;
	}

	/** gets zone information for a path (and specific zone) */
	getZone = (path, id) => {
		const zones = this.getZones(path);
		return zones[id];
	}
	
	/** returns all of the zones for a file */
	getZones = path => {
		const { state, data } = this.instance;
		
		// copy the zones first
		state.zones = state.zones || { };
		
		// return the zones
		path = path.replace(/\./g, '$');
		state.zones[path] = state.zones[path] || _.assign({ }, data.zones[path]);
		return state.zones[path];
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
		
		// determine the new position and the 
		// delta required to navigate there
		index = _.clamp(index, 0, lastIndex);
		let current = this.index;
		const backwards = current > index;
		const direction = backwards ? -1 : 1;

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

		// if the lesson is over, mark it as completed
		const { slide } = this;
		if (slide && slide.isLast)
			return endLesson(this);

		// continue to the next lesson
		await this.go(this.index + 1);
		await this.saveProgress();
	}
	
	/** navigates to the previous slide */
	previous = async () => {
		const { slide } = this;
		if (slide && slide.isCheckpoint) return;
		return await this.go(this.index - 1);
	}

	/** returns temporary modified file content
	 * @param {string} path the path of the temp file
	 */
	getModified = path => {
		const modified = _.find(this.instance.modified, { path });
		return modified ? modified.content : null;
	}

	/** returns the current progress for this lesson */
	getProgress = () => {
		const { index, instance } = this;
		const { state } = instance;

		// get the active files
		const activeFile = ($state.activeFile || {}).path;
		const files = _($state.openFiles)
			.map(file => file.path)
			.value();

		// grab modified, but unsaved files
		const modified = [ ];
		_.each($state.modifiedFiles, file => {
			modified.push({ path: file.path, content: file.current });
		});

		// give back the progress info
		return { index, state, files, activeFile, modified };
	}

	/** saves the progress for the current lesson */
	saveProgress = async () => {
		const { projectId } = $state;
		const progress = this.getProgress();
		return await $api.request('set-progress', { projectId, progress });
	}

	/** handles clean up */
	dispose = () => {
		$wait.clear();
		$focus.clear();
	}

}

// prepares slides in advance
function initialize(lesson) {	
	const total = _.size(lesson.slides);
	_.each(lesson.slides, (slide, index) => {
		
		// prepare each slide
		slide.id = _.uniqueId('slide:');
		slide.isLast = index === (total - 1);
		slide.isFirst = index === 0;
		slide.isQuestion = slide.type === 'question';
		slide.isSlide = slide.type === 'slide';

		// replace any snippets
		if (slide.content)
			slide.template = $cheerio.load(slide.content);
	});
	
}

// sets the active slide
function setActiveSlide(lesson, slide) {
	const { index, lastIndex } = lesson;

	// remove all active highlights
	$wait.clear();
	$focus.clear();

	// check for markers
	const markers = slide.markers || slide.marker;
	if (markers) $focus.setMarker(markers);

	// check for any highlights
	const highlights = slide.highlights || slide.highlight;
	if (highlights) $focus.setHighlight(highlights);

	// setup the wait events
	const wait = slide.waitFor || slide.wait;
	if (wait) $wait.waitFor(wait);

	// set a few other values
	slide.isWaiting = _.some(wait);
	slide.isFirst = index === 0;
	slide.isLast = index === lastIndex;
	slide.isCheckpoint = slide.allowBack !== true;

	// broadcast all actions, if any
	_.each(slide.actions, action => {
		const parts = _.map(action.split(/,/g), _.trim);
		broadcast.apply(null, parts);
	});

	// let other systems know the slide changed
	broadcast('slide-changed', this, slide);
}


// applies the flags for a slide
function applySlide(lesson, slide, invert) {
	if (!slide) return;

	// check for flags
	const { flags = { }, zones = { } } = slide;

	if (invert) {
		_.each(flags.add, key => delete $state.flags[key]);
		_.each(flags.remove, key => $state.flags[key] = true);
		_.each(slide.files, (flag, path) => {
			if (flag === 'lock') lesson.files[path] = false;
			else if (flag === 'unlock') lesson.files[path] = true;
		});
	}
	else {
		_.each(flags.add, key => $state.flags[key] = true);
		_.each(flags.remove, key => delete $state.flags[key]);
		_.each(slide.files, (flag, path) => {
			if (flag === 'lock') lesson.files[path] = true;
			else if (flag === 'unlock') lesson.files[path] = false;
		});
	}

	// also broadcast zone updates
	_.each(zones, (changes, path) => {
		notifyZoneUpdates(lesson, path, changes, invert);
	});
}

// check for each zone update
function notifyZoneUpdates(lesson, path, zones, invert) {
	
	// update the state for each zone
	_.each(zones, (state, id) => {
		const zone = lesson.getZone(path, id);
		
		// check the collapse state
		if (/edit/.test(state))
			zone.editable = invert ? false : true;
		else if (/lock/.test(state))
			zone.editable = invert ? true : false;
		
		// check the collapse state
		if (/collapse/.test(state))
			zone.collapsed = invert ? false : true;
		else if (/expand/.test(state))
			zone.collapsed = invert ? true : false;
		
		// check the visibility state
		if (/show/.test(state))
			zone.active = invert ? false : true;
		else if (/hide/.test(state))
			zone.active = invert ? true : false;
	});

}

// marks a lesson as completed
async function endLesson(lesson) {
	
	// try and update the project state
	const { projectId } = $state;
	try {
		const result = await $api.request('finish-lesson', { projectId });
		if (!result.success) throw 'finish_lesson_failed';

		// since it worked, change to free-mode
		$state.flags['open-mode'] = true;
		broadcast('lesson-finished');
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
