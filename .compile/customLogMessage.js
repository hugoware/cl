import { _ } from './lib';

export const controller = true;

export function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 15, end: 28 });
}

export function onReset() {
	this.assistant.revert();
}

export function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

export function onBeforeContentChange(file, change) {
	if (change.isNewline || change.data === "'")
		return false;
}

export function onRunCode() {
	return true;
}

export function onRunCodeEnd(context) {

	const message = context.output[1];
	
	if (_.size(message) < 5) {
		this.delay(500, () => this.screen.highlight('.line-number-1'));
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: `Great! Looks like you typed in \`${message}\`.`
		});
	}
	else {
		this.assistant.say({
			message: 'Oops! Make sure to type a message!'
		})
	}

}
