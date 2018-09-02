
import _ from 'lodash';

import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'
import $editor from '../../../../../editor';
import $state from '../../../../../state';
import $api from '../../../../../api';
import ManagedEditor from '../../../../../editor/managed';

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
		this.listen('rename-item', this.onRenameItem);
		this.ui.save.on('click', this.onSaveChanges);

		/** @type {ManagedEditor} */
		this.editor = $editor.createInstance(this.ui.editor[0]);
		this.editor.onChanged = this.onContentChange;

		// handle tracking changes
		this.onProcessTimers.interval = setInterval(this.onProcessTimers, 25);
	}

	// handles when a project is opened
	onActivateProject = () => {
		delete this.activeFile;

		// clear all files
		_.each(this.files, (file, key) => {
			delete this.files[key];
		});
	}

	// handles when a file is renamed
	onRenameItem = rename => {
		if (!(this.files[rename.previous.path]))
			return; 

		// swap the two names
		this.files[rename.path] = this.files[rename.previous.path]
		delete this.files[rename.previous.path];

		// kick off a new build
		this.compile();
	}

	// triggers updates for expired timers
	onProcessTimers = () => {
		if (!this.pending)
			return;

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
		console.log('did get a change');
		this.compile();
	}

	// handles when a file is activated (opened or tab selected)
	onActivateFile = async file => {
		
		// make sure this is appropriate
		if (file.type !== 'code')
			return;

		// make sure to activate the file
		const instance = await this.editor.activateFile(file);

		// update the view
		if (instance.selection)
			this.editor.setSelection(instance.selection);
	}

	// handles deleting an active file instance
	onDeactivateFile = async file => {
		await this.editor.deactivateFile(file.path);
	}

	// write file content -- might consider waiting for
	// the next compile event later, but that'll only happen
	// if someone is being silly and trying to type/click save
	// in less than a second
	onSaveChanges = async () => {
		if (this.busy) return;

		// gather the data
		const { content, file } = this.editor.activeInstance;
		const { path } = file;

		// try and update the project data
		this.busy = true;
		try {
			await $state.saveFile(path, content);
		}
		catch(err) {
			console.log(err);
		}
		finally {
			this.busy = false;
		}

	}

	/** handles compiling the current file */
	compile() {
		if (!this.editor.activeInstance) return;

		// try and process the file
		const { file, content } = this.editor.activeInstance;
		this.queueUpdate(file.path, content);
	}

	/** adds or updates content for the next compile cycle
	 * @param {string} path the file path updating
	 * @param {string} content the content of the file to update
	 */
	queueUpdate = (path, content) => {
		const instance = this.editor.getInstance(path);
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