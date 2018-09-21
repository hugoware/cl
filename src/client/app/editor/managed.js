import _ from 'lodash';
import $lfs from '../lfs';
import $state from '../state';
import $brace from 'brace';
import { cancelEvent } from '../utils';
import ManagedZone from './zone';
import { listen } from '../events';

// managing text ranges
const Range = $brace.acequire('ace/range').Range;

// empty collection
const EMPTY_ZONES = { };

// default options for new sessions
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

		// keep in sync with lessons
		listen('slide-changed', this.onSlideChanged);

		// setup event handlers
		this.editor.commands.on('exec', this.onExecuteCommand);
	}

	// handles changing between lessons
	onSlideChanged = (lesson, slide) => {
		this.syncZones(this.activeInstance);
	}

	// handle command requests
	onExecuteCommand = event => {

		// can freely edit files
		if (!$state.lesson || $state.freeMode)
			return true;
		
		// make sure there's an instance to work with
		const { command = { } } = event;
		const instance = this.activeInstance;
		if (!instance) return true;
		
		// keyboard nav is allowed always
		if (/^goto(left|right)$/i.test(command.name)
		|| /^goline(down|up)$/i.test(command.name)
		|| /^goto(line|word)(left|right)$/i.test(command.name)
		|| /^select(left|right)$/i.test(command.name)
		|| /^selectword(left|right)$/i.test(command.name)
		|| /^selecttoline(start|end)$/i.test(command.name)
		|| /^gotoline(start|end)$/i.test(command.name)
		|| /^goto(start|end)$/i.test(command.name)
		|| /^selectto(start|end)$/i.test(command.name)
		|| /^select(up|down)$/i.test(command.name)
		|| /^selectall$/i.test(command.name)
		) return;

		// check for a few command that can't be used in lesson mode - 
		// work on fixing these later
		if (/(removeword|removeline|copylines|removeto|movelines|splitline)/i.test(command.name))
			return cancelEvent(event);
		
		// check the key used
		const range = this.editor.getSelectionRange();
		const options = {
			backspace: /backspace/i.test(command.name),
			del: /del/i.test(command.name),
		};

		// check each active zone for editing
		let allow;
		const zones = instance.zones || EMPTY_ZONES;
		for (const id in zones) {
			const zone = zones[id];

			// if any zone allows the edit, assume it's okay
			if (zone.isActive && zone.allowEdit(event, range, options)) {
				allow = true;
				break;
			}
		}
		
		// cancel if not allowed
		if (!allow)
			return cancelEvent(event);
		
		// update the zones
		setTimeout(() => {
			for (const id in zones)
				zones[id].sync();
		});
		
	}

	/** clear all undo actions for the file provided (or active file) 
	 * @param {string} [path] the file path to use -- default to current
	*/
	clearUndoHistory = path => {
		console.warn('need to be done');
		// const reset = path ? [_.find(this.instances, )]
		

		// const session = path ? this.sessions[path] : this.currentSession;
		// if (session) session.getUndoManager().reset();
	}

	/** sets the focus to the editor
	 * @param {number} [line] the line number to focus on
	 * @param {number} [index] the index for the cursor
	 */
	setFocus = (line, index) => {
		this.editor.focus();

		// focus the view
		if (_.isNumber(line) && _.isNumber(index)) {
			this.editor.gotoLine(line, index, true);
		}
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
		delete this.activeInstance;
		this.editor.setValue('');
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

				// create the handler for content changes
				session.on('change', this.onChanged);

				// create all of the zones for this file
				const zones = { };
				if ($state.lesson) {

					// create each zone
					const availableZones = $state.lesson.getZones(file.path);
					_.each(availableZones, (zone, id) => {
						const instance = new ManagedZone(id, zone, session);
						zones[id] = instance;
					});
				}

				// create the instance
				instance = {
					file, session, zones,

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
			this.syncZones(instance);

			// give back the instance
			resolve(instance);
		});
	}

	// sync zones to the current state
	syncZones = instance => {
		if (!instance || !$state.lesson) return;
		
		// update zones
		const { zones } = instance;
		_.each(zones, zone => zone.sync(true));
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
