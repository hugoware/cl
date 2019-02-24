export const controller = true;

export function onSaveFile() {
	this.progress.next();
	return true;
}

export function onReady() {
	this.screen.marker.saveButton({ offsetX: -2, offsetY: 2, tr: true });
}