import { _ } from 'lodash';

export const controller = true;

let $count = 0;

export function onEnter() {
	this.progress.block();
	this.file.readOnly({ path: '/index.html' });
	this.screen.marker.previewArea('input', { x: 1 });

	// move to the next step
	const next = () => {
		this.clear();
		this.progress.allow();
		this.assistant.say({ 
			message: `That's it! The \`input\` [define html_element Element] has been disabled! It's no longer possible to type into the field!`
		});
	}

	// wait for entry
	this.preview.addEvent('keyup', 'input', input => {
		$count++;
		if ($count < 3) return;
		
		// stop the event
		this.preview.clearEvents();
	
		next();
	});

	this.delay(5000, () => {
		if ($count > 0) next();
	});
}

export function onExit() {
	this.screen.clear();
}