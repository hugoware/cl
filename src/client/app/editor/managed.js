import _ from 'lodash';
import $lfs from '../lfs';
import $state from '../state';
import $brace from 'brace';
import { cancelEvent } from '../utils';
import ManagedZone from './zone';
import { listen , broadcast} from '../events';
import ZoneMap from '../zone-map';

// managing text ranges
const Range = $brace.acequire('ace/range').Range;

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
	ts: 'javascript',
	py: 'python',
	plain: 'plain'
};

/** common API for managing code */
export default class ManagedEditor {

	constructor(editor) {
		this.instances = [ ];
		this.editor = editor;
		window.EDITOR = editor;

		// keep in sync with lessons
		listen('slide-changed', this.onSlideChanged);
		listen('set-editor-cursor', this.onSetCursor);
		listen('set-editor-focus-point', this.onSetFocusPoint);

		// prevent auto complete events when
		// an entry is not allowed - check if there's
		// a better way to handle this
		this.editor.setOptions({ enableBasicAutocompletion: false, enableLiveAutocompletion: false });

		// setup event handlers
		this.editor.commands.on('exec', this.onExecuteCommand);
		this.editor.on('mousedown', () => this.isMouseDown = true);
		this.editor.on('mouseup', () => this.isMouseDown = false);
	}

	// handles changing between lessons
	onSlideChanged = () => {
		if (!this.activeInstance) return;
		const instance = this.activeInstance;

		// check if the content changed
		const map = instance.map;
		if (!map) return;

		// check for changes
		if (instance.lastContentUpdate || 0 < map.lastUpdate) {
			let content = map.content;
			content = content.split(/\n/g).join(instance.session.doc.getNewLineCharacter());
			instance.session.setValue(map.content);
		}

			// always sync cursor states
		this.syncZones(this.activeInstance);
		setTimeout(() => this.editor.resize());
	}

	// HACK: the row for setCursor wants an extra line down from the
	// exact same coordinates used by setRange - I don't know why
	/** changes the cursor for a file */
	onSetCursor = cursor => {	
		const result = parseCursorRequest(this, cursor);
		if (!result) return;

		// check for the range
		const { start, end } = result;
		if (!(start || end)) return;

		// set the cursor position
		setTimeout(() => {
			if (start && end)
				this.setRange(start, end);
			else if (start)
				this.setCursor(start.row, start.column);
		}, 200);
	}

	// sets the focus point position
	onSetFocusPoint = position => {
		if (!this.activeInstance) return;

		const instance = this.activeInstance;
		const { session, content } = instance;
		const { doc, focusPoint } = session;
		const total = content.length - 1;

		// get the index
		let startAt = Math.min(total, position.start);
		let endAt = Math.max(startAt, Math.min(total, position.end - 1));

		// if this is a newline, then move forward by one more
		const range = content.substr(position.start, position.end - position.start);
		const empty = _.trim(range).length === 0;
		const isNewLine = instance.session.doc.getNewLineCharacter() === range;
		if (isNewLine) {
			startAt++;
			endAt++;
		}
		
		// update the position
		const end = doc.indexToPosition(endAt);
		const start = endAt !== startAt ? doc.indexToPosition(startAt) : end;

		// make sure the line numbers match
		if (position.line !== start.row) {
			start.row = end.row = position.line;
			start.col = end.col = 0;
		}

		// update the range
		focusPoint.clazz = `focus_point text ${empty ? '' : 'highlighted'}`;
		focusPoint.range.start.row = start.row;
		focusPoint.range.start.column = start.column;
		focusPoint.range.end.row = end.row;
		focusPoint.range.end.column = end.column;
		focusPoint.range.end.column++;

	}

	// handle command requests
	onExecuteCommand = event => {
		
		// can freely edit files
		if (!$state.lesson || $state.freeMode)
		return true;
		
		// weird issue happenw when holding down the mouse
		// it acts like a continued selection and will 
		// insert and replace wherever the cursor is at
		if (this.isMouseDown)
			return cancelEvent(event);
			
		// make sure there's an instance to work with
		const { command = { } } = event;
		const instance = this.activeInstance;
		if (!instance) return true;
		const { map } = instance;

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

		// handle undos
		if (/(undo|redo|cut|paste)/i.test(command.name)) {
			console.warn('BLOCKED ADVANCED COMMAND');
			return cancelEvent(event);
		}

		// make sure the file can even be changed
		const canEditFile = $state.lesson.canEditFile(instance.file.path);
		
		// without zones, just use the file status
		if (!(map && canEditFile))
			return !canEditFile ? cancelEvent(event) : true;

		// gather up insertion information
		const newline = instance.session.doc.getNewLineCharacter();
		const text = (event.args || '').toString();
		const includesNewLine = text.split(newline).length - 1;
		
		// create the options to check with
		const isInsert = /insert/i.test(command.name);
		const isBackspace = !isInsert && /backspace/i.test(command.name);
		const isDelete = !isBackspace && /del/i.test(command.name);
		const isComment = !isDelete && /comment/i.test(command.name);
		const test = isInsert ? map.canInsert
			: isBackspace ? map.canBackspace
			: isDelete ? map.canDelete
			: isComment ? map.canToggleComment
			: null;
		
		// not sure what the request is
		if (!test)
			return false;
		
		// test the action
		const selection = this.editor.getSelectionRange();

		// the zone-map works with 1 based index... my mistake
		selection.start.row++;
		selection.start.column++;
		selection.end.row++;
		selection.end.column++;

		// test the range
		const startIndex = map.getIndex(selection.start.row, selection.start.column);
		const endIndex = map.getIndex(selection.end.row, selection.end.column);
		const zone = map.getZone(startIndex, endIndex, true);
		const allowed = test(startIndex, endIndex, includesNewLine);

		// if it's allowed, apply the change and then update
		if (allowed) {
			this.editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true });

			// since this is allowed, we're going to execute the command first
			// so we can compare the before and after and check if there were
			// additional characters added -- for example, a new line that also
			// performs and auto indent
			const before = this.activeInstance.content;
			command.exec(this.editor, event.args);

			// when inserting new characters, check and see
			// if this has extra characters that are not reported
			// by the command args
			const after = this.activeInstance.content;
			const delta = after.length - before.length;

			// perform the action in the zonemap
			map.setContent(after);
			map.shiftZones(
				zone,
				selection.start.row, selection.start.column,
				selection.end.row, selection.end.column,
				delta
			);

			// update all zones
			this.syncZones(instance);	
		}

		// always cancel the event since it will be
		// executed by success events
		return cancelEvent(event);
	}

	/** clear all undo actions for all files
	*/
	clearUndoHistory = () => {
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

	/** resets the active file to a prior state */
	resetFile = file => {
		// reset zones??
		this.editor.setValue(file.current, 1);
		this.editor.clearSelection();
		this.editor.focus();
	}

	/** removes a file from the editor
	 * @param {string} path the path of the file to remove
	 */
	deactivateFile = async path => {

		// if this is the current file
		if (this.activeInstance && this.activeInstance.file.path === path);
			delete this.activeInstance;

		// remove from other instances
		for (let i = this.instances.length; i-- > 0;) {
			if (this.instances[i].file.path === path)
				this.instances.splice(i, 1);
		}
	}

	/** includes a file for editing */
	activateFile = async file => {
		return new Promise(async resolve => {
			let instance = this.getInstance(file.path);

			// disable brace matching when using a lesson
			// to help improve code comparisons and help students
			// learn to remember both sides of bracing
			this.editor.setBehavioursEnabled(!$state.lesson);

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

				// used when needing to focus on something that's not a zone
				const focus = new Range(0, 0, 0, 1);
				const index = session.addMarker(focus);
				session.focusPoint = session.getMarkers()[index];
				session.focusPoint.clazz = 'focus_point text';

				// the the map and zones for this file, if any
				let map;
				let zones;
				if ($state.lesson) {
					map = $state.lesson.maps[file.path];
					zones = map && _.map(map.zones, (zone, id) => {
						return new ManagedZone(id, zone, session);
					});
				}

				// create the instance
				instance = {
					file, session, map, zones,

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

	/** sets the position of the cursor 
	 * @param {number} row the row to focus to
	 * @param {number} col the column to focus at
	*/
	setCursor = (row, col) => {
		this.editor.focus();
		this.editor.gotoLine(row, col, true);
		this.editor.renderer.scrollToRow(row);
		this.editor.resize();
	}

	/** sets the selected text range
	 * @param {Position} start the starting selection range
	 * @param {Position} end the ending selection range
	 */
	setRange = (start, end) => {
		const range = new Range(start.row, start.column, end.row, end.column);
		
		// create the range and set the position
		this.editor.focus();
		this.editor.selection.setRange(range);
		this.editor.renderer.scrollToRow(start.row);
		this.editor.resize();
	}

	// sync zones to the current state
	syncZones = instance => {
		if (!(instance && instance.map)) return;

		// update each zone
		const { zones } = instance;
		_.each(zones, zone => zone.sync());
	}

	// deactivates all zones
	clearAllZones = () => {
		// _.each(this.instances, instance => {
		// 	_.each(instance.zones, zone => zone.clear());
		// });

		// // force a refresh
		// this.editor.resize();
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

// evaluates a cursor position request
function parseCursorRequest(instance, cursor) {
	const { activeInstance } = instance;
	if (!activeInstance) return;

	// string is a zone by default
	if (_.isString(cursor))
		cursor = { zone: cursor };

	// setting the range
	let start, end;
	if (cursor.zone) {

		// no map to work with
		const { map } = activeInstance;
		if (!map) return;
		const zone = map.zones[cursor.zone];

		// missing the zone required, or invalid
		if (!zone || (zone && !zone.start))
			return;

		// determine where to work from
		const startAt = zone.start;
		const endAt = zone.end || startAt;

		// place the cursor at the end of the zone
		if (cursor.at === 'end')
			start = { row: endAt.row, column: endAt.col };

		// place the cursor at the start of the zone
		else if (cursor.at === 'start')
			start = { row: startAt.row, column: startAt.col };

		// select the entire zone range
		else {
			start = { row: startAt.row, column: startAt.col };
			end = { row: endAt.row, column: endAt.col };
		}

	}
	// check for row/columns
	else if (cursor.at || cursor.start) {
		const startAt = cursor.at || cursor.start;
		start = { row: startAt.row, column: startAt.col };
		end = cursor.end ? { row: cursor.end.row, column: cursor.end.col } : null;
	}
	// check for specific coordinates
	else if (_.isNumber(cursor.row) && _.isNumber(cursor.col))
		start = { row: cursor.row, column: cursor.col };

	// fix to match the app coordinate offsets
	if (start) {
		start.row--;
		start.column--;
	}

	if (end) {
		end.row--;
		end.column--;
	}

	// give back the range
	return { start, end };
}