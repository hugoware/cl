
export const controller = true;

export function onEnter() {
	this.progress.block();

	const current = this.file.content({ path: '/main.js' });
	this.file.readOnly({ path: '/main.js' });

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: `

alert(12345

${current}`

	});


}

export function onReady() {
	this.editor.cursor({ path: '/main.js', index: 13 });
}

export function onRunCodeError() {
	this.progress.allow();
	this.assistant.say({
		message: `This is an [define exception_message]. This means that the code encountered a problem it couldn't recover from!`
	});
}

export function onRunCode() {
	return true;
}