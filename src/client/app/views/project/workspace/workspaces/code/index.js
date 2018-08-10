
import _ from 'lodash';
import $lfs from '../../../../../lfs';
import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'
import $editor from '../../../../../editor';
import $state from '../../../../../state';
import $api from '../../../../../api';

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
				editor: '.editor',
				save: '.save'
			}
		});

		// queued compile timers
		this.timers = { };
		this.files = { };

		// handle events
		this.listen('activate-file', this.onActivateFile);
		this.listen('deactivate-file', this.onDeactivateFile);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.ui.save.on('click', this.onSaveChanges);

		// create the code editor
		this.editor = $editor.createInstance(this.ui.editor[0]);
		this.editor.onDidChangeModelContent(this.onContentChange);
	}

	onActivateProject = () => {
		this.onProcessTimers.interval = setInterval(this.onProcessTimers, 25);
	}

	onDeactivateProject = () => {
		clearInterval(this.onProcessTimers.interval);
	}

	// triggers updates for expired timers
	onProcessTimers = () => {
		if (!this.pending) return;

		// hasn't baked long enough
		const now = +new Date;
		if (this.pending.next > now) return;

		// appears to be good to go, kick off the compile
		const { content, path } = this.pending;
		delete this.pending;
		contentManager.update(path, content);
	} 

	// queues up changes to the content manager
	onContentChange = () => {
		const { model, file } = this.activeFile;
		const data = model.getValue();
		this.queueUpdate(file.path, data);
	}

	// handles when a file is activated (opened or tab selected)
	onActivateFile = async file => {
		const { path } = file;

		// check if creating a new model or not
		let instance = this.files[path];
		if (!instance) {

			// read the current content value
			const content = await $lfs.read(path);
			const language = $editor.getLanguage(path);
			const model = $editor.editor.createModel(content, language);
			instance = { file, content, model };

			// save the file reference
			this.files[path] = instance;
		}

		// set the active file
		this.activeFile = instance;
		this.editor.setModel(instance.model);
	}

	// handles deleting an active file instance
	onDeactivateFile = async file => {
		delete this.files[file.path];
	}

	// write file content -- might consider waiting for
	// the next compile event later, but that'll only happen
	// if someone is being silly and trying to type/click save
	// in less than a second
	onSaveChanges = async () => {
		if (this.busy) return;

		// gather the data
		const { model, file } = this.activeFile;
		const { path } = file;
		const content = model.getValue();

		// try and update the project data
		this.busy = true;
		try {
			await $state.saveFile(path, content);
		}
		catch(err) {
			console.log(err);
			// handleError(err, {
				
			// });
		}
		finally {
			this.busy = false;
		}

	}

	/** adds or updates content for the next compile cycle
	 * @param {string} path the file path updating
	 * @param {string} content the content of the file to update
	 */
	queueUpdate = (path, content) => {
		const instance = this.files[path];
		if (!instance) return;

		// check if something weird happened - in this case
		// the requested change file is different than the
		// current pending compile request
		if (this.pending && this.pending.path !== path)
			delete this.pending;
		
		// get the queued entry
		this.pending = this.pending || { 
			next: (+new Date) + COMPILER_DELAY,
			path
		};

		// update the content
		instance.file.modified = true;
		this.broadcast('modify-file', instance.file);
		this.pending.content = content;
	}

}