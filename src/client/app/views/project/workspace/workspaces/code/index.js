
import _ from 'lodash';
import $lfs from '../../../../../lfs';
import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'
import $editor from '../../../../../editor';

// the amount of time to wait before compiling
const COMPILER_DELAY = 300;

/** @typedef {Object} PendingUpdate
 * @param {number} next the next required update
 * @param {string} content the data that should be applied
 */

export default class CodeEditor extends Component {

	constructor() {
		super({
			template: 'workspace-code-editor',

			ui: {
				editor: '.editor'
			}
		});

		// queued compile timers
		this.timers = { };
		this.files = { };

		// handle events
		this.ui.editor.on('keyup', this.onChange);
		this.listen('activate-file', this.onActivateFile);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);

		// create the code editor
		this.editor = $editor.createInstance(this.ui.editor[0]);
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

		const data = this.model.getValue();
		console.log(data);

		// const data = this.ui.editor.val();
		this.queueUpdate(this.file.path, data);
	}

	// handles when a file is activated (opened or tab selected)
	onActivateFile = async (file) => {
		this.file = file;

		// check if already created
		let model = this.files[file.path];
		if (model) {
			this.model = model;
			this.editor.setModel(model);
			return;
		}

		// set the raw data value
		const content = await $lfs.read(file.path);
		const language = $editor.getLanguage(file.path);
		console.log('using lang', language);
		
		// save the model instance
		this.model = model = $editor.editor.createModel(content, language);
		this.files[file.path] = model;
		this.editor.setModel(model);
	}

	/** adds or updates content for the next compile cycle
	 * @param {string} path the file path updating
	 * @param {string} content the content of the file to update
	 */
	queueUpdate = (path, content) => {
		
		// get the queued entry
		const pending = this.timers[path] = this.timers[path] || { 
			next: (+new Date) + COMPILER_DELAY
		};

		// update the content
		pending.content = content;
	}

}