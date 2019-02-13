
import { _ } from '../lib';
import $api from '../api';
import Dialog from './';
import ErrorMessage from '../ui/error-message';

export default class ResetLessonDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-reset-lesson',

			ui: {
				error: '.error'
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
				default: "Unable to reset the lesson at this time!" 
			}
		});

	}

	// handles showing the view
	onActivate = lesson => {
		this.lessonId = lesson.id;
	}

	// handle triggering the reset
	onConfirm = async () => {
		this.busy = true;

		try {
			const { lessonId } = this;
			const result = await $api.request('reset-lesson', { lessonId });

			// this reset as requested
			if (result.success) {
				this.broadcast('reset-project-item', lessonId);
				this.hide();
			}

			else throw 'lesson_not_reset';
		}
		// there was an issue
		catch (err) {
			this.errorMessage.apply(err);
		}
		finally {
			this.busy = false;
		}
		
	}

}