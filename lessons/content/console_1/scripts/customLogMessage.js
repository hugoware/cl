import { _ } from './lib';

export const controller = true;

export function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 8, end: 11 });
	this.preview.clearRunner();
}

export function onReset() {
	this.assistant.revert();
}

export function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

export function onExit() {
	this.editor.area.clear();
}

export function onBeforeContentChange(file, change) {
	return change.isBackspace
		|| change.isDelete
		|| /^[0-9]+$/.test(change.data);
}


export function onRunCode() {

	const input = this.editor.area.get({ path: '/main.js' });

	// make sure it's only numbers
	if (!/^[0-9]+$/.test(input)) {
		this.assistant.say({
			message: 'Make sure to only use numbers in this example!'
		});

		return false;
	}

	// if it's only zeros
	if (/^0+[1-9]$/.test(input)) {
		this.assistant.say({
			message: `You've got the right idea, but try a number that doesn't start with a zero`
		});

		return false;	
	}

	// make sure it's long enough
	const size = _.size(input);
	if (size < 5) {
		const any = size > 0;
		this.assistant.say({
			message: `Type ${any ? 'some more' : 'a few'} numbers before pressing the **Run Code** button!`
		});

		return false;
	}
	
	if (size > 15) {;
		this.assistant.say({
			message: `Type a few less numbers before pressing the **Run Code** button!`
		});

		return false;
	}

	return true;

}

export function onRunCodeAlert(context, message) {
	
	this.editor.area.clear();
	this.file.readOnly({ path: '/main.js' });
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: `Great! You can see the numbers you typed in are displayed in the alert message!`
	});

}
