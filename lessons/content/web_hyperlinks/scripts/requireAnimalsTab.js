
export const controller = true;

export function onChangeTab(tab) {
	if (tab.path !== '/animals.html') return;
	this.progress.next();
	return true;
}

export function onEnter() {

	// check if already active
	const tab = this.editor.activeTab();
	if (tab && tab.path === '/animals.html') {
		return this.progress.next();
	}

	// must be on the correct tab
	this.progress.block();
	this.screen.highlight('#workspace .tab[file="/animals.html"]');
	this.assistant.say({
		message: `Switch to the \`animals.html\` tab by clicking on it.`
	});

}