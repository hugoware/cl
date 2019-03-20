
export const controller = true;

export function onEnter() {
	this.progress.block();
}

export function onNavigatePreviewArea(url) {
	if (url !== '/animals.html') return;
	return this.progress.next();
}