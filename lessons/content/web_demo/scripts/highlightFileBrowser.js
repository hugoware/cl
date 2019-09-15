export const controller = true;

export function onEnter() {
	this.screen.highlight.fileBrowser();
}

export function onExit() {
	this.screen.clear();
}