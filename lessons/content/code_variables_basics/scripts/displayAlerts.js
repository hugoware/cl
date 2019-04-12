import { _ } from './lib';

export const controller = true;

let $success;

export function onActivate() {
	$success = false;
}

export function onEnter() {
	this.progress.block();
}

export function onRunCode() {
	$success = false;
	this.progress.block();
	return true;
}

export function onRunCodeAlert(runner) {

	const expects = [
		_.toString(this.state.selectedAge),
		_.toString(this.state.selectedColor) 
	];

	const remains = _.difference(expects, runner.alerts);
	$success = remains.length === 0;

	if ($success) {
		this.progress.allow();
		this.assistant.say({
			message: `That did it! Each of the messages were displayed as you expected, but it used the data found inside of each [define code_variable l].`,
			emote: 'happy'
		});
	}
}