/// <reference path="../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../state';
import $editor from '../../../editor';
import $highlight from 'highlightjs';
import Component from '../../../component';

export default class Slide extends Component {

	constructor() {
		super({
			template: 'assistant-slide',

			ui: {
				title: '.title',
				subtitle: '.subtitle',
				message: '.message',
			}
		});

		// hidden by default
		this.hide();
	}

	/** handles updating the view with slide content 
	 * @param {LessonSlide} slide the slide to display
	*/
	refresh(slide) {

		// check for button visibility
		this.toggleClassMap({
			'is-first': slide.isFirst,
			'is-last': slide.isLast,
			'has-title': 'title' in slide,
			'has-subtitle': 'subtitle' in slide,
		});

		// set the content
		this.ui.message.html(slide.content);
		this.ui.title.text(slide.title);
		this.ui.subtitle.text(slide.subtitle);

		// check for hover definitions
		applySnippets(this, $state.lesson);
	}

}



// attach each snippet
function applySnippets(slide ,lesson) {

	// replace all snippets
	const snippets = slide.find('.snippet');
	snippets.each((index, element) => {
		// const type = element.getAttribute('type');
		// const highlight = _.trim(element.getAttribute('highlight')).split(/ +/g);
		// const snippet = lesson.snippets[type];
		// $editor.colorize(element, { snippet, highlight });
	});
	
}