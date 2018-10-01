import _ from 'lodash';
import $lfs from '../lfs';
import $state from '../state';
import $brace from 'brace';
import { cancelEvent } from '../utils';
import ManagedZone from './zone';
import { listen , broadcast} from '../events';

// managing text ranges
const Range = $brace.acequire('ace/range').Range;

// empty collection
const EMPTY_ZONES = { };
const ROW_OFFSET = 1000000;

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
	onSlideChanged = () => {
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

		console.log('managed:', event.command.name, event);
		
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
			|| /^esc$/i.test(command.name)
			) return;

		// check for a few command that can't be used in lesson mode - 
		// work on fixing these later
		if (/(removeword|removeline|copylines|removeto|movelines|splitline)/i.test(command.name))
			return cancelEvent(event);

		// make sure the file can even be changed
		const canEditFile = $state.lesson.canEditFile(instance.file.path);
		
		// check the key used
		const zones = instance.zones || EMPTY_ZONES;
		
		// without zones, just use the file status
		if (zones.length === 0)
			return !canEditFile ? cancelEvent(event) : true;

		// gather up insertion information
		const { session, content } = this.activeInstance;
		const newline = session.doc.getNewLineCharacter();
		const selection = this.editor.getSelectionRange();
		const text = (event.args || '').toString();
		const totalNewLines = text.split(newline).length - 1;
		const hasNewLines = totalNewLines > 0;
		const lines = content.split(newline);

		// create the options to check with
		const options = {
			selection, event, zones,
			hasNewLines, totalNewLines,
			lines, newline,
			isInsert: /insert/i.test(command.name),
			isBackspace: /backspace/i.test(command.name),
			isDelete: /del/i.test(command.name)
		};

		// check that this edit is allowed
		const canEdit = isEditAllowed(this, options);
		if (!canEdit) {
			this.editor.setOptions({ enableBasicAutocompletion: false, enableLiveAutocompletion: false });
			return cancelEvent(event);
		}

		// execute?
		this.editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true });
		command.exec(this.editor, event.args);
		options.after = this.editor.getSelectionRange();
		options.updated = this.activeInstance.content;

		// apply the update - if the update fails
		// then the even will be canceled
		updateZones(this, options);
		return cancelEvent(event);
	}

	/** clear all undo actions for all files
	*/
	clearUndoHistory = path => {
		_.each(this.instances, instance => {
			instance.session.getUndoManager().reset();
		});
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

				// determine the content source
				let content;

				// if this is a lesson, we need to make sure that the file
				// doesn't have a semi-modified state - This is when the file
				// is changed because of a collapse/expand, but not saved
				const { lesson } = $state;
				if (lesson) {
					const modified = lesson.getModified(file.path);
					if (modified) {
						content = modified;

						// also need to mark it as modified
						file.modified = true;
						broadcast('modify-file', file);
					}
				}

				// without content, just read it normally
				if (!content)
					content = await $lfs.read(file.path);

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

	// deactivates all zones
	clearZones = () => {
		_.each(this.instances, instance => {
			_.each(instance.zones, zone => zone.clear());
		});
	}

	/** finds an instance of a file using a path 
	 * @param {string} [path] the path to find
	*/
	getInstance = path => {
		return path
			? _.find(this.instances, instance => instance.file.path === path)
			: this.activeInstance;
	}

	/** returns the content for a file, making sure to replace
	 * any collapsed areas before showing the changes 
	 * @param {ProjectItem} file the file that should be found
	 * */
	getContent = file => {
		const instance = _.find(this.instances, instance => instance.file.path === file.path);
		const content = instance.session.getValue();
		return content;
	}

}

// creates a fake index
function toIndex(range) {
	return (range.row * ROW_OFFSET) + range.column;
}

// checks if an edit can be used
function isEditAllowed(instance, options) {

	// check if this falls within range
	const {
		isBackspace, isDelete, isInsert,
		zones, selection, hasNewLines, lines,
	} = options;

	// get the selection range
	const selectionStart = toIndex(selection.start);
	const selectionEnd = toIndex(selection.end);
	
	// start checing each zone
	for (const id in zones) {
		const zone = zones[id];
		
		// can't even be edited
		if (!zone.isEditable) continue;

		// get the current index values
		const zoneStart = toIndex(zone.range.start);
		const zoneEnd = toIndex(zone.range.end);
		
		// check if this is outside the range
		if (selectionStart < zoneStart ||
			selectionEnd < zoneStart ||
			selectionStart > zoneEnd ||
			selectionEnd > zoneEnd)
			continue;

		// start checking special conditions
		const startAtStart = selectionStart === zoneStart;
		const startAtEnd = selectionStart === zoneEnd;
		const endAtStart = selectionEnd === zoneStart;
		const endAtEnd = selectionEnd === zoneEnd;

		if (isBackspace) {

			// not a selection and is at the start of the
			// range, can't backspace any further
			if (startAtStart && endAtStart)
				continue;

		}
		else if (isDelete) {

			// not a seleciton and trying to delete characters
			// outside the range of the box
			if (startAtEnd && endAtEnd)
				continue;

		}
		else if (isInsert) {

			if (hasNewLines && !zone.isMultiLine)
				continue;

		}

		// appears this is okay
		return true;

	}

	// failed all checks
	return false;
	
}

// applies the update
function updateZones(instance, options) {
	const { selection, after, zones, updated, event, newline, isInsert, isBackspace, isDelete } = options;
	const before = selection;

	// check the diff for the events
	// const insertedAtNewline = after.end.column;
	const lineChanges = after.end.row - before.end.row;
	const rev = updated.split(newline);
	
	// start updating each line
	// const ss = before.start;
	const se = before.end;

	// a list of actual changes to perform
	const adjustments = [ ];

	// start processing each zone
	for(const id in zones) {
		const zone = zones[id];

		// get some common checks done
		const zs = zone.range.start;
		const ze = zone.range.end;

		// tracking if this was changed or not
		let updated;

		// inserting rows
		if (zs.row > se.row) {
			zs.row += lineChanges;
			updated = true;
		}

		// moved down a row
		if (ze.row >= se.row) {
			ze.row += lineChanges;
			ze.column = rev[ze.row].length;
			updated = true;
		}

		// if it was changed, refresh it
		if (updated)
			zone.update();
	
	}

	// apply each adjustment
	_(adjustments)
		.map(adjust => {
			adjust.cursor[adjust.type] += adjust.delta;
			return adjust.zone;
		})
		.uniqBy('id')
		.each(zone => zone.update());

	// was successful
	return true;
}

