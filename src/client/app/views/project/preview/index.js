import _ from 'lodash';
import $ from 'jquery';
import Component from '../../../component';

// different preview modes
import BrowserMode from './browser';

export default class Preview extends Component {

	constructor(context) {
		super({
			context,
			template: 'preview',

			ui: {
				content: '.preview-wrapper'
			}
		});

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('activate-file', this.onActivateFile);
		this.listen('compile-file', this.onCompileFile);
		this.listen('close-file', this.onCloseFile);
	}

	// changes the display mode for the project
	setMode = mode => {

		// manually replace all modes
		let cx = this.attr('class') || '';
		cx = cx.replace(/mode\-[a-z]+/, '');
		cx = cx.replace(/ +/, ' ');
		cx = _.trim(cx);
		cx += ` mode-${mode}`;

		// change the handler depending on the mode
		this.handler = ({
			browser: new BrowserMode(this)
		})[mode];

		// update the value
		this.handler.appendTo(this.ui.content);
		this.attr('class', cx);
	}

	// prepare the preview window
	onActivateProject = async () => {
		this.setMode('browser');
		this.handler.onActivateProject();
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

