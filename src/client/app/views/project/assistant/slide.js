/// <reference path="../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../state';
import $editor from '../../../editor';
import $showdown from 'showdown';
import Component from '../../../component';

const $convert = new $showdown.Converter();

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

	// replaces the text for the view
	setContent = message => {
		
		// get rid of the titles
		this.toggleClassMap({
			'has-title': false,
			'has-subtitle': false
		});

		// replace the content
		const html = $convert.makeHtml(message);
		this.ui.message.html(html);
	}

}



// attach each snippet
function applySnippets(slide ,lesson) {

	// replace all snippets
	const snippets = slide.find('.snippet');
	snippets.each((index, element) => {

		// create the target for styling
		const example = document.createElement('div');
		element.appendChild(example);

		// update the element
		const type = element.getAttribute('type');
		const highlight = _.trim(element.getAttribute('highlight')).split(/ +/g);
		const snippet = lesson.snippets[type];
		$editor.colorize(example, { snippet, highlight });
	});
	
}