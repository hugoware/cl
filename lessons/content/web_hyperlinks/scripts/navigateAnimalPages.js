import { _ } from './lib';
import { oxfordize, pluralize } from './utils';

export const controller = true;

const DEFAULT_MESSAGE = `Try to navigate to each of the animal pages to make sure each link works.`

let $done;
let $remaining;

function getMessage() {

	if (!_.some($remaining)) {
		return `Navigate back to the \`animals.html\` page by using the link that says _"Go back to Animals"_.`
	}


	// needs to show animals
	const remains = oxfordize($remaining, 'and');
	const pages = pluralize($remaining, 'page');
	return `${DEFAULT_MESSAGE}

Navigate to the ${remains} ${pages} by clicking on the image of the animal.`;
}

export function onActivateLesson() {
	$done = undefined;
	$remaining = [
		'fox.html',
		'bear.html',
		'cat.html'
	];
}

export function onEnter() {
	this.file.readOnly({ path: '/index.html' });
	this.file.readOnly({ path: '/animals.html' });
	this.progress.block();
	
	this.assistant.say({ 
		message: getMessage()
	});
}

export function onNavigatePreviewArea(url) {
	if ($done) return;

	// remove a page
	const remove = $remaining.indexOf(url.substr(1));
	if (remove > -1)
		$remaining.splice(remove, 1);

	// check if finished
	if (url !== '/animals.html' || _.some($remaining)) {
		return this.assistant.say({ 
			message: getMessage(),
			silent: !($remaining.length === 3 || $remaining.length === 0)
		});
	}

	// looks like it worked
	$done = true;
	this.progress.allow();
	this.assistant.say({ 
		emote: 'happy',
		message: 'Way to go! It looks like all of the [define hyperlink links] work as expected!'
	});

}

export function onExit() {

	this.events.clear();
}