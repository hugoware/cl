
import { HtmlValidator } from './lib';

export const controller = true;

function validate(instance, file) {
	const content = instance.file.content({ file });

	const result = HtmlValidator.validate(content, test => test
		._w
		.tag('h1')
		.content()
		.close('h1')
		._n
		.__w
		.tag('h3')
		.text('A small heading')
		.close('h3')
		._n
		.__w
		.tag('button')
		.text('Click me')
		.close('button')
		.__w
		.eof());
	
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
	this.progress.block();
	this.file.readOnly({ path: '/index.html', readOnly: false });

	// for curious students
	this.preview.addEvent('click', 'button', () => {
		this.assistant.say({
			emote: 'happy',
			message: `
				That button doesn't do anything just yet, but we'll learn how to make it do stuff in later lessons.
				I'm glad you we're curious and tried clicking on it!`
			});
	});

	const file = this.file.get({ path: '/index.html' });
	validate(this, file);
}

export function onExit() {
	this.file.readOnly({ path: '/index.html' });
	this.editor.area.clear();
	this.preview.clearEvents();
}

export function onContentChange(file) {
	validate(this, file);
}