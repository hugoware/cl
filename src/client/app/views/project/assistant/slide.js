/// <reference path="../../../types/index.js" />

import focus from '../focus';
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

		// check for markers
		const markers = slide.markers || slide.marker;
		if (markers) focus.setMarker(markers);

		// check for any highlights
		const highlights = slide.highlights || slide.highlight;
		if (highlights) focus.setHighlight(highlights);

	}

}