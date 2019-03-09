
import { _, Mousetrap } from '../../../../../lib';

import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'
import $editor from '../../../../../editor';
import $state from '../../../../../state';
import ManagedEditor from '../../../../../editor/managed';
import { requirePermission } from '../../../prevent';
import { cancelEvent } from '../../../../../utils/index';

// the amount of time to wait before compiling
const COMPILER_DELAY = 300;

// resize intervals
const MAINTAIN_INTERVAL = 30;
const MAINTAIN_DURATION = 1000;

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
				save: '.save',
				reset: '.reset',
			}
		});

		// queued compile timers
		this.timers = { };
		this.files = { };

		// keep the editor view resizing whenever a window pops up
		// that would change its height -- for example, the console
		// this will not run unless a timestamp is set to provide 
		// an time limit to refresh
		this.__sync_view = setInterval(this.onMaintainEditorSize, MAINTAIN_INTERVAL);

		// handle events
		this.listen('reset', this.onReset);
		this.listen('activate-file', this.onActivateFile);
		this.listen('deactivate-file', this.onDeactivateFile);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('rename-item', this.onRenameItem);
		this.listen('execution-finished', this.onExecutionFinished);
		this.listen('slide-changed', this.onSlideChanged);
		this.listen('save-all', this.onSaveAll);
		this.listen('save-target', this.onSaveTarget);
		this.listen('close-file', this.onCloseFile);
		this.listen('lesson-finished', this.onLessonFinished);
		this.listen('project-errors', this.onProjectErrors);
		this.ui.save.on('click', this.onSaveChanges);
		this.ui.reset.on('click', this.onResetFile);

		/** @type {ManagedEditor} */
		const disableBraceMatching = !!$state.lesson;
		this.editor = $editor.createInstance(this.ui.editor[0], { disableBraceMatching });
		this.editor.onChanged = this.onChanged;
		this.editor.onSelectionChanged = this.onSelectionChanged;

		// allow keyboard shortcuts
		this.ui.editor.find('textarea').addClass('mousetrap');

		// handle keyboard shortcuts
		Mousetrap.bind('mod+shift+s', this.onKeyboardShortcutSaveAll);
		Mousetrap.bind('mod+s', this.onKeyboardShortcutSave);

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

	/** can this reset files or not
	 * @returns {bool}
	 */
	get canResetFiles() {
		return $state.lesson && !!this.activeFile;
	}

	// matches the editor size for a period of time
	onMaintainEditorSize = () => {
		if ((+new Date) > this.maintainSizeLimit) return;
		// this.editor.editor.resize();
	}

	// need to discard the workspaces
	onCloseFile = file => {
		this.editor.deactivateFile(file.path);
	}

	// done with the lesson
	onLessonFinished = () => {
		// this.editor.clearAllZones();
		this.removeClass('has-reset');
	}

	// make sure to refresh when slides change
	onSlideChanged = () => {
		this.editor.clearUndoHistory();
		// this.editor.editor.resize(true);
		this.updateResetAction();
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
	onSaveAll = () => {
		this.saveAll();
	}

	// handles saving a single file
	onSaveTarget = file => {
		console.log('wants to save', file);
		this.saveTarget(file);
	}

	// handles when a project is opened
	onActivateProject = () => {
		delete this.activeFile;
		this.editor.clear();
		this.activateMaintainSize();
	}

	// handle when the project is exited
	onDeactivateProject = () => {
		this.stopMaintainingSize();
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
		this.stopMaintainingSize();
	}

	// handles selections
	onSelectionChanged = () => {
		// there's no selection event
		if (!(this.activeInstance && $state.lesson && $state.lesson.respondsTo('selection')))
			return;

		const selection = this.editor.getSelection();
		$state.lesson.invoke('selection', selection);
	}

	// queues up changes to the content manager
	onChanged = () => {
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

		this.updateResetAction();
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

		// request the file save
		const { file } = this.editor.activeInstance;
		return await this.saveTarget(file.path);
	}

	// handled when the console log is displayed
	onProjectErrors = () => {
		this.activateMaintainSize();
	}

	// reset the contents for a file
	onResetFile = async () => {
		if (!this.canResetFiles) return;

		// replace the content for the file
		const file = this.activeFile;
		const { restore } = file;
		if (!_.isString(restore)) return;
		
		// replace the content
		file.current = restore;
		this.editor.resetFile(file);

		// refreshes the hint, if any
		this.broadcast('modify-file', file);

		// update the saved version of the file
		await contentManager.update(file.path, file.current);
		$state.lesson.invoke('reset', file);
		$state.lesson.invoke('init', file);
	}

	// shows a restore button if a file has a restore state
	updateResetAction = () => {

		// this won't happen without a lesson
		if (!this.canResetFiles)
			return this.removeClass('has-reset');

		// show the reset button if this file
		// has an available restore state
		this.toggleClassMap({
			'has-reset': !!this.activeFile.restore
		});

	}

	/** saves a specific file
	 * @param {string} path the file path to save
	 */
	saveTarget = async path => {

		// find the file instance
		const instance = _.find(this.editor.instances, item => item.file.path === path);
		if (!instance) {
			console.log('missing instance?');
			return false;
		}

		// gather the data
		const content = this.editor.getContent(path);

		// try and update the project data
		this.busy = true;
		try {
			await $state.saveFile(path, content);
		}
		catch (err) {
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

	// start maintaining the editor size
	activateMaintainSize = () => {
		this.maintainSizeLimit = (+new Date) + MAINTAIN_DURATION;
	}

	// prevents sizes from maintaining
	stopMaintainingSize = () => {
		this.maintainSizeLimit = -1;
	}

}

// checks if this file can be saved or not
function canSaveFile(instance) {
	return requirePermission({
		required: ['SAVE_FILE'],
		args: [ instance.file ],
		message: "Can't Save Files",
	});
}