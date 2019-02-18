import { broadcast } from '../../events';
import $state from '../../state'

export default class ContentAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	set(path, content, replaceRestore) {
		$state.editor.setContent(path, content, replaceRestore);
		return this.get(path);
	}

	get(path) {
		const file = $state.paths[path];
		return file.current || file.content;
	}

}