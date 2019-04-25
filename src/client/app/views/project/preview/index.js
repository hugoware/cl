import { _, $ } from '../../../lib';
import $state from '../../../state';
import Component from '../../../component';

// different preview modes
import BrowserMode from './browser';
import MobileMode from './mobile';
import ReplMode from './repl';

// instantiatable modes
const MODES = {
	browser: BrowserMode,
	mobile: MobileMode,
	repl: ReplMode
};

// preview display types
const MODE_TYPES = { 
	web: 'browser',
	mobile: 'mobile',
	code: 'repl',
	default: 'error'
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

		// shared the preview area
		$state.preview = this;

		// pending events
		this.events = [ ];

		// events
		this.listen('reset', this.onReset);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('activate-file', this.onActivateFile);
		this.listen('compile-file', this.onCompileFile);
		this.listen('close-file', this.onCloseFile);
		this.listen('preview-message', this.onPreviewMessage);
	}

	// includes an event to watch for
	addEvent(event) {
		this.events.push(event);
		this.attachEvent(event);
	}

	// remove all events
	clearEvents() {
		$(this.handler.output).off();
		this.events = [ ];
	}

	// resetting the view
	onReset = () => {
		if (this.handler) this.handler.dispose();
		delete this.handler;
		this.ui.content.empty();
	}

	// changes the display mode for the project
	setMode = mode => {

		// load a handler for the first time
		const type = MODES[mode];

		// make sure the handler exists
		if (!type)
			throw 'unsupported handler';

		// create and save the handler
		this.handler = new type(this);
		this.handler.appendTo(this.ui.content);

		// replace the current mode
		_.each(MODE_TYPES, key => this.removeClass(`mode-${key}`));
		this.addClass(`mode-${mode}`);
	}

	// prepare the preview window
	onActivateProject = async project => {
		const mode = MODE_TYPES[project.type] || MODE_TYPES.default;
		this.setMode(mode);
		this.handler.onActivateProject();
	}

	// forwarding preview messages
	onPreviewMessage = (...args) => {
		if (!this.handler) return;
		this.handler.onPreviewMessage(...args);
	}

	onDeactivateProject = () => {
		if (!this.handler) return;
		this.handler.onDeactivateProject();
	}

	onCloseFile = file => {
		if (!this.handler) return;
		this.handler.onCloseFile(file);
	}

	// handles when files are loaded
	onActivateFile = async file => {
		if (!this.handler) return;
		await this.handler.onActivateFile(file);
		setTimeout(this.syncEvents, 100);
	}

	// check for dependencies and update
	onCompileFile = async file => {
		if (!this.handler) return;
		await this.handler.onCompileFile(file);
		setTimeout(this.syncEvents, 100);
	}

	attachEvent(event) {
		const root = $(this.handler.output);
		const args = [ event.event ];
		if (event.selector) args.push(event.selector);
		args.push(event.action);
		root.on(...args);
	}

	// attaches any events to the preview area
	syncEvents = () => {
		_.each(this.events, event => {
			this.attachEvent(event);	
		});
	}

}

