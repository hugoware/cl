/// <reference path="../../../types/index.js" />

import { _ } from '../../../lib';
import $sound from '../../../sound';
import $state from '../../../state';
import $speech from '../../../speech';
import $wait from '../../../lesson/wait';

import generateMessage from '../../../message-generator';
import Component from '../../../component';
import Slide from './slide';
import Question from './question';

// minimum time per slide before allowing next
// mostly to prevent double clicks
const MINIMUM_MS_PER_SLIDE = $state.isLocal ? 0 : 1000;

// speech options
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
		this.listen('lesson-finished', this.onFinishLesson);
		this.listen('slide-changed', this.onSlideChanged);
		this.listen('set-message', this.onSetMessage);
		this.listen('set-emotion', this.onSetEmotion);
		this.listen('block-next', this.onBlockNext);
		this.listen('allow-next', this.onAllowNext);
		this.listen('progress-next', () => this.onNext(true));
		
		this.on('click', '.next', this.onNext);
		
		// this.listen('slide-wait-for-result', this.onSlideWaitForResult);
		// this.listen('save-file', this.onSaveFile);
		// this.listen('modify-file', this.onModifyFile);
		// this.listen('code-execution-approval', this.onCodeExecutionApproval);
		// this.on('click', '.previous', this.onPrevious);

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

	// // decides what to do with a result
	// onSlideWaitForResult = success => {
		
	// 	// just enable/disable the next button
	// 	if ($state.lesson.slide.autoNext === false)
	// 		this.toggleClass('is-waiting', !success);

	// 	// go to the next slide
	// 	else if (success)
	// 		this.onNext();
	// }

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
		this.notifyAssistantUpdate();
	}

	// display the popup message again
	onRestorePopUp = () => {
		this.removeClass('hide-popup');
		this.notifyAssistantUpdate();
	}
	
	// hides the popup message
	onHidePopUp = () => {
		this.addClass('hide-popup');
		this.notifyAssistantUpdate();
	}

	// // sync the lesson state
	// onSaveFile = () => {
	// 	if ($state.lesson)
	// 		$state.lesson.saveProgress();
	// }

	// // code execution approval can allow the
	// // assistant to move forward
	// onCodeExecutionApproval = () =>
	// 	this.onApprove();

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

	// // if the file is changed, always revert any
	// // success messages
	// onModifyFile = (...args) => {

	// 	$state.lesson.invoke('contentChanged', ...args); 
	// 	console.log(this.lesson);
	// 	// this.addClass('is-waiting');
	// 	// this.views.slide.hideFollowUp();
	// 	// $wait.reactivate();
	// }

	// finished with the assistant
	onFinishLesson = () => {
		this.addClass('leave');
		$speech.stop();
		setTimeout(() => {
			this.hide();
			this.notifyAssistantUpdate();
		}, 1000);
	}

	// activates
	onActivateProject = async () => {
		this.slideIndex = null;

		// test if there's a lesson to display
		const hasLesson = !!$state.lesson;
		this.toggleClass('active', hasLesson);
		if (!hasLesson) return;

		// // set the speech handler
		// $state.lesson.instance.onSetMessage = this.onSetMessage;
		// $state.lesson.instance.onRevert = this.onRevert;
		// $state.lesson.instance.onApprove = this.onApprove;
		// $state.lesson.instance.onHint = this.onHint;

		// check for existing progress
		let index = 0;
		// let files = [ ];
		// const { progress } = $state.project;
		// if (progress) {
		// 	files = _.isArray(progress.files) ? progress.files : [ ];

		// 	// set the starting frame
		// 	index = 0 | (progress.index || 0);
		// 	if (isNaN(index)) index = 0;
		// }

		// go to the correct frame
		await $state.lesson.go(index);

		// since there's a lesson, set current state info
		this.refresh();
		this.show();

		// // check for files to open
		// const active = progress.activeFile || files[0];

		// // activate the main file, if possible
		// if (active) {
		// 	const file = $state.findItemByPath(active);
		// 	if (file) this.broadcast('activate-file', file);
		// }

		// // just open remaining files
		// for (let i = files.length; i-- > 0;)
		// 	if (files[i] !== active) {
		// 		const file = $state.findItemByPath(files[i]);
		// 		if (file) this.broadcast('open-file', file);
		// 	}

	}

	// hide when leaving the project editor
	onDeactivateProject = () => {
		if ($speech.active) $speech.stop();
		this.slideIndex = null;
		this.notifyAssistantUpdate();
		this.hide();
	}

	// handle button navigation
	onNext = async force => {

		// don't allow clicking forward too fast
		const now = +new Date;
		if (!force && this.nextNavigate > now)
			return;

		// save the timing
		this.nextNavigate = now + MINIMUM_MS_PER_SLIDE;

		// go to the next slide
		await $state.lesson.next();
		this.refresh();
	}
	
	// onPrevious = async () => {
	// 	await $state.lesson.previous();
	// 	this.refresh();
	// }

	// let the app know the assistant changed
	notifyAssistantUpdate = () => {
		setTimeout(() => this.broadcast('assistant-updated'));
	}

	// refresh the display for this slide
	refresh = async () => {

		// lesson has been disabled
		if (!$state.lesson) return;

		// // make sure the popup is visible
		// this.removeClass('hide-popup');
		// this.notifyAssistantUpdate();

		// // make sure the slide changed
		// const index = $state.lesson.index;
		// if (index === this.slideIndex) return;
		// this.slideIndex = index;

		// update slide content
		const { slide } = $state.lesson;
		const { view } = this;

		// // determine the mode to use
		// const mode = slide.mode || 'popup';
		// this.toggleClassMap({
		// 	popup: mode === 'popup',
		// 	overlay: mode === 'overlay',
		// 	// 'is-last': slide.isLast,
		// 	// 'is-first': slide.isFirst,
		// 	// 'is-waiting': slide.isWaiting,
		// 	// 'is-checkpoint': slide.isCheckpoint,
		// });

		// // pick the emotion, if any
		// // this.onSetEmotion(slide.emotion);

		// // // hide the follow up message, if any
		// // this.views.slide.hideFollowUp();

		

		// // update the content
		view.refresh(slide);

		// // this.views.slide.hasUsedOverrideMessage = false;

		// // wait for speaking to stop
		// await $speech.stop();

		// // start speaking
		// this.speak(slide.speak);
		// this.nextAllowRevertTime = (+new Date) + 1000;
	}

	// // handles moving to the next slide
	// onApprove = (message, emotion, options = { }) => {

	// 	// all done - automatically continue
	// 	if ($state.lesson.slide.autoNext !== false)
	// 		return this.onNext();

	// 	// release the waiting 
	// 	this.toggleClassMap({
	// 		'is-waiting': false,
	// 		'has-follow-up': !!message
	// 	});
		
	// 	// say the message, if anything
	// 	if (message)
	// 		this.onSetMessage({ message, emotion });
	// }

	// // returns the message to the original state
	// onRevert = () => {
	// 	if (this.nextAllowRevertTime > +new Date) return;
	// 	this.views.slide.revert();
	// 	this.notifyAssistantUpdate();
	// 	$speech.stop();
	// }

	// // handles updating hint messages
	// onHint = options => {
	// 	this.broadcast('show-hint', options);
	// }

	onSlideChanged = slide => {

		// set the view type
		const isPopup = slide.mode !== 'overlay';
		this.toggleClassMap({
			popup: isPopup,
			overlay: !isPopup,
		});

		// show the correct view
		const { view } = this;
		_.each(this.views, view => view.hide());
		view.show();

		// update labels as needed
		this.find('.next').text(slide.isLast ? 'Finish' : 'Next');

		// check for initial content
		if (slide.isQuestion)
			this.view.setContent(slide);

		else {	
			this.onSetMessage({ message: slide.content });

			// apply emotions, if any - if not, this'll
			// reset the emotion
			this.onSetEmotion(slide.emotion || slide.emote);
		}

	}

	// listens for extra speech events
	onSetMessage = (options = { }) => {
		
		// require a message
		const hash = _.snakeCase(options.message);
		if (!_.some(hash) || (this._hash === hash && !options.force))
			return;

		// save this so not to do it twice
		this._hash = hash;

		// update the message
		const { content, speak } = generateMessage(options.message);
		this.view.setContent(content, true);

		// speakinga  message
		if (!options.silent)
			$speech.speak(speak);

		// set the emotion, if any
		if (options.emote || options.emotion)
			this.onSetEmotion(options.emote || options.emotion);
	}

	/** replaces the emotion for the assistant
	 * @param {string} emotion the emotion to show
	 */
	onSetEmotion = emotion => {
		this.ui.avatar.toggleClassMap({
			happy: emotion === 'happy',
			sad: emotion === 'sad',
			surprised: emotion === 'surprised'
		});
	}

	// allow moving to the next step
	onAllowNext = () => {
		this.toggleClass('is-waiting', false);
	}
	
	// prevent moving to the next step
	onBlockNext = () => {
		this.toggleClass('is-waiting', true);
	}

}
