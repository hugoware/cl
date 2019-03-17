
import { _, CodeValidator, HtmlValidator } from '../lib';


export default function waitForValidation(obj, config) {
	const state = { };
	const validation = { };

	// standard validaton function
	function validate(instance) {
		const content = 'area' in config
			? instance.editor.area.get({ path: config.file })
			: instance.file.content({ path: config.file });

		// get the correct validator
		let validator;

		// check for a named validator
		if (config.validator === 'code' || /\.js$/.test(config.file))
			validator = CodeValidator;
		else if (config.validator === 'html' || /\.html?$/.test(config.file))
			validator = HtmlValidator;
		// else if (config.validator === 'css' || /\.css$/.test(config.file))
		// 	validator = CssValidator;
		
		// perform the validaton
		const args = [content].concat(config.validation);
		const result = validator.validate.apply(null, args);

		// update the result
		_.assign(validation, result);
		
		// update validation
		instance.editor.hint.validate({ path: config.file, result });
		
		// update progress
		const wasValid = state.isValid;
		state.isValid = instance.progress.check({
			result,
			deny: instance.assistant.revert,
			always: config.silent ? _.noop : instance.sound.notify,

			// when allowing the next step
			// allow: () => {


			// 	// config.onValid();
			// 	// instance.assistant.say({
			// 		// message: successMessage `Perfect! Press the **Run Code** button to see what happens!`
			// 		// message: config.successMessage // `Perfect! Press the **Run Code** button to see what happens!`
			// 	// });
			// }
		});

		// switched to invalid
		if (wasValid && !state.isValid && config.onInvalid)
			config.onInvalid.call(instance);

		// switched to valid
		if (!wasValid && state.isValid && config.onValid)
			config.onValid.call(instance);
		
	}

	// setup the controller
	_.assign(obj, { 
		controller : true,
		state,
		validation,

		onEnter(...args) {
			this.editor.focus();
			this.progress.block();
			this.file.allowEdit({ path: config.file });

			if (config.onEnter)
				config.onEnter.apply(this, args);
		},

		onInit() {
			if ('area' in config)
				this.editor.area({ path: config.file, start: config.area.start, end: config.area.end });

			if ('cursor' in config)
				this.editor.cursor({ path: config.file, index: config.cursor });

			validate(this);
		},

		onContentChange(file) {
			validate(this);
			
			if (state.isValid) return;
			this.progress.block();
			this.assistant.revert();
		},

		onExit() {
			this.file.readOnly({ path: config.file });
		}

	});

	// extra logic as required
	if (config.init)
		config.init(obj);

}
