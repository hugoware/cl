export const controller = true;


export function onEnter() {
	this.file.open({ path: '/index.html' });
	this.screen.highlight.previewArea();
}

export function onExit() {
	this.screen.highlight.clear();
}