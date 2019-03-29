import { CodeValidator } from './lib';

export const controller = true;

let $alertCount = 0;
let $isValid = false;

import { validate_free_alert } from './validation';

function validate(instance) {
	const content = instance.file.content({ path: '/main.js' });
	const result = CodeValidator.validate(content, validate_free_alert);
	
	// update validation
	instance.editor.hint.validate({ path: '/main.js', result });
	
	// update progress
	$isValid = false;
	instance.progress.check({
		result,
		allow: () => {
			$isValid = true;
			instance.assistant.say({
				message: `Great! Press the **Run Code** button to see what happens!`
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
	
}

export function onActivateLesson() {
	$alertCount = 0;
	$isValid = false;
}

export function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });
}

export function onRunCodeAlert(context, message) {

	if ($alertCount === 0) {
		$alertCount++;
		
		this.assistant.say({ 
			message: `When code is run it's done [define sequentially sequentially], meaning it will [define execute execute] in the order it appears in the file.
You can see that the first \`alert\` message has been displayed. Press **OK** to allow the code to continue running.`
		});
	}
	else if ($alertCount === 1) {
		this.assistant.say({ 
			message: `That's it! The second alert message has been displayed showing the numbers you just added!`,
			emote: 'happy',
		});
		this.progress.allow();
	}

}

export function onReady() {
	validate(this);
}

export function onContentChange(file) {
	this.progress.block();
	this.assistant.revert();
	validate(this);
}

export function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

export function onRunCode() {
	if (!$isValid) {
		this.assistant.revert();
		return false;
	}

	$alertCount = 0;
	return true;
}
