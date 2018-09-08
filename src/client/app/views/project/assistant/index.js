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
				toggleSpeech: '.toggle'
			},
		});

		// create shared instances
		this.views = { 
			slide: new Slide(),
			question: new Question()
		};

		// attach each view
		_.each(this.views, view => view.appendTo(this.ui.panel));

		// hidden by default
		this.hide();

		// this is attached 
		this.listen('clear-project', this.onClearProject);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('next-slide', this.onNext);
		this.on('click', '.next', this.onNext);
		this.on('click', '.previous', this.onPrevious);

		// set the speech enablement
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
	onClearProject = () => {
		this.hide();
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

	// activates
	onActivateProject = async () => {

		// test if there's a lesson to display
		const hasLesson = !!$state.lesson;
		this.toggleClass('active', hasLesson);
		if (!hasLesson) return;

		// set the speech handler
		$state.lesson.instance.onSpeak = this.onSpeak;

		// since there's a lesson, set current state info
		await $state.lesson.go(0);
		this.refresh();
		this.show();
	}

	// hide when leaving the project editor
	onDeactivateProject = () => {
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

	// listens for extra speech events
	onSpeak = (options = { }) => {
		const message = _.trim(options.message);
		if (!_.some(message)) return;

		// TODO: this is kinda ugly -- to get the formatted
		// text we're grabbing the text value from the node
		// update the slide content
		// replace the content
		this.views.slide.setContent(message);
		const speak = this.views.slide.ui.message.text();
		this.speak([ speak ]);

		// speak and update the emotion, if any
		if ('emotion' in options)
			this.setEmotion(options.emotion);
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
