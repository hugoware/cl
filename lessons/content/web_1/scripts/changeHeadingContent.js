import { _ } from './lib';
import { simplify, similarity } from './utils';

export const controller = true;

let $valid;

export function onEnter() {
	this.progress.block();
	this.file.readOnly({ path: '/index.html', readOnly: false });
	this.editor.area({ path: '/index.html', start: 6, end: 19 });
}

export function onExit() {
	this.file.readOnly({ file: '/index.html' });
	this.editor.area.clear({ path: '/index.html' });
}

export function onContentChange(file, change) {
	const content = this.editor.area.get({ path: '/index.html' });
	
	const simplified = simplify(content);
	const diff = similarity('helloworld', simplified);
	const isChanged = simplified.length > 5 && diff < 0.4;

	// it's literally what was said
	if (simplified === 'somethingdifferent') {
		$valid = true;
		this.assistant.say({
			emote: 'happy',
			message: `
				Oh! I did say to type _"something different"_, didn't I?
				You're very clever!`
		});
	}

	// check if the message is new
	else if (!$valid && isChanged) {
		$valid = true;
		this.progress.allow();
		this.assistant.say({
			message: 'Looks great! You can see what you typed into the Preview Area'
		});
	}
	// invalidated
	else if ($valid && !isChanged) {
		$valid = false;
		this.assistant.revert();
	}


}

export function onBeforeContentChange(file, change) {
	return !change.hasNewline;
}
