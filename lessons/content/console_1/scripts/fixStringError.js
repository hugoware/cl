import { _, CodeValidator } from './lib';
import { validate_complete_fix_string_alert } from './validation';

export const controller = true;

let $isValid;
let $isShowingHelp;

function validate(instance) {
	const workingArea = instance.editor.area.get({ path: '/main.js' });
	const result = CodeValidator.validate(workingArea, validate_complete_fix_string_alert);
	
	// update validation
	if ($isShowingHelp)
		instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	$isValid = false;
	instance.progress.check({
		result,
		allow: () => {
			$isValid = true;
			instance.assistant.say({
				message: `Great! Press the **Run Code** button to see if the problem is now fixed!`
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
	
}

export function onActivateLesson() {
	$isValid = false;
	$isShowingHelp = false;
}

export function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
	this.delay(15000, () => {
		$isShowingHelp = true;
		validate(this);
	});
}

export function onContentChange() {
	this.progress.block();
	validate(this);
}

export function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 0, end: 18 });
	this.editor.cursor({ path: '/main.js', index: 16 });
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
		message: `There we go! You fixed the [define syntax_error]!

This example also required that we include the second \`'\` as well as the \`)\`!`
	});
}