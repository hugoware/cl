
import { HtmlValidator } from './lib';
import { validate_list } from './validation';

export const controller = true;

export function validate(instance) {
	const content = instance.file.content({ path: '/index.html' });
	const result = HtmlValidator.validate(content, validate_list);
	
	// update validation
	instance.editor.hint.validate({ path: '/index.html', result });
	
	// update progress
	instance.progress.update({
		result,
		allow: () => instance.assistant.say({
			message: `Wonderful! You'll notice that the [define web_browser] automatically placed a number next to each of the list items you created!`
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
	this.file.readOnly({ path: '/index.html' });
}

export function onContentChange(file) {
	validate(this);
}