

import AssistantAPI from './assistant';
import ScreenAPI from './screen';
import ProgressAPI from './progress';
import ContentAPI from './content';
import EditorAPI from './editor'
import ValidationAPI from './validate'
import SoundAPI from './sound'

export default class LessonAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// attach apis
		this.assistant = new AssistantAPI(this);
		this.screen = new ScreenAPI(this);
		this.progress = new ProgressAPI(this);
		this.content = new ContentAPI(this);
		this.editor = new EditorAPI(this);
		this.validate = new ValidationAPI(this);
		this.sound = new SoundAPI(this);
	}

}