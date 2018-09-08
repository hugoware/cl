/// <reference path="../types/index.js" />

import _ from 'lodash';
import $ from 'cheerio';
import $state from '../state';
import $focus from './focus';
import $wait from './wait';
import { load } from './loader';

/** creates a default lesson */
export default class Lesson {

	/** Handles creating an instance of a lesson
	 * @param {string} id the id of the lesson to load
	 * @returns {Lesson} an instance of a lesson
	 */
	static async load(id) {
		const type = await load(id);
		const instance = new type($state);
		return new Lesson(instance);
	}

	// creates a new lesson
	constructor(lesson) {
		this.instance = lesson;

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

	// get snippets() {
	// 	return this.instance.data.snippets;
	// }

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

		// helper?
		console.log($state.flags);

		// save the final index

		// update the slide with extra info

	}

	/** navigates to the next slide */
	next = async () => {
		return await this.go(this.index + 1);
	}
	
	/** navigates to the previous slide */
	previous = async () => {
		const { slide } = this;
		if (slide && slide.isCheckpoint) return;
		return await this.go(this.index - 1);
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
			slide.template = $.load(slide.content);
	});
	
}

// sets the active slide
function setActiveSlide(lesson, slide) {
	const { index, lastIndex } = lesson;

	// remove all active highlights
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
	slide.isCheckpoint = slide.checkpoint === true;
}


// applies the flags for a slide
function applySlide(lesson, slide, invert) {
	if (!slide) return;

	// check for flags
	const { flags = {} } = slide;
	console.log('wants to apply', slide, flags);

	if (invert) {
		_.each(flags.add, key => delete $state.flags[key]);
		_.each(flags.remove, key => $state.flags[key] = true);
	}
	else {
		_.each(flags.add, key => $state.flags[key] = true);
		_.each(flags.remove, key => delete $state.flags[key]);
	}
}
