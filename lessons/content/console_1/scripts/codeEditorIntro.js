export const controller = true;

export function onEnter() {
	this.screen.highlight.codeEditor();
}

export function onTryEditReadOnly() {
	this.assistant.say({
		emote: 'happy',
		message: `Oops! I'm glad you're so excited to start making changes, but you can't edit the file just yet!`
	});
}

export function onExit() {
	this.screen.highlight.clear();
}