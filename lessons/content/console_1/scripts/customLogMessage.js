import { _ } from './lib';

export const controller = true;

export function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 9, end: 22 });
	this.preview.clearRunner();
}

export function onReset() {
	this.assistant.revert();
}

export function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

export function onExit() {
	this.editor.area.clear();
}

export function onBeforeContentChange(file, change) {
	if (change.isNewline || change.data === "'" || change.data === '\\')
		return false;
}

export function onRunCodeAlert(context, message) {

	if (_.size(message) > 5) {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: `Great! You can see your message displayed in the [define codelab_code_output].`
		});
	}
	else {
		const any = _.some(message);
		this.assistant.say({
			message: `Type a ${any ? 'longer' : ''} message before pressing the **Run Code** button!`
		})
	}
}

export function onRunCode(context) {
	return true;
}