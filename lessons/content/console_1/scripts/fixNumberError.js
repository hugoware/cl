import { _, CodeValidator } from './lib';
import { validate_complete_fix_number_alert } from './validation';

export const controller = true;

let $isValid;

function validate(instance) {
	const workingArea = instance.editor.area.get({ path: '/main.js' });
	const result = CodeValidator.validate(workingArea, validate_complete_fix_number_alert);
	
	// update validation
	instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	$isValid = instance.progress.check({
		result,
		allow: () => {
			instance.assistant.say({
				message: `Great! Press the **Run Code** button to see if the problem is now fixed!`
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
	
}

export function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

export function onContentChange() {
	validate(this);

	if ($isValid) return;
	this.progress.block();
}

export function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 0, end: 14 });
	this.editor.cursor({ path: '/main.js', index: 13 });
	validate(this);
}

export function onRunCodeError() {
	this.progress.allow();
	this.assistant.say({
		message: `Seems like there's still a problem with this code. Keep trying until you fix the [define syntax_error].`
	});
}

export function onRunCode() {
	return true;
}

export function onRunCodeAlert() {
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: `That did it! You fixed the [define syntax_error]!

The second \`)\` is very important when you use functions like \`alert\`!`
	});
}