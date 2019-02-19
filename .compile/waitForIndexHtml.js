
export const controller = true;

export function onOpenFile(file) {

	if (file.path === '/index.html') {
		this.progress.next();
		return true;
	}

}

export function onEnter() {

	this.screen.highlight.fileBrowserItem('/index.html');

	this.delay(8000, () => {
		this.assistant.say(`To open the \`index.html\` file, double click the item in the File Browser.

To double click, move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.`);
	});
}

export function onExit() {
	this.screen.highlight.clear();
}