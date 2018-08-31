
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



// import _ from 'lodash';
// import { listen, broadcast } from '~/app/events';

// // speech api
// const $speech = {
//   allowed: false,
//   // allowed: true,
//   speechSynthesis: window.speechSynthesis,
//   enabled: !!window.speechSynthesis,
//   // enabled: false,
  
//   // configuration values
//   config: {
//     rate: 8,
//     pitch: 1
//   }
// };

// // toggle status
// $speech.enable = () => $speech.allowed = true;
// $speech.disable = () => {
//   $speech.allowed = false;
//   $speech.stop();
// }

// // configure the speech helper
// $speech.configure = params => {

//   // set the voice to use
//   if (params.voice) {

//     // finds the preferred voice
//     $speech.voice = _.filter($speech.voices, voice => {
//       if (voice.name.match(params.voice))
//         $speech.config.voice = voice;
//     });
//   }

//   // assign other values
//   else _.assign($speech.config, params);
// };


// // clean up speech to make it read better
// $speech.sanitize = text => {
//   text = _.trim(text);

//   text = text.replace(/\n+/g, '.\n\n')
//     .replace(/ h1 /g, ' h one ')
//     .replace(/ img /g, ' image ')
//     .replace(/ \/ /g, ' forward slash ')
//     .replace(/ \\ /g, ' back slash ')
//     .replace(/</g, 'less than')
//     .replace(/>/g, 'greater than')
//     .replace(/_/g, 'underscore')
//     // .replace(/[^0-9]:[^0-9]/gi, '.')
//     // .replace(/[^a-z0\-' \n]/gi, '.')
//     .replace(/ +/g, ' ');
//   return text;
// };


// // speaks a message
// $speech.speak = (text, config = { }) => {
//   if (!$speech.allowed) return;
  
//   // can't use speech
//   if (!$speech.enabled) {
//     if (config.onError)
//       config.onError('voice-disabled');
//     return;
//   }

//   // clear the current
//   if ($speech.active) {
//     try {
//       $speech.stop();

//       // wait a moment before starting
//       setTimeout(() => $speech.speak(text, config), 100);
//     }
//     catch (e) { }
//   }

//   // create the speech
//   const speech = new SpeechSynthesisUtterance();
//   speech.lang = 'en-US';
//   speech.voice = $speech.config.voice;
//   speech.rate = 1;
//   speech.pitch = $speech.config.pitch;
//   speech.text = text;

//   // setup events
//   speech.onend = e => {
//     $speech.stop();
//     broadcast('speech-stopped');
//   };

//   // speech boundaries
//   speech.onboundary = e => {
//     if (config.onBoundary)
//       config.onBoundary($speech.active, e);
//   };


//   // start event
//   try {
//     if (config.onStart)
//       config.onStart($speech.active);
//   }
//   finally {
//     // save the ref
//     $speech.active = { speech, config };

//     // start speaking
//     $speech.paused = false;
//     $speech.synth.speak(speech);
//   }
// };


// // stop speaking entirely
// $speech.stop = () => {

//   // run events, if needed
//   try {
//     if ($speech.active && $speech.active.onEnd)
//       $speech.active.onEnd($speech.active);
//   }
//   // clean up
//   finally {  
//     $speech.active = undefined;
//     $speech.synth.cancel();
//   }
// };


// // pause the speech
// $speech.pause = () => {
//   if (!$speech.active) return;
//   $speech.synth.pause();
//   $speech.paused = true;
// };


// // continue speaking
// $speech.resume = () => {
//   if (!$speech.active) return;
//   $speech.synth.resume();
// };


// // stop the text
// window.onunload = () => {
//   $speech.stop();
// };


// // toggle speech enablement
// listen('speech-enablement', (context, enabled) => {
//   if (enabled) $speech.enable();
//   else $speech.disable();
// });

// // load voices, if possible
// if ($speech.enabled)
//   speechSynthesis.onvoiceschanged = () => {
//     $speech.voices = speechSynthesis.getVoices();
//     $speech.enabled = _.some($speech.voices);
//     $speech.ready = true;

//     // notify speech is now available
//     broadcast('speech-status', $speech, { });
//   };

// // speech enablement
// else {
//   broadcast('speech-status', $speech, { error: 'speech-not-available' });
// }


// // tracking an active message
// setInterval(() => {
//   if (!$speech.active) return;
//   if (!$speech.paused) speechSynthesis.resume();
// }, 14000);


// // expose API
// export default $speech;
