
export const controller = true;

export function onOpenFile(file) {

	if (file.path === '/main.js') {
		this.progress.next();
		return true;
	}

}

export function onEnter() {
	this.progress.block();
	
	this.file.readOnly({ path: '/main.js' });
	this.screen.highlight.fileBrowserItem('/main.js');

	this.delay(10000, () => {
		this.assistant.say({
			message: `
				To open the \`main.js\` file, [define double_click double click] the item in the [define file_browser File Browser].
				To [define double_click double click], move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.`
			});
		});
}

export function onExit() {
	this.screen.highlight.clear();
}