export const controller = true;

export function onEnter() {
	this.progress.block();
}

export function onRunCode() {
	return true;
}

export function onRunCodeEnd() {
	this.screen.highlight.outputLine(1);
	this.progress.allow();
	this.assistant.say({
		message: "That's pretty great! Now each time you use `console.log` a new message will be appended to the end of the [define codelab_code_output] area.",
		emote: 'happy'
	});
}

export function onExit() {
	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: '\n\n\n'
	});
}