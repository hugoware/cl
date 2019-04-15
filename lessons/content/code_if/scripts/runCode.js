
export const controller = true;

let $done;
let $more;
let $less;
let $same;

export function onActivate() {
	$done = 0;
	$more = false;
	$less = false;
	$same = false;
}

export function onEnter() {
	$done = 0;
	$more = false;
	$less = false;
	$same = false;
	this.progress.block();
}

export function onRunCode() {
	return true;
}

export function onRunCodeEnd(runner) {
	if ($done === 3) return;

	const students = parseFloat(runner.input[0]);
	const books = parseFloat(runner.input[1]);

	let duplicate;
	let emote = 'happy';
	let message;

	if (isNaN(students) && isNaN(books)) {
		emote = 'sad';
		message = 'Seems like neither the `totalStudents` or `totalBooks` [define code_variable l] was a number! Make sure to use numbers for both inputs!';
	}
	else if (isNaN(students)) {
		message ='Seems like the `totalStudents` [define code_variable l] wasn\'t a number! Make sure to use a number for both inputs!';
		emote ='sad';
	}
	else if (isNaN(books)) {
		message = 'Seems like the `totalBooks` [define code_variable l] wasn\'t a number! Make sure to use a number for both inputs!';
		emote = 'sad';
	}
	else if (students === books) {
		if ($same) duplicate = true;
		$same = true;
		message = 'The `else if` condition passed since both the `totalStudents` and `totalBooks` [define code_variable ls] are the same!';
	}
	else if (students > books) {
		if ($more) duplicate = true;
		$more = true;
		message = 'The `if` condition passed since the `totalStudents` [define code_variable l] is greater than `totalBooks`!';
	}
	else if (students < books) {
		if ($less) duplicate = true;
		$less = true;
		message = 'The `else` condition passed since the `totalStudents` [define code_variable l] is less than `totalBooks`!';
	}

	// prepare the final message
	if (duplicate) {
		message = 'Seems like you\'ve already passed this condition already.';
	}
	else if (emote === 'happy') {
		$done++;
		message = `${[null, 'Excellent', 'Fantastic', 'Perfect'][$done]}! ${message}`;
	}

	if ($done === 3) {
		this.progress.allow();
		message += '\n\nLooks like you\'ve tested all three conditions!';
	}
	else {
		message += '\n\nPress **Run Code** again and try a different combination of numbers!'
	}
	
	// show the message
	return this.assistant.say({ message, emote });

}