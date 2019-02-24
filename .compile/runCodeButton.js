
export const controller = true;

export function onEnter() {
	this.progress.block();
	this.screen.marker.runButton({ tr: true, offsetX: -2, offsetY: 2 });
}

export function onRunCode() {
	this.screen.highlight.clear();
	return true;
}

export function onRunCodeEnd(context) {
	this.progress.allow();
	this.delay(500, () => this.screen.highlight('.line-number-1'));
	this.assistant.say({
		emote: 'happy',
		message: 'Great! You can see that running this code caused a message to be displayed in the [define codelab_code_output output] area.'
	});
}
