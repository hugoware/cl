import { _, CodeValidator } from './lib';

export const controller = true;

let $endIndex;
let $allowRunCode;

import { validate_repeat_alert, validate_complete_repeat_alert } from './validation';

function validate(instance) {

	// check the working area first
	const workingArea = instance.editor.area.get({ path: '/main.js' });
	const result = CodeValidator.validate(workingArea, validate_repeat_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	$allowRunCode = false;
	instance.progress.check({
		result,
		allow: () => {
			$allowRunCode = true;
			instance.assistant.say({
				message: `Great! Press the **Run Code** button and then click **OK** for each of the alert messages`
			});
		},
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
	
}

export function onReset() {
	this.progress.block();
	this.assistant.revert();
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
	this.editor.area({ path: '/main.js', start: 0, end: $endIndex });
}

export function onReady() {
	validate(this);
}

export function onContentChange(file) {
	this.progress.block();
	validate(this);
}

export function onRunCodeEnd() {
	this.progress.allow();
	this.assistant.say({
		message: 'Wonderful! You can see that each line of code was run in the order that it was added to the file.',
		emote: 'happy',
	});
}

export function onRunCode() {
	return !!$allowRunCode;
}

export function onExit() {
	this.file.readOnly({ path: '/main.js' });
}