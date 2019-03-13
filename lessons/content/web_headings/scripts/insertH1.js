
import waitForValidation from './controllers/waitForValidation';

waitForValidation(module.exports, {

	file: '/index.html',

	validation: test => test
		.__w$
		.tag('h1')
		.append({ inTag: true })
		.rejectNewLineInContent.content(5, 15)
		.close('h1')
		.append({ inTag: false })
		._n
		.__w$
		.eof(),

	onValid() {
		this.progress.allow();
		this.assistant.say({
			message: `That looks good! The [define preview_area] now shows the heading you just added.`
		});
	},

	// setup any custom stuff
	init(controller) {

		controller.onBeforeContentChange = (file, change) => {
			return !change.hasNewlines || (change.hasNewlines && !controller.validation.inTag);
		};

	}

});