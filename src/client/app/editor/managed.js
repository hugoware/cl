import { $, _, Brace } from '../lib';
import $lfs from '../lfs';
import $state from '../state';
import { cancelEvent } from '../utils';
import { listen , broadcast } from '../events';

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

		// access to the managed editor
		$state.editor = this;

		// keep in sync with lessons
		listen('slide-changed', this.onSlideChanged);
		listen('set-working-area', this.onSetWorkingArea);
		listen('clear-working-area', this.onClearWorkingArea);
		listen('set-editor-cursor', this.onSetCursor);
		listen('set-editor-focus-point', this.onSetFocusPoint);
		listen('set-editor-readonly', this.onSetReadOnly);

		// prevent auto complete events when
		// an entry is not allowed - check if there's
		// a better way to handle this
		this.editor.setOptions({ enableBasicAutocompletion: false, enableLiveAutocompletion: false });

		// handle events
		this.editor.commands.on('exec', this.onExecuteCommand);
		this.editor.on('mousedown', () => { this.isMouseDown = true; });

		// handle releasing
		const handleSelectionEvent = _.debounce(() => {
			if (this.isMouseDown) return;
			this.onSelectionChanged(event);
		}, 300);

		// handle releasing the mouse
		const handleRelease = () => {
			this.isMouseDown = false;
			handleSelectionEvent();
		};

		$(window).on('mouseup', handleRelease);
		this.editor.on('mouseup', handleRelease);

		// handle selection events
		this.editor.on('changeSelection', event => {
			setTimeout(handleSelectionEvent, 250);
		});
	}

	onSetZone = options => { }
	onClearZone = options => { }
	onClearAllZones = () => { }

	// sets the readonly state
	onSetReadOnly = (file, readOnly) => {
		$state.paths[file].readOnly = !!readOnly;
	}

	// handles changing between lessons
	onSlideChanged = () => {
		// if (!this.activeInstance) return;
		// const instance = this.activeInstance;

		// // check if the content changed
		// const map = instance.map;
		// if (!map) return;

		// // check for changes
		// if (instance.lastContentUpdate || 0 < map.lastUpdate) {
		// 	let content = map.content;
		// 	content = content.split(/\n/g).join(instance.session.doc.getNewLineCharacter());
		// 	instance.session.setValue(map.content);
		// }

		// 	// always sync cursor states
		// this.syncZones(this.activeInstance);
		setTimeout(() => this.editor.resize());
	}

	// HACK: the row for setCursor wants an extra line down from the
	// exact same coordinates used by setRange - I don't know why
	/** changes the cursor for a file */
	onSetCursor = cursor => {
		this.setCursor(cursor);
	}

	// sets the focus point position
	onSetFocusPoint = options => {
		if (!this.activeInstance) return;

		const instance = this.activeInstance;
		const { session, focusPoint, workingArea, content } = instance;
		const { doc } = session;

		// check for a working area offset
		if (instance.hasWorkingArea && options.adjustForWorkingArea !== false) {
			const offset = doc.positionToIndex(workingArea.range.start);
			options.start += offset;
			options.end += offset;
		}

		// shift for newlines
		// const char = content.substr(options.start, 1);

		// determine the position
		const range = getPosition(this, options, { requireRange: true });
		const text = doc.getTextRange(range);
		const isNewLine = doc.getNewLineCharacter() === text;
		
		// get a useful range
		const start = range.start;
		const end = range.end;
		const style = start.row === end.row ? 'text' : 'line';

		// set the focus point
		focusPoint.clazz = `focus_point ${style} ${isNewLine ? 'as-new-line' : ''}`;
		focusPoint.range.start.row = start.row;
		focusPoint.range.start.column = start.column;

		// just in case
		const samePosition = end.row === start.row && end.column === start.column;
		const invalidPosition = end.row <= start.row || (end.row === start.row && end.column < start.column);
		
		// replace the posiiton, if needed
		if (samePosition || invalidPosition) {
			end.row = start.row;
			end.column = start.column + 1;
		}

		// update the end
		focusPoint.range.end.row = end.row;
		focusPoint.range.end.column = end.column;

		// update the cursor
		this.editor.resize(true);
	}

	// stops tracking the working area
	onClearWorkingArea = () => {
		if (!this.activeInstance) return;
		this.activeInstance.hasWorkingArea = false;
	}

	// sets the focus point position
	onSetWorkingArea = (options) => {
		const { path } = options;

		// find the working instance, if any
		const instance = this.getInstance(path);
		if (!instance) {

			// since it's not open yet, update the file
			// throw 'NotImplemented: set area and update when opening';
			
		}

		// update the active instance
		const { workingArea } = instance;

		// determine the position
		const isLine = !!(options.line || options.asLine || options.isLine);
		const range = getPosition(this, options, {
			offsetStart: -1,
			isLine,
			requireRange: true 
		});
		instance.hasWorkingArea = true;
		
		// get a useful range
		const start = range.start;
		const end = range.end;

		// set the focus point
		workingArea.clazz = `working_area ${isLine ? 'line' : 'text'}`;
		workingArea.isLine = isLine;
		workingArea.range.start.row = start.row;
		workingArea.range.start.column = start.column;
		workingArea.range.end.row = end.row;
		workingArea.range.end.column = end.column;

		// update the cursor
		this.editor.resize(true);
	}

	// handle command requests
	onExecuteCommand = event => {
		const instance = this.activeInstance;
		if (!(instance && $state.lesson)) return true;

		// make sure it's not readonly
		if (instance.file.readOnly) {
			$state.lesson.invoke('tryEditReadOnly', instance.file);
			return cancelEvent(event);
		}

		// weird issue happenw when holding down the mouse
		// it acts like a continued selection and will 
		// insert and replace wherever the cursor is at
		if (this.isMouseDown)
			return cancelEvent(event);

		// make sure there's an instance to work with
		const { session, hasWorkingArea, workingArea } = instance;
		const { doc } = session;
		const { command = {} } = event;

		// create the options to check with
		const newline = doc.getNewLineCharacter();
		const change = { };
		change.isInsert = /insert/i.test(command.name);
		change.isBackspace = !!(!change.isInsert && /backspace/i.test(command.name));
		change.isDelete = !!(!change.isBackspace && /del/i.test(command.name));
		change.isComment = !!(!change.isDelete && /comment/i.test(command.name));
		change.data = _.toString(event.args);
		change.isNewline = change.isNewLine = event.args === newline;
		change.hasNewline = change.hasNewLine = change.hasNewlines = change.hasNewLines = (change.isNewline || (change.data.split(newline).length > 1));
		
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

		// get the ranges
		if (hasWorkingArea) {
			const { doc } = session;
			const selection = this.editor.getSelectionRange();
			const area = workingArea.range;
			const selectionStartIndex = doc.positionToIndex(selection.start);
			const selectionEndIndex = doc.positionToIndex(selection.end);
			
			// start offset is always nudged forward by one because when it's created
			// it's shifted back a little bit - this is because if the marker is ever
			// adjusted, it'll move forward - this makes sure that you can't ever get
			// fully to the front of the selection and will prevent it from destroying
			// the working area range
			const areaStartIndex = doc.positionToIndex(area.start) + 1;
			const areaEndIndex = doc.positionToIndex(area.end);
			const startAtStart = selectionStartIndex === areaStartIndex;
			const startAtEnd = selectionStartIndex === areaEndIndex;
			const endAtStart = selectionEndIndex === areaStartIndex;
			const endAtEnd = selectionEndIndex === areaEndIndex;
			const startInRange = selectionStartIndex >= areaStartIndex && selectionStartIndex <= areaEndIndex;
			const endInRange = selectionEndIndex >= areaStartIndex && selectionEndIndex <= areaEndIndex;
			const backspaceAtFront = change.isBackspace && startAtStart && endAtStart;
			const deleteAtEnd = change.isDelete && startAtEnd && endAtEnd;

			// since there's a working area, we need to check that
			// the change can be made
			// console.log(selectionEndIndex, areaStartIndex, areaEndIndex, selectionEndIndex);
			// console.log(backspaceAtFront, deleteAtEnd, startInRange, endInRange);
			const disallow = backspaceAtFront || deleteAtEnd || !startInRange || !endInRange;

			// not allowed to change
			if (disallow) {
				$state.lesson.invoke('rejectContentChange', instance.file, change, instance);
				return cancelEvent(event);
			}

			// update the working area
			// area.start = doc.indexToPosition(selectionStartIndex);
			// area.end = doc.indexToPosition(selectionEndIndex);

		}

		// if there's a lesson, allow this to prevent editing
		// the file under certain conditions
		const allow = $state.lesson.invoke('beforeContentChange', instance.file, change, instance);
		if (allow === false)
			return cancelEvent(event);

		// if this was allowed, and it's within the working area, and it
		// is adding newlines, then we need to move the working area down some
		if (hasWorkingArea && workingArea.isLine) {
			const lineCount = session.getLength();

			// wait for the update to finish, then compare the new
			// number of lines
			setTimeout(() => {
				const delta = session.getLength() - lineCount;
				workingArea.range.end.row += delta;
				this.editor.resize(true);
			});
		}

		// since this worked, notify
		setTimeout(() =>
			$state.lesson.invoke('contentChange', instance.file, change, instance));

		// otherwise, it's okay
		return true;
		
		// // can freely edit files
		// if (!$state.lesson || $state.freeMode)
		// return true;
		

		// // check for a few command that can't be used in lesson mode - 
		// // work on fixing these later
		// if (/(removeword|removeline|copylines|removeto|movelines|splitline)/i.test(command.name))
		// 	return cancelEvent(event);

		// // handle undos
		// if (/(undo|redo|cut|paste)/i.test(command.name)) {
		// 	console.warn('BLOCKED ADVANCED COMMAND');
		// 	return cancelEvent(event);
		// }

		// // make sure the file can even be changed
		// const canEditFile = $state.lesson.canEditFile(instance.file.path);
		
		// // without zones, just use the file status
		// if (!(map && canEditFile))
		// 	return !canEditFile ? cancelEvent(event) : true;

		// // gather up insertion information
		// const newline = instance.session.doc.getNewLineCharacter();
		// const text = (event.args || '').toString();
		// const includesNewLine = text.split(newline).length - 1;
		
		// // create the options to check with
		// const isInsert = /insert/i.test(command.name);
		// const isBackspace = !isInsert && /backspace/i.test(command.name);
		// const isDelete = !isBackspace && /del/i.test(command.name);
		// const isComment = !isDelete && /comment/i.test(command.name);
		// const test = isInsert ? map.canInsert
		// 	: isBackspace ? map.canBackspace
		// 	: isDelete ? map.canDelete
		// 	: isComment ? map.canToggleComment
		// 	: null;
		
		// // not sure what the request is
		// if (!test)
		// 	return false;
		
		// // test the action
		// const selection = this.editor.getSelectionRange();

		// // the zone-map works with 1 based index... my mistake
		// selection.start.row++;
		// selection.start.column++;
		// selection.end.row++;
		// selection.end.column++;

		// // test the range
		// const startIndex = map.getIndex(selection.start.row, selection.start.column);
		// const endIndex = map.getIndex(selection.end.row, selection.end.column);
		// const zone = map.getZone(startIndex, endIndex, true);
		// const allowed = test(startIndex, endIndex, includesNewLine);

		// // if it's allowed, apply the change and then update
		// if (allowed) {
		// 	this.editor.setOptions({ enableBasicAutocompletion: true, enableLiveAutocompletion: true });

		// 	// since this is allowed, we're going to execute the command first
		// 	// so we can compare the before and after and check if there were
		// 	// additional characters added -- for example, a new line that also
		// 	// performs and auto indent
		// 	const before = this.activeInstance.content;
		// 	command.exec(this.editor, event.args);

		// 	// when inserting new characters, check and see
		// 	// if this has extra characters that are not reported
		// 	// by the command args
		// 	const after = this.activeInstance.content;
		// 	const delta = after.length - before.length;

		// 	// perform the action in the zonemap
		// 	map.setContent(after);
		// 	map.shiftZones(
		// 		zone,
		// 		selection.start.row, selection.start.column,
		// 		selection.end.row, selection.end.column,
		// 		delta
		// 	);

		// 	// update all zones
		// 	this.syncZones(instance);	
		// }

		// // always cancel the event since it will be
		// // executed by success events
		// return cancelEvent(event);
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
			: new Brace.Range(startRow, startColumn, endRow, endColumn);
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

				// check for premodified content
				if (file.current)
					content = file.current;

				// without content, just read it normally
				if (!content)
					content = await $lfs.read(file.path);

				// create the session info
				const syntax = $languages[file.ext] || $languages.plain;
				const session = Brace.createEditSession(content, `ace/mode/${syntax}`);
				session.setOptions(SESSION_OPTIONS);

				// create the handler for content changes
				session.on('change', this.onChanged);
				
				// create the instance
				instance = {
					file, session,

					// helper to access content
					get content() {
						return session.getValue();
					}
				};

				// create a marker to use for focusing hints and errors
				_.each([ 'focusPoint', 'workingArea' ], prop => {
					const range = new Brace.Range();
					range.start = session.doc.createAnchor(0, 0);
					range.end = session.doc.createAnchor(0, 1);
					const index = session.addMarker(range);
					const point = session.getMarkers()[index];
					point.inFront = true;
					instance[prop] = point;
				});

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
			
			// give back the instance
			resolve(instance);
		});
	}

	/** sets the position of the cursor 
	 * @param {number} row the row to focus to
	 * @param {number} col the column to focus at
	*/
	setCursor = options => {
		this.editor.focus();
		let scrollRow;

		if (options.start === true) {
			this.editor.selection.moveCursorFileStart();
			scrollRow = 0;
		}
		else if (options.end === true) {
			this.editor.selection.moveCursorFileEnd();
			scrollRow = this.editor.getLastVisibleRow();
		}
		else {
			const { row, column } = getPosition(this, options);
			this.editor.gotoLine(row, column, true);
			scrollRow = row;
		}
		
		// update the view
		this.editor.renderer.scrollToRow(scrollRow);
		this.editor.resize();
	}

	/** sets the selected text range
	 * @param {Position} start the starting selection range
	 * @param {Position} end the ending selection range
	 */
	setRange = (start, end) => {
		const range = new Brace.Range(start.row, start.column, end.row, end.column);
		
		// create the range and set the position
		this.editor.focus();
		this.editor.selection.setRange(range);
		this.editor.renderer.scrollToRow(start.row);
		this.editor.resize();
	}

	// grabs the current content for the working zone
	getWorkingAreaContent() {
		if (!this.activeInstance) return '';

		// check the content
		const { session, workingArea } = this.activeInstance;
		const { range } = workingArea;
		// const newline = session.doc.getNewLineCharacter();

		// capturing each line
		// if (isLine) {
		// 	const content = [ ];
		// 	const count = range.end.row - range.start.row;
		// 	_.times(count + 1, i => {
		// 		const line = session.getLine(range.start.row + i)
		// 		content.push(line);
		// 	});

		// 	return content.join(newline)
		// }
		let content = session.doc.getTextRange(range);

		// like with working areas, we need to skip the
		// first character since it's a safety character
		// to prevent the range from ever being zero
		content = content.substr(1);

		// trim newlines??
		// content = content.replace(/\n$/, '');
		return content;
	}

	// // sync zones to the current state
	// syncZones = instance => {
	// 	if (!(instance && instance.map)) return;

	// 	// update each zone
	// 	const { zones } = instance;
	// 	_.each(zones, zone => zone.sync());
	// }

	// // deactivates all zones
	// clearAllZones = () => {
	// 	// _.each(this.instances, instance => {
	// 	// 	_.each(instance.zones, zone => zone.clear());
	// 	// });

	// 	// // force a refresh
	// 	// this.editor.resize();
	// }

	/** finds an instance of a file using a path 
	 * @param {string} [path] the path to find
	*/
	getInstance = path => {
		return path
			? _.find(this.instances, instance => instance.file.path === path)
			: this.activeInstance;
	}

	// updates the content for a file
	setContent = (path, content, replaceRestore) => {
		const file = $state.paths[path];
		
		// replace the current value
		file.current = content;
		if (replaceRestore)
			file.restore = content;

		// update the instance, if any
		const instance = this.getInstance(path);
		if (instance) {
			instance.session.setValue(content);
		}
	}

	/** returns the content for a file, making sure to replace
	 * any collapsed areas before showing the changes 
	 * @param {ProjectItem} file the file that should be found
	 * */
	getContent = path => {
		const file = $state.paths[path];
		return file.current || file.content;

		// const instance = file 
		// 	? _.find(this.instances, inst => inst.file.path === file.path)
		// 	: this.activeInstance;
		// const content = instance.session.getValue();
		// return content;
	}

	/** grabs the current selection, if any */
	getSelection = file => {
		const instance = this.activeInstance;
		const { session } = instance;
		const { doc } = session;
		const range = this.editor.getSelectionRange();
		const content = doc.getTextRange(range);
		return _.assign({ content }, range);
	}

}

// determine a position from an argument
function getPosition(managed, position, {
	isLine, requireRange, offsetEnd, offsetStart, direction = 1 } = { }) {
	const { content, session } = managed.activeInstance;
	const { doc } = session;
	const { length } = content;

	// gather initial values
	if (!isNaN(position.col))
		column = position.col;

	// // look up a zone value
	// if (_.isString(position.zone)) {

	// }

	// // look up a marker value
	// if (_.isString(position.marker)) {

	// }

	// check for an index
	if (_.isNumber(position.index)) {
		
		// if we just need the start
		const start = doc.indexToPosition(position.index);
		if (!requireRange) return start;

		// since it wasn't looking for a single point we
		// need to make sure it's at least one character long
		let extend = position.index === 0 ? 1 : position.index + direction;
		extend = _.clamp(extend, 1, length - 2);
		const end = doc.indexToPosition(extend);

		return { start, end };
	}

	// check for an assigned range value
	const range = { };

	// create a range
	if (_.isObject(position.range)) {
		range.start = toPosition(doc, position.range.start, offsetStart);
		range.end = toPosition(doc, position.range.end, offsetEnd);
	}

	if (_.isNumber(position.start)) {
		if (isLine) range.start = { row: position.start - 1, column: 0 };
		else range.start = toPosition(doc, position.start, offsetStart);
	}
	
	if (_.isNumber(position.end)) {
		if (isLine) range.end = { row: position.end, column: 0 };
		else range.end = toPosition(doc, position.end, offsetEnd);
	}

	return range;
}

// looks up an index
function toPosition(doc, value, offset = 0) {
	return _.isNumber(value)
		? doc.indexToPosition(value + offset) 
		: value;
}

// // evaluates a cursor position request
// function parseCursorRequest(instance, cursor) {
// 	const { activeInstance } = instance;
// 	if (!activeInstance) return;

// 	// string is a zone by default
// 	if (_.isString(cursor))
// 		cursor = { zone: cursor };

// 	// setting the range
// 	let start, end;
// 	if (cursor.zone) {

// 		// no map to work with
// 		const { map } = activeInstance;
// 		if (!map) return;
// 		const zone = map.zones[cursor.zone];

// 		// missing the zone required, or invalid
// 		if (!zone || (zone && !zone.start))
// 			return;

// 		// determine where to work from
// 		const startAt = zone.start;
// 		const endAt = zone.end || startAt;

// 		// place the cursor at the end of the zone
// 		if (cursor.at === 'end')
// 			start = { row: endAt.row, column: endAt.col };

// 		// place the cursor at the start of the zone
// 		else if (cursor.at === 'start')
// 			start = { row: startAt.row, column: startAt.col };

// 		// select the entire zone range
// 		else {
// 			start = { row: startAt.row, column: startAt.col };
// 			end = { row: endAt.row, column: endAt.col };
// 		}

// 	}
// 	// check for row/columns
// 	else if (cursor.at || cursor.start) {
// 		const startAt = cursor.at || cursor.start;
// 		start = { row: startAt.row, column: startAt.col };
// 		end = cursor.end ? { row: cursor.end.row, column: cursor.end.col } : null;
// 	}
// 	// check for specific coordinates
// 	else if (_.isNumber(cursor.row) && _.isNumber(cursor.col))
// 		start = { row: cursor.row, column: cursor.col };

// 	// fix to match the app coordinate offsets
// 	if (start) {
// 		start.row--;
// 		start.column--;
// 	}

// 	if (end) {
// 		end.row--;
// 		end.column--;
// 	}

// 	// give back the range
// 	return { start, end };
// }
