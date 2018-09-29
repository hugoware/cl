/// <reference path="../../../types/index.js" />

import _ from 'lodash';
import $state from '../../../state';
import $speech from '../../../speech';
import Component from '../../../component';
import Slide from './slide';
import Question from './question';

const SPEECH_ENABLEMENT_CONFIG = 'speech-enablement';
const SPEECH_ENABLED = 'on';
const SPEECH_DISABLED = 'off';

export default class Assistant extends Component {

	constructor() {
		super({
			template: 'assistant',

			ui: {
				assistant: '.assistant',
				avatar: '.avatar',
				dialog: '.dialog',
				panel: '.panel',
				toggleSpeech: '.toggle',
				showPanel: '.show-panel',
				hide: '.hide'
			},
		});

		// create shared instances
		this.views = {
			slide: new Slide(this),
			question: new Question(this)
		};

		// attach each view
		_.each(this.views, view => view.appendTo(this.ui.panel));

		// hidden by default
		this.hide();

		// this is attached 
		this.listen('reset', this.onReset);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('slide-wait-for-result', this.onSlideWaitForResult);
		this.listen('assistant-speak', this.onSpeak);
		this.listen('lesson-finished', this.onFinishLesson);
		this.listen('save-file', this.onSaveFile);
		this.on('click', '.next', this.onNext);
		this.on('click', '.previous', this.onPrevious);

		// set the speech enablement
		this.ui.showPanel.on('mouseover', this.onRestorePopUp);
		this.ui.hide.on('click', this.onHidePopUp);
		this.ui.toggleSpeech.on('click', '.enable', this.onEnableSpeech);
		this.ui.toggleSpeech.on('click', '.disable', this.onDisableSpeech);

		// get the default enablement state
		const enabled = window.localStorage && localStorage.getItem(SPEECH_ENABLEMENT_CONFIG) !== SPEECH_DISABLED;
		this.setSpeech(!!enabled);

	}

	// returns the current view
	get view() {
		const { slide } = $state.lesson;
		return slide.isQuestion ? this.views.question : this.views.slide
	}

	// decides what to do with a result
	onSlideWaitForResult = success => {
		
		// just enable/disable the next button
		if ($state.lesson.slide.autoNext === false)
			this.toggleClass('is-waiting', !success);

		// go to the next slide
		else if (success)
			this.onNext();
	}

	// enables speech
	onEnableSpeech = () => {
		this.setSpeech(true);
	}

	// disables speech
	onDisableSpeech = () => {
		$speech.stop();
		this.setSpeech(false);
	}

	// hides the assistant
	onReset = () => {
		this.removeClass('leave');
		this.hide();
	}

	// display the popup message again
	onRestorePopUp = () => {
		this.removeClass('hide-popup');
	}

	// hides the popup message
	onHidePopUp = () => {
		this.addClass('hide-popup');
	}

	// sync the lesson state
	onSaveFile = () => {
		$state.lesson.saveProgress();
	}

	/** changes the speech enablement mode
	 * @param {boolean} enabled should speech be enabled or not
	 */
	setSpeech = enabled => {
		this.ui.toggleSpeech.toggleClass('enabled', !!enabled);
		this.ui.toggleSpeech.toggleClass('disabled', !enabled);
		
		// change the storage option
		if (window.localStorage)
			localStorage.setItem(SPEECH_ENABLEMENT_CONFIG, enabled ? SPEECH_ENABLED : SPEECH_DISABLED);

		// stop speaking, if needed
		$speech.enabled = enabled;
		if (!enabled)
			$speech.stop();
	}

	// finished with the assistant
	onFinishLesson = () => {
		this.addClass('leave');
		$speech.stop();
		setTimeout(this.hide, 1000);
	}

	// activates
	onActivateProject = async () => {
		this.slideIndex = null;

		// test if there's a lesson to display
		const hasLesson = !!$state.lesson;
		this.toggleClass('active', hasLesson);
		if (!hasLesson) return;

		// set the speech handler
		$state.lesson.instance.onSpeak = this.onSpeak;
		$state.lesson.instance.onRevert = this.onRevert;

		// check for existing progress
		let index = 0;
		let files = [ ];
		const { progress } = $state.project;
		if (progress) {
			files = _.isArray(progress.files) ? progress.files : [ ];

			// set the starting frame
			index = 0 | (progress.index || 0);
			if (isNaN(index)) index = 0;
		}

		// go to the correct frame
		await $state.lesson.go(index);

		// since there's a lesson, set current state info
		this.refresh();
		this.show();

		// check for files to open
		const active = progress.activeFile || files[0];

		// activate the main file, if possible
		if (active) {
			const file = $state.findItemByPath(active);
			if (file) this.broadcast('activate-file', file);
		}

		// just open remaining files
		for (let i = files.length; i-- > 0;)
			if (files[i] !== active) {
				const file = $state.findItemByPath(files[i]);
				if (file) this.broadcast('open-file', file);
			}

	}

	// hide when leaving the project editor
	onDeactivateProject = () => {
		if ($speech.active) $speech.stop();
		this.slideIndex = null;
		this.hide();
	}

	// handle button navigation
	onNext = async () => {
		await $state.lesson.next();
		this.refresh();
	}
	
	onPrevious = async () => {
		await $state.lesson.previous();
		this.refresh();
	}

	// refresh the display for this slide
	refresh = () => {

		// lesson has been disabled
		if (!$state.lesson) return;

		// make sure the popup is visible
		this.removeClass('hide-popup');

		// make sure the slide changed
		const index = $state.lesson.index;
		if (index === this.slideIndex) return;
		this.slideIndex = index;

		// update slide content
		const { slide } = $state.lesson;
		const { view } = this;

		// determine the mode to use
		const mode = slide.mode || 'popup';
		this.toggleClassMap({
			popup: mode === 'popup',
			overlay: mode === 'overlay',
			'is-last': slide.isLast,
			'is-first': slide.isFirst,
			'is-waiting': slide.isWaiting,
			'is-checkpoint': slide.isCheckpoint,
		});

		// update labels as needed
		this.find('.next').text(slide.isLast ? 'Finish' : 'Next');

		// pick the emotion, if any
		this.setEmotion(slide.emotion);

		// show the correct view
		_.each(this.views, view => view.hide());
		view.show();

		// update the content
		view.refresh(slide);

		// speak, if possible
		this.speak(slide.speak);
	}

	// returns the message to the original state
	onRevert = () => {
		this.views.slide.revert();
	}

	// listens for extra speech events
	onSpeak = (options = { }) => {
		const message = _.trim(options.message);
		if (!_.some(message)) return;

		// force the slide mode if something is requesting
		// a speech message
		this.views.question.hide();
		this.views.slide.show();

		// check if there's a revert value -- this means
		// we're bouncing between success and completion messages
		// so we shouldn't speak too many times
		const allowSpeech = !this.views.slide.hasRevert;

		// TODO: this is kinda ugly -- to get the formatted
		// text we're grabbing the text value from the node
		// update the slide content
		// replace the content
		this.views.slide.setContent(message, true);

		// speak and update the emotion, if any
		if ('emotion' in options)
			this.setEmotion(options.emotion);

		// check if speaking
		if (!allowSpeech) return;
		const speak = this.views.slide.ui.message.text();
		this.speak([ speak ]);
	}

	/** replaces the emotion for the assistant
	 * @param {string} emotion the emotion to show
	 */
	setEmotion = emotion => {
		this.ui.avatar.toggleClassMap({
			happy: emotion === 'happy',
			sad: emotion === 'sad',
			surprised: emotion === 'surprised'
		});
	}

	/** speaks a message using the assistant
	 * @param {string} message the message to speak
	 */
	speak = message => {
		if ($speech.enabled && _.some(message))
			$speech.speak(message);
	}

}
