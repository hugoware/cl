
import _ from 'lodash';
import $keyboard from 'mousetrap';

import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'
import $editor from '../../../../../editor';
import $state from '../../../../../state';
import ManagedEditor from '../../../../../editor/managed';
import { requirePermission } from '../../../prevent';

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
		this.listen('reset', this.onReset);
		this.listen('activate-file', this.onActivateFile);
		this.listen('deactivate-file', this.onDeactivateFile);
		this.listen('activate-project', this.onActivateProject);
		this.listen('rename-item', this.onRenameItem);
		this.listen('execution-finished', this.onExecutionFinished);
		this.listen('save-all', this.onSaveAll);
		this.ui.save.on('click', this.onSaveChanges);

		/** @type {ManagedEditor} */
		this.editor = $editor.createInstance(this.ui.editor[0]);
		this.editor.onChanged = this.onContentChange;

		// allow keyboard shortcuts
		this.ui.editor.find('textarea').addClass('mousetrap');

		// handle keyboard shortcuts
		$keyboard.bind('mod+shift+s', this.onKeyboardShortcutSaveAll);
		$keyboard.bind('mod+s', this.onKeyboardShortcutSave);

		// handle tracking changes
		this.onProcessTimers.interval = setInterval(this.onProcessTimers, 25);
	}

	/** returns the active editor instance for a file
	 * @returns {EditorInstance}
	 */
	get activeInstance() {
		return this.editor.activeInstance;
	}
	
	/** returns the actively edited file
	 * @returns {ProjectItem}
	 */
	get activeFile() {
		return this.activeInstance && this.editor.activeInstance.file;
	}

	// focus selection on the editor, if any
	onExecutionFinished = () => {
		if (!this.isVisible || !this.activeFile) return;
		this.editor.setFocus();
	}

	// tries to save changes
	onKeyboardShortcutSave = event => {
		if (!this.isVisible) return;
		event.preventDefault();
		this.onSaveChanges();
	}

	// tries to save all open files
	onKeyboardShortcutSaveAll = event => {
		this.saveAll();
	}

	// tries to save all open files
	onSaveAll = event => {
		this.saveAll();
	}

	// handles when a project is opened
	onActivateProject = () => {
		delete this.activeFile;
		this.editor.clear();
	}

	// handles when a file is renamed
	onRenameItem = rename => {
		if (!this.activeFile) return;
		
		// kick off a new build
		if (this.activeFile.path === rename.path)
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
	
	// clear out all files
	onReset = () => {
		this.editor.clear();
	}

	// queues up changes to the content manager
	onContentChange = () => {
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
		if (!canSaveFile(this)) return;
		if (this.busy) return;

		// gather the data
		const { file } = this.editor.activeInstance;
		const content = this.editor.getContent(file);
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

	/** handles saving all of the files that are modified */
	saveAll = async () => {
		if (!canSaveFile(this)) return;
		const instances = this.editor.instances || [ ];

		for (let i = 0; i < instances.length; i++) {
			const item = instances[i];
			
			// check for modified file
			const { file } = item;
			if (file.modified) {
				const content = this.editor.getContent(file);
				await $state.saveFile(file.path, content);
			}
		}

		// handles all files being saved
		this.broadcast('save-all-finished');
	}

	/** handles compiling the current file */
	compile() {
		if (!this.editor.activeInstance) return;

		// try and process the file
		const { file, content } = this.editor.activeInstance;
		file.current = content;
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

// checks if this file can be saved or not
function canSaveFile(instance) {
	return requirePermission({
		required: $state.checkPermissions(['SAVE_FILE'], instance.file),
		message: "Can't Save Files",
	});
}