

import AssistantAPI from './assistant';
import ScreenAPI from './screen';
import ProgressAPI from './progress';
import FileAPI from './file';
import EditorAPI from './editor';
import PreviewAPI from './preview';
import SoundAPI from './sound';

export default class LessonAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// attach apis
		this.assistant = new AssistantAPI(this);
		this.preview = new PreviewAPI(this);
		this.screen = new ScreenAPI(this);
		this.progress = new ProgressAPI(this);
		this.file = new FileAPI(this);
		this.editor = new EditorAPI(this);
		this.sound = new SoundAPI(this);
	}

}