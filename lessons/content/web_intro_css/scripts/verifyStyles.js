
export const controller = true;

let $count;
let $done;

export function onActivateLesson() {
	$count = 0;
	$done;
}

export function onNavigatePreviewArea(url) {
	if ($done) return;

	// make sure the url is right
	if (url !== '/about.html' && url !== '/index.html')
		return false;

	// good to go
	if (++$count < 2) return;
	$done = true;

	this.screen.highlight.clear();
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: `Looks like it worked! Both pages are using the new background color!`
	});
}


export function onEnter() {
	this.progress.block();
}