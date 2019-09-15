
import { HtmlValidator } from './lib';
import { validate_insert_button } from './validation';

export const controller = true;;


function validate(instance) {
	const content = instance.file.content({ path: '/index.html' });
	const result = HtmlValidator.validate(content, validate_insert_button);
	
	// update validation
	instance.editor.hint.validate({ path: '/index.html', result });
	
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
	this.file.allowEdit({ path: '/index.html' });

	// for curious students
	this.preview.addEvent('click', 'button', () => {
		this.assistant.say({
			emote: 'happy',
			message: `
				That button doesn't do anything just yet, but we'll learn how to make it do stuff in later lessons.
				I'm glad you we're curious and tried clicking on it!`
			});
	});
}

export function onReady() {
	validate(this);
}

export function onExit() {
	this.file.readOnly({ path: '/index.html' });
	this.editor.area.clear();
	this.preview.clearEvents();
}

export function onContentChange(file) {
	validate(this);
}