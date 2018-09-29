/// <reference path="../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../state';
import { applySnippets } from './snippets';
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

	/** restores the old content without speaking it */
	revert() {
		this.ui.message.html(this._revert);
	}

	/** replaces the content for the view
	 * @param {string} message a markdown themed content message
	 * @param {boolean} [saveRevert] should this save a revert version 
	 */
	setContent = (message, saveRevert) => {

		// save the revert text, if any
		delete this._revert;
		if (saveRevert)
			this._revert = this.ui.message.html();
		
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
