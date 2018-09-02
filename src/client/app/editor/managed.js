import _ from 'lodash';
import $lfs from '../lfs';
import $brace from 'brace';

const SESSION_OPTIONS = {
	tabSize: 2
};

// mappings of extensions to languages
const $languages = {
	pug: 'pug',
	jade: 'pug',
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

	/** includes a file for editing */
	activateFile = async file => {
		let instance = _.find(this.instances, { path: file.path });

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

		// set the active session
		this.activeInstance = instance;
		this.editor.setSession(instance.session);
		instance.session.on('change', this.onChanged);

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
