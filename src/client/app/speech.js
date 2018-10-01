
import _ from 'lodash';
import { listen, broadcast } from './events';
const available = 'speechSynthesis' in window;

// activate text to speech
if (available)
	speechSynthesis.onvoiceschanged = () => {
		$speech.voices = speechSynthesis.getVoices();
		$speech.ready = _.some($speech.voices);

		// set the default voice
		$speech.configure({
			voice: /google us english/i,
			pitch: 1
		});

		// trigger anything that might be waiting
		if ($speech.init.pending)
			$speech.init.pending();
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
		talk.lang = 'en-US';
		talk.voice = $speech.config.voice;
		talk.pitch = $speech.config.pitch;
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

		// set the voice to use
		if (options.voice) {

			// finds the preferred voice
			$speech.voice = _.filter($speech.voices, voice => {
				if (voice.name.match(options.voice))
					$speech.config.voice = voice;
			});
		}

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
