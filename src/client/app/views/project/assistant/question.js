/// <reference path="../../../types/index.js" />

import Component from '../../../component';

export default class Question extends Component {

	constructor() {
		super({
			template: 'assistant-question'
		});

		// hidden by default
		this.hide();
	}

	/** handles updating the view with slide content 
	 * @param {LessonSlide} content the content to display
	*/
	refresh(content) {

	}

}