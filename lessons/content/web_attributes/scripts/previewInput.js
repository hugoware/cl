import { _ } from 'lodash';

export const controller = true;

export function onEnter() {
	this.progress.block();
	this.file.readOnly({ path: '/index.html' });
	this.screen.marker.previewArea('input', { x: 1 });

	// wait for entry
	this.preview.addEvent('keyup', 'input', input => {
		if (_.trim(input.target.value).length < 4) return;
		
		// stop the event
		this.preview.clearEvents();
		
		// display a message
		this.progress.allow()
		this.assistant.say({ 
			message: `By default, the \`input\` [define html_element Element] allows users to type information into the text field.

However, it's possible to disable text entry by using the correct [define html_attribute]!`
		});

	});
}

export function onExit() {
	this.screen.clear();
}