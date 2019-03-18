
export const controller = true;

export function onEnter() {
	this.screen.highlight('#preview .title', { x: -15, expandX: 10 });
}

export function onExit() {
	this.screen.highlight.clear();
}