/// <reference path="./types/index.js" />

import _ from 'lodash';
import $ from 'cheerio';
import LessonManager from './lesson-manager';

/** creates a default lesson */
export default class Lesson {

	/** Handles creating an instance of a lesson
	 * @param {string} id the id of the lesson to load
	 * @returns {Lesson} an instance of a lesson
	 */
	static async load(id) {
		const instance = await LessonManager.load(id);
		return new Lesson(instance);
	}

	// creates a new lesson
	constructor(lesson) {
		this.lesson = lesson;

		// by default, start so that a navigation
		// should happen
		/** @type {number} the current slide index */
		this.index = -1;

		/** @type {number} the total number of slides to display */
		this.totalSlides = _.size(this.slides);

		// prepare the lesson for use
		initialize(this);
	}

	// set the active slide
	/** @type {LessonSlide} the active lesson slide */
	get slide() {
		return this.slides[this.index];
	}

	/** returns access to the slides and questions for this lesson
	 * @returns {LessonSlide[]} the collection of slides
	 */
	get slides() {
		return this.lesson.data.lesson;
	}

	// get snippets() {
	// 	return this.lesson.data.snippets;
	// }

	/** navigates to a spcific slide, handles toggling
	 * any state changes along the way
	 * @param {number} index the slide number to navigate to
	 */
	go = async index => {
		const lastIndex = this.totalSlides - 1;
		
		// make sure the location is valid
		if (index < 0 || index > lastIndex) 
			return;
		
		// determine the new position and the 
		// delta required to navigate there
		index = _.clamp(index, 0, lastIndex);
		let delta = index - this.index;
		const reduce = delta < 0 ? 1 : -1;
		const backwards = reduce === -1;

		// start the navigation
		while (delta !== 0) {
			console.log('app', delta);
			
			// process the slide
			const slide = this.slides[this.index + delta];
			applySlide(this, slide, backwards);
			
			// move to the next index
			delta += reduce;
		}

		// save the final index
		this.index = index;

		// update the slide with extra info
		const { slide } = this;
		slide.isFirst = index === 0;
		slide.isLast = index === lastIndex;
	}

	/** navigates to the next slide */
	next = async () => {
		return await this.go(this.index + 1);
	}
	
	/** navigates to the previous slide */
	previous = async () => {
		return await this.go(this.index - 1);
	}

}

// applies slide changes, but takes into account
// the direction of the 
function applySlide(lesson, slide, invert) {

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