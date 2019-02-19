
export const controller = true;

export function onOpenFile(file) {
	this.screen.highlight.clear();
}

export function onEnter() {
	this.screen.highlight.fileBrowser();
}