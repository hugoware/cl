import _ from 'lodash';
import $ from 'jquery';
import Component from '../../../component';

// different preview modes
import BrowserMode from './browser';
import ReplMode from './repl';

// instantiatable modes
const MODES = {
	browser: BrowserMode,
	repl: ReplMode
};

export default class Preview extends Component {

	constructor(context) {
		super({
			context,
			template: 'preview',

			ui: {
				content: '.preview-wrapper'
			}
		});

		// cache of handlers
		this.handlers = { };

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('activate-file', this.onActivateFile);
		this.listen('compile-file', this.onCompileFile);
		this.listen('close-file', this.onCloseFile);
		this.listen('preview-message', this.onPreviewMessage);
	}

	// changes the display mode for the project
	setMode = mode => {

		// load a handler for the first time
		if (!(mode in this.handlers)) {
			const type = MODES[mode];

			// make sure the handler exists
			if (!type)
				throw 'unsupported handler';

			// create and save the handler
			const handler = this.handlers[mode] = new type(this);
			handler.appendTo(this.ui.content);
		}

		// replace the current mode
		_.each(MODES, key => this.removeClass(`mode-${key}`));
		this.addClass(`mode-${mode}`);

		// set the mode
		this.handler = this.handlers[mode];
	}

	// prepare the preview window
	onActivateProject = async () => {
		this.setMode('repl');
		this.handler.onActivateProject();
	}

	// forwarding preview messages
	onPreviewMessage = (...args) => {
		this.handler.onPreviewMessage(...args);
	}

	onDeactivateProject = () => {
		this.handler.onDeactivateProject();
	}

	onCloseFile = file => {
		this.handler.onCloseFile(file);
	}

	// handles when files are loaded
	onActivateFile = async file => {
		this.handler.onActivateFile(file);
	}

	// check for dependencies and update
	onCompileFile = async file => {
		this.handler.onCompileFile(file);
	}

}

