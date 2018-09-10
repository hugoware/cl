
import _ from 'lodash';
import $webshot from 'webshot';

export const name = 'capture screenshot';
export const route = '/__codelab__/capture';
export const authenticate = true;

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 150;
const MAX_WIDTH = 3000;
const MAX_HEIGHT = 3000;

export async function handle(request, response) {

	// not an absolute url -- not sure why this is here
	const url = _.trim(request.query.url);
	if (!/^https?:\/{2}/.test(url))
		return response.send('Whoops! Something when wrong!');

	// get the requested width
	let width = request.query.width;
	if (isNaN(width)) width = DEFAULT_WIDTH;
	width = _.clamp(width, 1, MAX_WIDTH);

	// get the requested height
	let height = request.query.height;
	if (isNaN(height)) height = DEFAULT_HEIGHT;
	height = _.clamp(height, 1, MAX_HEIGHT);

	// kick off the request
	let screenshot = '';
	const stream = $webshot(url, {
		windowSize: { width, height }
	});

	// Capture the streaming output from the screenshot
	stream.on('data', function (data) {
		screenshot += data.toString('binary');
	});

	// Once the image capture is completed, write it out to the browser
	stream.on('end', function () {
		response.set('Content-Type', 'image/png');
		response.end(screenshot, 'binary');
	});

}
