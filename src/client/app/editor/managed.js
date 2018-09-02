import _ from 'lodash';
import $lfs from '../lfs';
import $brace from 'brace';

// managing text ranges
const Range = $brace.acequire('ace/range').Range;

const SESSION_OPTIONS = {
	tabSize: 2,
	useSoftTabs: false
};

// mappings of extensions to languages
const $languages = {
	pug: 'jade',
	jade: 'jade',
	xml: 'xml',
	yml: 'yaml',
	html: 'html',
	htm: 'html',
	java: 'java',
	json: 'json',
	scss: 'scss',
	sass: 'scss',
	css: 'css',
	cs: 'csharp',
	rb: 'ruby',
	sql: 'sql',
	sq: 'sql',
	md: 'markdown',
	vb: 'vb',
	lua: 'lua',
	js: 'javascript',
	ts: 'typescript',
	py: 'python',
	plain: 'plain'
};

/** common API for managing code */
export default class ManagedEditor {

	constructor(editor) {
		this.instances = [ ];
		this.editor = editor;
	}

	/** clear all undo actions for the file provided (or active file) 
	 * @param {string} [path] the file path to use -- default to current
	*/
	clearUndoHistory(path) {
		const session = path ? this.sessions[path] : this.currentSession;
		if (session) session.getUndoManager().reset();
	}

	/** sets the focus to the editor
	 * @param {number} [line] the line number to focus on
	 * @param {number} [index] the index for the cursor
	 */
	setFocus = (line, index) => {
		this.editor.focus();
		this.editor.gotoLine(line || 0, index || 0, true);
	}

	/** activates a selection range */
	setSelection = (startRow, startColumn, endRow, endColumn) => {
		const range = _.isObject(startRow)
			? startRow
			: new Range(startRow, startColumn, endRow, endColumn);
		this.editor.selection.setRange(range);
	}

	/** removes all file instances */
	clear = () => {
		this.instances.splice(0, this.instances.length);
	}

	/** removes a file from the editor
	 * @param {string} path the path of the file to remove
	 */
	deactivateFile = async path => {
		for (let i = this.instances.length; i-- > 0;) {
			if (this.instances[i].file.path === path)
				this.instances.splice(i, 1);
		}
	}

	/** includes a file for editing */
	activateFile = async file => {
		return new Promise(async resolve => {
			let instance = this.getInstance(file.path);

			// if already open
			if (this.activeInstance && this.activeInstance.file.path === file.path)
				return resolve(this.activeInstance);

			// create the new file, if needed
			if (!instance) {
				const content = await $lfs.read(file.path);

				// create the session info
				const syntax = $languages[file.ext] || $languages.plain;
				const session = $brace.createEditSession(content, `ace/mode/${syntax}`);
				session.setOptions(SESSION_OPTIONS);

				// // create the inactive ranges to dim
				// session.inactive = {
				// 	start: new Range(0, 0, 0, 1),
				// 	end: new Range(0, 0, 0, 1)
				// };

				// // add the inactive ranges
				// session.addMarker(session.inactive.start, 'inactive', 'fullLine');
				// session.addMarker(session.inactive.end, 'inactive', 'fullLine');

				// create the instance
				instance = {
					file, session,

					// helper to access content
					get content() {
						return session.getValue();
					}
				};

				// save for later
				this.instances.push(instance);
			}

			// update the exiting view, if any
			const { activeInstance } = this;
			if (activeInstance)
				activeInstance.selection = this.editor.getSelectionRange();
			
			// set the active session
			this.activeInstance = instance;
			this.editor.setSession(instance.session);
			instance.session.on('change', this.onChanged);

			// give back the instance
			resolve(instance);
		});
	}

	/** sets a new range for the default or specified session
	 * @param {string} path the file to update -- null will use the current
	 * @param {Range} range the range to highlight
	 * @param {string} style the styling to apply
	 */
	setMarker = (path, range) => {

	}

	/** finds an instance of a file using a path 
	 * @param {string} [path] the path to find
	*/
	getInstance = path => {
		return path
			? _.find(this.instances, instance => instance.file.path === path)
			: this.activeInstance;
	}

}
