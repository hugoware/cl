
export const controller = true;

export function onEnter() {
	this.progress.block();

	const waiting = this.events.listen('expand-objectives-list', () => {
		this.progress.next();
		this.events.clear();
	});
}

export function onExit() {
	this.events.clear();
}
