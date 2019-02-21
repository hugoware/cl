
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
		.__w
		.eof());
	
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
	this.file.readOnly({ path: '/index.html', readOnly: false });
	this.editor.cursor({ end: true });

	// perform initial validation
	this.delay(100, () => {
		const file = this.file.get({ path: '/index.html' });
		validate(this, file);
	});
}

export function onExit() {
	this.preview.clearEvents();
	this.file.readOnly({ path: '/index.html' });
	this.editor.area.clear();
}

export function onContentChange(file) {
	validate(this, file);
}