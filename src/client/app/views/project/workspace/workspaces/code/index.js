
import _ from 'lodash';
import $lfs from '../../../../../lfs';
import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'

// the amount of time to wait before compiling
const COMPILER_DELAY = 500;

/** @typedef {Object} PendingUpdate
 * @param {number} next the next required update
 * @param {string} content the data that should be applied
 */

export default class CodeEditor extends Component {

	constructor() {
		super({
			template: 'workspace-code-editor',

			ui: {
				editor: 'textarea'
			}
		});

		// queued compile timers
		this.timers = { };

		// handle events
		this.ui.editor.on('keyup', this.onChange);
		this.listen('activate-file', this.onActivateFile);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);

	}

	onActivateProject = () => {
		this.onProcessTimers.interval = setInterval(this.onProcessTimers, 25);
	}

	onDeactivateProject = () => {
		clearInterval(this.onProcessTimers.interval);
	}

	// triggers updates for expired timers
	onProcessTimers = () => {
		const now = (+new Date);
		_.each(this.timers, (pending, key) => {

			// hasn't baked long enough
			if (pending.next > now) return;

			// clear the item and trigger the update
			delete this.timers[key];
			contentManager.update(key, pending.content);
		});
	} 

	// handle shwne the editor has changes made
	onChange = () => {
		const data = this.ui.editor.val();
		this.queueUpdate(this.file.path, data);
	}

	// handles when a file is activated (opened or tab selected)
	onActivateFile = async (file) => {
		this.file = file;
		
		// set the raw data value
		const content = await $lfs.read(file.path);
		this.ui.editor.val(content);
	}

	/** adds or updates content for the next compile cycle
	 * @param {string} path the file path updating
	 * @param {string} content the content of the file to update
	 */
	queueUpdate = (path, content) => {
		
		// get the queued entry
		const pending = this.timers[path] = this.timers[path] = { 
			next: (+new Date) + COMPILER_DELAY
		};

		// update the content
		pending.content = content;
	}

}