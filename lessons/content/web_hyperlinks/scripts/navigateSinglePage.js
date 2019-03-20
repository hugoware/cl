export const controller = true;

let $remaining = [
	'/fox.html',
	'/bear.html',
	'/cat.html',
	'/animals.html',
];

let $toAnimals;
let $toList;

export function onEnter() {
	this.file.readOnly({ path: '/index.html' });
	this.file.readOnly({ path: '/animals.html' });
	this.progress.block();

	const animal = this.state.animalType;
	this.assistant.say({
		message: `Let's try out the new [define hyperlink link] we just added! Click on the picture of the ${animal} to navigate to the \`${animal}.html\` page!`
	});
}

export function onNavigatePreviewArea(url) {

	// animal page
	if (!$toAnimals && /\/(fox|bear|cat)\.html/i.test(url)) {
		$toAnimals = true;
		this.assistant.say({
			message: 'Now use the `Go back to Animals` link to return to the previous page.'
		});
	}

	// has visited the animal page
	if ($toAnimals && /\/animals\.html/i.test(url))
		$toList = true;

	// not far enough
	if (!($toAnimals && $toList))
		return;

	// looks like it worked
	this.progress.allow();
	this.assistant.say({ 
		emote: 'happy',
		message: 'Fantastic! That looks like it worked!'
	});

}

export function onExit() {

	this.events.clear();
}