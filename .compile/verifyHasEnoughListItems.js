
export const controller = true;

const MESSAGE_OPEN_FILE = `
Before we can continue, we need to open the \`index.html\` file.

[snippet html_example]

Start by double clicking the file in the file browser`;

const MESSAGE_INCORRECT_FILE = `
Oops! That's not the correct file! Double click on the highlighted file in the file browser`;

const MESSAGE_CORRECT_FILE = `
Great! Let's continue to the next slide!`;

export function onEnter() {
  this.editor.readOnly('/index.html', true);
  this.assistant.emote.sad();
	this.progress.block();
	this.screen.highlight.fileBrowserItem('/index.html');
}

export function onExit() {
	this.screen.highlight.clear();
}

export function onReset() {
	console.log('onReset')
}

export function onOpenFile(file) {
	if (this.state.hasOpenedIndexHtml)
		return false;

	// check the file
	const correct = file.path === '/index.html';
	if (!correct) {
		this.assistant.say(MESSAGE_INCORRECT_FILE, { emote: 'sad', force: true });
		this.progress.block();
		return false;
	}
	
	// save this worked
	this.state.hasOpenedIndexHtml = true;
	this.assistant.say(MESSAGE_CORRECT_FILE, { emotion: 'happy' });
	this.progress.allow();
  this.screen.highlight.clear();
	return true;

}

export function onBeforeContentChange({ file, session }, event) {
  this.assistant.say(`Don't try and edit \`${file.name}\` just yet!`, { emotion: 'sad' });
  return false;
}
