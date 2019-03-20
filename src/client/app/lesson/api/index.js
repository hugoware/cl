import _ from 'lodash';
import $state from '../../state';

import AssistantAPI from './assistant';
import EventAPI from './event';
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
		this.events = new EventAPI(this);
		this.assistant = new AssistantAPI(this);
		this.preview = new PreviewAPI(this);
		this.screen = new ScreenAPI(this);
		this.progress = new ProgressAPI(this);
		this.file = new FileAPI(this);
		this.editor = new EditorAPI(this);
		this.sound = new SoundAPI(this);
	}

	// handles args
	flags(...args) {

		// getting args
		if (!_.some(args))
			return _.assign({ }, $state.flags);

		// writing values
		const [key, value] = args;
		$state.flags[key] = !!value;
	}

}
