/// <reference path="../../../types/index.js" />

import { _ } from '../../../lib';
import $state from '../../../state';
import { applySnippets } from './snippets';
import Component from '../../../component';

export default class Slide extends Component {

	constructor() {
		super({
			template: 'assistant-slide',

			ui: {
				title: '.title',
				subtitle: '.subtitle',
				message: '.message',
				followUp: '.follow-up',
			}
		});

		// hidden by default
		this.hide();
	}

	/** checks if there's a reverted value already set
	 * @returns {boolean} there's a revert value
	 */
	get hasRevert() {
		return '_revert' in this;
	}

	/** handles updating the view with slide content 
	 * @param {LessonSlide} slide the slide to display
	*/
	refresh(slide) {
		this.slide = slide;
		this.isUsingOverrideMessage = false;

		// check for button visibility
		this.toggleClassMap({
			'is-first': slide.isFirst,
			'is-last': slide.isLast,
			'has-title': 'title' in slide,
			'has-subtitle': 'subtitle' in slide,
		});

		// update as needed
		const content = slide.content && $state.lesson.replaceCustomWords(slide.content);
		const title = slide.title && $state.lesson.replaceCustomWords(slide.title);
		const subtitle = slide.subtitle && $state.lesson.replaceCustomWords(slide.subtitle);

		// set the content
		this.ui.message.html(content);
		this.ui.title.text(title);
		this.ui.subtitle.text(subtitle);

		// check for hover definitions
		applySnippets(this, $state.lesson);
	}

	/** hides the follow up message, if any */
	hideFollowUp() {
		this.removeClass('has-follow-up');
	}

	/** restores the old content without speaking it */
	revert() {
		this.refresh(this.slide);
		this.isUsingRevertMessage = true;
	}

	/** find the appropriate message to speak */
	getMessage() {
		return this.ui.followUp.is(':visible')
			? this.ui.followUp.text()
			: this.ui.message.text();
	}

	/** replaces the content for the view
	 * @param {string} message a markdown themed content message
	 */
	setContent = (html, isFollowUp) => {
		// this.isUsingRevertMessage = false;
		
		// get rid of the titles
		this.toggleClassMap({
			'has-title': false,
			'has-subtitle': false
		});

		// replace custom words
		// if ($state.lesson)
		// 	html = $state.lesson.replaceCustomWords(message);

		// set follow up message values
		// this.toggleClass('has-follow-up', isFollowUp);

		// replace the content
		// const html = $convert.makeHtml(message);
		// const target = isFollowUp ? this.ui.followUp : this.ui.message;
		this.ui.message.html(html);
	}

}
