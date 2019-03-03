import { _, CodeValidator } from './lib';

export const controller = true;

let $endIndex;

import { validate_repeat_alert, validate_complete_repeat_alert } from './validation';

function validate(instance) {

	// let result;

	// check the working area first
	const workingArea = instance.editor.area.get({ path: '/main.js' });
	const result = CodeValidator.validate(workingArea, validate_repeat_alert);

	// const success = 

	// console.log(workingArea);


	// const content = instance.file.content({ path: '/main.js' });
	// const result = CodeValidator.validate(content, validate_repeat_alert);
	
	// update validation
	instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	instance.progress.update({
		result,
		allow: () => instance.assistant.say({
			message: `Great! Let's move to the next step!`
		}),
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
	
}

export function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });

	// determine the working area
	const content = this.file.content({ path: '/main.js' });
	$endIndex = (content.length - _.trimStart(content).length) - 1;
}

export function onInit() {
	this.editor.area({ path: '/main.js', start: 1, end: $endIndex });
}

export function onReady() {
	validate(this);
}

export function onContentChange(file) {
	validate(this);
}

export function onExit() {
	this.file.readOnly({ path: '/main.js' });
}