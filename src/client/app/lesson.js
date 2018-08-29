import LessonManager from './lesson-manager'

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
	}

	/** navigates to a spcific slide, handles toggling
	 * any state changes along the way
	 * @param {number} slide the slide number to navigate to
	 */
	go = slide => {
		
	}

}