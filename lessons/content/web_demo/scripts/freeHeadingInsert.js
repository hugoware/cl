
import { HtmlValidator } from './lib';
import { validate_insert_h3 } from './validation';

export const controller = true;

function validate(instance) {
	const content = instance.file.content({ path: '/index.html' });
	const result = HtmlValidator.validate(content, validate_insert_h3);
	
	// update validation
	instance.editor.hint.validate({ path: '/index.html', result });
	
	// update progress
	instance.progress.update({
		result,
		allow: () => instance.assistant.say({
			emote: 'happy',
			message: `Great! Let's move to the next step!`
		}),
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

export function onEnter() {
	this.progress.block();
	this.file.allowEdit({ path: '/index.html' });
}

export function onReady() {
	this.editor.cursor({ end: true });
	validate(this);
}

export function onExit() {
	this.preview.clearEvents();
	this.file.readOnly({ path: '/index.html' });
	this.editor.area.clear();
}

export function onContentChange(file) {
	validate(this, file);
}