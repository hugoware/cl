/// <reference path="../../../types/index.js" />
import { _, Showdown } from '../../../lib';
import $state from '../../../state';
import { applySnippets } from './snippets';
import Component from '../../../component';
import $speech from '../../../speech';
import $sound from '../../../sound';
import generateMessage from '../../../message-generator/index';

const $converter = new Showdown.Converter();

const MESSAGE_TITLE_DELAY = 1;
const DEFAULT_COUNT = 4;
const INTRO_CORRECT = `That's correct!`;
const INTRO_INCORRECT = `That's not correct.`;

export default class Question extends Component {

	constructor(assistant) {
		super({
			template: 'assistant-question',

			ui: {
				title: '.title',
				message: '.message',
				choices: '.choices',
				hint: '.hint-container .hint',
				explain: '.explain',
				showHint: '.hint-container .activate'
			}
		});

		// save the assistant reference
		this.assistant = assistant;

		// listen for answer selections
		this.on('click', '.choices .answer', this.onSelectAnswer);
		this.ui.showHint.on('click', this.onShowHint);

		// hidden by default
		this.hide();
	}

	// handles selecting the answer and displaying the result
	onSelectAnswer = event => {
		
		// don't allow another selection
		if (this.hasAnswered) return;
		this.hasAnswered = true;

		// clean up
		this.removeClass('waiting');
		this.addClass('answered');

		// determine the result
		const choice = Component.locate(event.currentTarget, '[answer-index]');
		const index = 0 | choice.attr('answer-index');
		const isCorrect = index === this.correctIndex;
		const handler = isCorrect ? this.onCorrectAnswer : this.onIncorrectAnswer;
		handler(choice);

		// update the emotion
		this.assistant.onSetEmotion(isCorrect ? 'happy' : 'sad');
		
		// check for an explanation
		const { question } = this;
		if ('explain' in question) {
			this.addClass('has-explanation');
			const intro = isCorrect ? INTRO_CORRECT : INTRO_INCORRECT;
			const message = _.flatten([intro, 300, this._explain.speak]);
			$speech.speak(message);
		}
	}

	refresh() {
		// TODO: still happens
		// console.log('not a thing');
	}

	/** handles updating the view with slide content 
	 * @param {LessonSlide} content the content to display
	*/
	setContent = async question => {
		this.question = question;
		this.hasAnswered = false;
		
		// set the initial view
		this.removeClass('correct incorrect answered has-hint has-explanation show-hint');
		this.addClass('waiting');

		// check for a hint options
		if ('hint' in question)
			this.addClass('has-hint');

		// get the choices
		const { choices } = question;
		const correct = choices[0];
		let remaining = choices.slice(1);
		remaining = _.shuffle(remaining);

		// create the answers to show
		const total = _.size(choices);
		const collect = _.isNumber(question.count) ? question.count : Math.min(total, DEFAULT_COUNT);

		// update additional information
		const title = generateMessage(question.title);
		this.ui.title.html(title.content);

		const hint = generateMessage(question.hint);
		this.ui.hint.html(hint.content);
		
		const explain = generateMessage(question.explain);
		this.ui.explain.html(explain.content);
		this._explain = explain;

		const message = generateMessage(question.content);
		this.ui.message.html(message.content);

		// display the result
		applySnippets(this, $state.lesson);

		// speak both the title and message -- if there's
		// both, make sure to delay slightly
		const delay = _.some(title.speak) && _.some(message.speak) ? MESSAGE_TITLE_DELAY : 0;
		const speak = _.flatten([ title.speak, delay, message.speak ]);
		$speech.speak(speak);
		
		// use neutral
		this.assistant.onSetEmotion();

		// empty out old answers
		this.ui.choices.empty();

		// finally, add each item as an option
		_([correct].concat(remaining))
			.slice(0, collect)
			.shuffle()
			.each((answer, index) => {
				answer = _.toString(answer);
				
				// the correct answer
				if (answer === correct)
					this.correctIndex = index;

				// add the option
				const choice = document.createElement('div');
				choice.className = 'answer';
				choice.setAttribute('answer-index', index);
				choice.innerHTML = $converter.makeHtml(answer);
				this.ui.choices.append(choice);
			});

	}

	// displays a hint, if any
	onShowHint = () => {
		this.addClass('show-hint');
	}

	// when the correct answer is selected
	onCorrectAnswer = selection => {
		$sound.success();
		this.addClass('correct answered');
		selection.addClass('selected');
	}
	
	// when the incorrect answer is selected
	onIncorrectAnswer = selection => {
		$sound.error();
		this.addClass('incorrect answered');
		selection.addClass('selected');
		
		// select the correct answer
		const correct = this.find(`[answer-index="${this.correctIndex}"]`);
		correct.addClass('correct');
	}

}