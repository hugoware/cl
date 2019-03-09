
import { _, CodeValidator } from './lib';
import { validate_insert_string_alert } from './validation';

export const controller = true;

let $isValid;

function validate(instance) {
	const content = instance.editor.area.get({ path: '/main.js' });
	const result = CodeValidator.validate(content, validate_insert_string_alert);
	
	// update validation
	instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	$isValid = instance.progress.check({
		result,
		allow: () => {
			instance.assistant.say({
				message: `Perfect! Press the **Run Code** button to see what happens!`
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
	const content = this.file.content({ path: '/main.js' });
	const lines = _.compact(_.trim(content).split(/\n/));
	const last = _.last(lines);

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: '\n\n\n' + last + '\n\n'
	});
}

export function onRunCodeAlert(context, message) {

	this.progress.allow();
	this.assistant.say({ 
		message: `That's it! You just displayed a new alert message, but this time it uses text instead of numbers!`,
		emote: 'happy',
	});
	
}

export function onInit() {
	this.editor.area({ path: '/main.js', start: 0, end: 2 })

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
