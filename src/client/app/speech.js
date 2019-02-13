
import { _, $ } from './lib';
import { listen, broadcast } from './events';
import $state from './state';
const available = 'speechSynthesis' in window;

// activate text to speech
if (available)
	speechSynthesis.onvoiceschanged = () => {
		$(() => {
			$speech.voices = speechSynthesis.getVoices();
			$speech.ready = _.some($speech.voices);

			// set the default voice
			$speech.configure({ style: 'female' });

			// trigger anything that might be waiting
			if ($speech.init.pending)
				$speech.init.pending();
		});
	};

// proceeed to the next line of dialogue
function next() {
	$speech.synth.cancel();

	// check for active speech
	if (!$speech.active)
		return;
	
	// get the message to display
	const { dialogue, id } = $speech.active;
	const command = dialogue[$speech.active.index++];

	// create a resume function that checks the ID of
	// the active text object and only resumes if it's
	// the same as the previous attempt
	function continueSpeaking() {
		const currentId = $speech.active && $speech.active.id;
		if (id !== currentId) return;
		next();
	}

	// if all out of work
	if (!command) {
		delete $speech.active;
		return broadcast('speech-done');
	}

	// this is a reading delay
	if (_.isNumber(command))
		return setTimeout(continueSpeaking, command);

	// create the speech
	try {
		const talk = new SpeechSynthesisUtterance();
		const voice = getVoice($speech.config.style);

		// couldn't find a voice to use, just skip
		if (!voice) return;

		// set the voice params
		talk.voice = voice;
		talk.lang = voice.lang;
		talk.rate = 1;
		talk.text = command;
		
		// setup events
		talk.onend = () => continueSpeaking();
		
		// start the speaking
		$speech.active.talk = talk;
		$speech.paused = false;
		$speech.synth.speak(talk);
	}
	// don't stop the lesson if this fails
	catch (ex) {
		console.warn('unable to start speech', ex);
	}

}

// create the speech object
const $speech = {
	available,
	synth: window.speechSynthesis,

	// configured values
	config: { },

	// state
	enabled: true,
	ready: false,

	/** initializes the speech engine */
	init: async () => {
		return new Promise(async (resolve, reject) => {

			// make sure it's allowed
			if (!$speech.available)
				return reject('speech-disabled');

			// if already enabled
			if ($speech.ready)
				return resolve();
				
			// time limit for speech access
			const timeout = setTimeout(() => {
				delete $speech.init.pending;
				return reject('speech-timeout');
			}, 2000);

			// wait for the event
			$speech.init.pending = () => {
				clearTimeout(timeout);
				resolve();
			};
		});	
	},

	/** updates the configuration for the voice */
	configure: options => {
		_.assign($speech.config, options);
	},

	/** stops the current speech attempt */
	// stop speaking entirely
	stop: () => {
		// run events, if needed
		try {
			if ($speech.active)
				broadcast('speech-ended', $speech.active)
		}
		// clean up
		finally {
			delete $speech.active;
			$speech.synth.cancel();
		}

		return new Promise(resolve => {
			setTimeout(() => resolve(), 10);
		});
	},


	// pause the speech
	pause: () => {
		if (!$speech.active) return;
		$speech.synth.pause();
		$speech.paused = true;
	},

	// continue speaking
	resume: () => {
		if (!$speech.active) return;
		$speech.synth.resume();
	},

	/** starts speaking a new message
	 * @param {SpeechCommand[]} message the message to speak
	 */
	speak: message => {
		$speech.stop();

		// replace custom words
		if ($state.lesson)
			message = $state.lesson.replaceCustomWords(message);
		
		// speaking is not allowed
		if (!$speech.enabled)
			return;

		// should be an array of messages to speak
		if (!_.isArray(message))
			message = [ message ];

		// set the next phrase to speak
		$speech.active = { 
			id: _.uniqueId('speech:'),
			dialogue: message,
			index: 0
		};

		// queue up the speech
		setTimeout(next, 100);
	}

};

// tries to find the preferred voice
function getVoice(type) {
	let fallback1;
	let fallback2;

	// get the voice set preferred
	const prefer = type === 'female'
		? [ /google us/i, /samantha/i, /victoria/i ]
		: [ /google uk english male/i, /alex/i, /fred/i ];

	// check each voice
	for (let i = 0, total = $speech.voices.length; i < total; i++) {
		const voice = $speech.voices[i];

		// if it's the primary match, then we're done
		if (voice.name.match(prefer[0]))
			return voice;

		// check alt options
		if (voice.name.match(prefer[1]))
			fallback1 = voice;
		else if (voice.name.match(prefer[2]))
			fallback2 = voice;
	}

	// didn't find primary, return something
	return fallback1 || fallback2;
}

// stop the text
listen('window-unload', () => {
  $speech.stop();
});

// tracking an active message
setInterval(() => {
  if (!$speech.active) return;
  if (!$speech.paused) speechSynthesis.resume();
}, 14000);


export default $speech;
