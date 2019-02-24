
import _ from 'lodash';
import request from 'request';
import { resolveError } from '../utils';
import $config from '../config';
import $path from '../path';
import $fsx from 'fs-extra';

export const event = 'request-speech';
export const authenticate = true;

const SERVER = 'eastus2';
const FEMALE_VOICE = 'en-US, Jessa24kRUS';
const MALE_VOICE = '';

export async function handle(socket, session, data) {
	
	// get the hash for this text
	const text = _.trim(data.text);
	const id = hashCode(`female:${text}`);
	const key = `audio__${id}`;
	const path = $path.resolveAudio(key);

	// check if already saved
	// TODO: cache
	const exists = await $fsx.exists(path);
	if (exists) {
		socket.ok(event, { key });
		return;
	}
	
	// request the audio
	try {
		const token = await getToken();
		await generateAudio(token, key, text);
		console.log(`generated: ${key}`);
		socket.ok(event, { key });
	}
	// failed to generate
	catch (ex) {
		error = resolveError(ex);
		socket.err(event, { error });
	}
}

// request a new token
async function getToken() {
	return new Promise((resolve, reject) => {
		request({
			method: 'POST',
			uri: `https://${SERVER}.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
			headers: {
				'Ocp-Apim-Subscription-Key': $config.azureSubscriptionKey 
			}
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) resolve(body);
			else reject(error || { statusCode: response.statusCode });
		});
	});
}

// create the audio clip
async function generateAudio(token, key, text) {
	return new Promise((resolve, reject) => {
		const voice = FEMALE_VOICE;
		const output = $path.resolveAudio(key);

		request({
			method: 'POST',
			baseUrl: `https://${SERVER}.tts.speech.microsoft.com/`,
			url: 'cognitiveservices/v1',
			headers: {
				'Authorization': 'Bearer ' + token,
				'cache-control': 'no-cache',
				'User-Agent': 'codelab',
				'X-Microsoft-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
				'Content-Type': 'application/ssml+xml'
			},
			body:
				`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US" >` +
				`<voice name="Microsoft Server Speech Text to Speech Voice (${voice})">` +
				_.escape(text) +
				`</voice>` +
				`</speak>`
		}, (error, response, body) => {
			if (!error && response.statusCode === 200) resolve();
			else reject(error || { statusCode: response.statusCode });
		})
		// save the data
		.pipe($fsx.createWriteStream(output));
	});
}

// creates a hash of an audio file
function hashCode(s) {
	let h;
	for (let i = 0; i < s.length; i++)
		h = Math.imul(31, h) + s.charCodeAt(i) | 0;
	return h;
}