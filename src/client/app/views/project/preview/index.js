import _ from 'lodash';
import Component from '../../../component';

// different preview modes
import BrowserMode from './browser';

export default class Preview extends Component {

	constructor(context) {
		super({
			context,
			template: 'preview',

			ui: {
				output: '.content iframe',
				url: '.url input'
			}
		});

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('activate-file', this.onActivateFile);
		this.listen('compile-file', this.onCompileFile);

		// preview area setup
		this.ui.output.on('load', event => {
			const frame = event.target;
			const root = frame.contentWindow.document.body;
			root.innerHTML = '';
			
			// attach the helper script file
			const script = document.createElement('script');
			script.setAttribute('src', '/__codelab__/browser.js');
			script.setAttribute('type', 'text/javascript');
			root.appendChild(script);
		});
	}

	/** access to the output window
	 * @type {HTMLElement} the preview DOM element
	 */
	get output() {
		return this.context.document.body;
	}

	/** returns the window context for the preview */
	get context() {
		return this.ui.output[0].contentWindow;
	}

	/** access to helper scripts for the main window */
	get bridge() {
		return this.context.__CODELAB__;
	}

	// /** access to an object to communicate between local */
	// get previewAPI() {
	// 	return window.__CODELAB__.preview;
	// }

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
		this.attr('class', cx);
	}

	// prepare the preview window
	onActivateProject = async () => {
		this.setMode('browser');
		this.handler.onActivateProject();
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

