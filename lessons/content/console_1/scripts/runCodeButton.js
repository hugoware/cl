
export const controller = true;

export function onEnter() {
	this.progress.block();
	this.screen.marker.runButton({ tr: true, offsetX: -2, offsetY: 2 });
}

export function onRunCode(context) {
	this.screen.highlight.clear();
	return true;
}

export function onRunCodeAlert(context, message) {

	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'Great! You can see that running this code caused an alert message to be displayed in the [define codelab_code_output output] area.'
	});

}
