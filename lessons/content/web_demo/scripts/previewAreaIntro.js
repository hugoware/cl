export const controller = true;


export function onEnter() {
	this.screen.highlight.previewArea();
}

export function onExit() {
	this.screen.highlight.clear();
}