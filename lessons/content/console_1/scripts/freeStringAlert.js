
import { _, CodeValidator } from './lib';
import { validate_free_string_alert } from './validation';

export const controller = true;

let $isValid;

function validate(instance) {
	const content = instance.editor.area.get({ path: '/main.js' });
	const result = CodeValidator.validate(content, validate_free_string_alert);
	
	// update validation
	instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	$isValid = instance.progress.check({
		result,
		allow: () => {
			instance.assistant.say({
				message: `Looks good! Press the **Run Code** button to see what happens!`
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
	
}

export function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });

	// adjust the file
	const content = '\n\n\n' + this.file.content({ path: '/main.js' });
	$state.endIndex = (content.length - _.trimStart(content).length) - 1;

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content
	});
}

export function onRunCodeAlert(context, message) {

	this.progress.allow();
	this.assistant.say({ 
		message: `Wonderful! Using [define javascript_string s] is pretty easy and allows you to have even better messages!`,
		emote: 'happy',
	});
	
}

export function onInit() {
	this.editor.area({ path: '/main.js', start: 0, end: $state.endIndex });

}

export function onReady() {
	validate(this);
}

export function onBeforeContentChange(change) {
	if (change.hasNewLine) return false;
	return true;
}

export function onContentChange(file) {
	validate(this);

	if ($isValid) return;
	this.progress.block();
	this.assistant.revert();
}

export function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

export function onRunCode() {
	if (!$isValid) {
		this.assistant.revert();
		return false;
	}

	return true;
}
