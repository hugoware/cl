import { _ } from './lib';

export const controller = true;

export function onEnter() {

	const current = this.file.content({ path: '/main.js' });
	this.file.readOnly({ path: '/main.js' });

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: `

alert('fix me!


${_.trimStart(current)}`

	});


}

export function onReady() {
	this.editor.cursor({ path: '/main.js', index: 16 });
}
