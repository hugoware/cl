
export const controller = true;

let $hasIndex;
let $hasAnimals;

export function onActivateLesson() {
	$hasIndex = undefined;
	$hasAnimals	= undefined;
}

export function onEnter() {
	this.progress.block();
}

export function onBeforeNavigatePreviewArea() {
	return !($hasAnimals || $hasIndex);
}

export function onNavigatePreviewArea(url) {

	if (url === '/index.html') {
		$hasIndex = true;
		return;
	}

	if (url === '/animals.html' && $hasIndex) {
		$hasAnimals = true;
		this.assistant.say({
			emote: 'happy',
			message: 'Looks good! Both of the [define hyperlink links] are working as expected!'
		});

		return this.progress.allow();
	}
}