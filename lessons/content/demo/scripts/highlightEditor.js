export const controller = true;

export function onEnter() {
	this.screen.highlight.codeEditor();
}

export function onExit() {
	this.screen.clear();
}