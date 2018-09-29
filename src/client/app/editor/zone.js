import _ from 'lodash';
import $brace from 'brace';

// managing text ranges
const Range = $brace.acequire('ace/range').Range;
const Anchor = $brace.acequire('ace/anchor').Anchor;

/** creates a managed zone for code editing */
export default class ManagedZone {

	constructor(id, zone, session) {
		this.id = id;
		this.zone = zone;
		this.session = session;
		this.base = `zone zone-${id}`;

		// save a few props
		this.isMultiLine = !!zone.line;
		this.isCollapsed = !!this.zone.content;

		// create two anchors that act as the start
		// and end range of a zone
		const { start, end } = zone;
		this.range = new Range(start.row, start.col, end.row, end.col);

		// capture the marker
		const index = session.addMarker(this.range);
		this.marker = session.getMarkers()[index];
		this.marker.clazz = this.base;
	}

	// /** checks if a zone edit is allowed or not */
	// allowEdit = (event, range) => {
	// 	if (!this.isEditable) return;
		
	// 	// check if this falls within range
	// 	const { start, end } = this;

	// 	// create fake indexes
	// 	const SHIFT = 1000000;
	// 	let rangeStart = range.start.row;
	// 	let rangeEnd = range.end.row;
	// 	let zoneStart = start.row;
	// 	let zoneEnd = end.row;

	// 	// adjust if this is a line
	// 	if (!this.isMultiLine) {
	// 		rangeStart = (rangeStart * SHIFT) + range.start.column;
	// 		rangeEnd = (rangeEnd * SHIFT) + range.end.column;
	// 		zoneStart = (zoneStart * SHIFT) + start.column;
	// 		zoneEnd = (zoneEnd * SHIFT) + end.column;
	// 	}

	// 	// test the range
	// 	const inRange = rangeStart >= zoneStart && rangeEnd <= zoneEnd;

		
	// 	console.log('range:', inRange);

	// 	// if it's not in range, quit now
	// 	if (!inRange) return;

	// 	// get some range info
	// 	const command = event.command.name;
	// 	let startAtStart = start.row === range.start.row;
	// 	let endAtStart = start.row === range.end.row;
	// 	let startAtEnd = end.row === range.start.row;
	// 	let endAtEnd = end.row === range.end.row;

	// 	if (!this.isMultiLine) {	
	// 		startAtStart = start.column === range.start.column && start.row === range.start.row;
	// 		endAtStart = start.column === range.end.column && start.row === range.end.row;
	// 		startAtEnd = end.column === range.start.column && end.row === range.start.row;
	// 		endAtEnd = end.column === range.end.column && end.row === range.end.row;
	// 	}

	// 	const entireSelection = startAtStart && endAtEnd;
		
	// 	// trying to delete the value
	// 	if (/backspace/i.test(command)) {

	// 		// we always need the columns for this
	// 		startAtStart = start.column === range.start.column && start.row === range.start.row;
	// 		endAtStart = start.column === range.end.column && start.row === range.end.row;

	// 		// check if trying to delete out of the area
	// 		if (startAtStart || endAtStart)
	// 			return false;

	// 		// mark this as empty so we can display
	// 		// a range of characters even though it's empty
	// 		if (entireSelection)
	// 			this.isEmpty = true;
	// 	}

	// 	// using the delete
	// 	else if (/del/i.test(command)) {

	// 		// mark this as empty so we can display
	// 		// a range of characters even though it's empty
	// 		if (entireSelection)
	// 			this.isEmpty = true;

	// 		// trying to delete the characters beyond the end
	// 		// by using the del hey
	// 		if (startAtEnd)
	// 			return false;
	// 	}

	// 	// checking for adding characters
	// 	else if (/insert/i.test(command)) {

	// 		// has newline
	// 		const newline = this.session.doc.getNewLineCharacter();
	// 		const total = (event.args.split(newline).length) - 1;
	// 		const hasNewlines = total > 0;

	// 		console.log('inserting', hasNewlines, total);

	// 		// if this doesn't allow more than one line, check for newlines
	// 		if (!this.isMultiLine && hasNewlines) {
	// 			return false;
	// 		}
	// 		// asjust
	// 		else if (this.isMultiLine && hasNewlines && (startAtEnd || endAtEnd)) {
	// 			this.resetRow = end.row + 0.5;
	// 			// return false;
	// 			// console.log('move end');
	// 			// setTimeout(() => {
	// 			// 	end.setPosition(end.row, end.column);
	// 			// 	// this.sync(true);
	// 			// });
	// 		}

	// 		// inserting a new character before the start anchor
	// 		if (startAtStart)
	// 			this.resetColumn = start.column;

	// 	}

	// 	// good to go
	// 	setTimeout(this.sync);
	// 	return true;
	// }

	/** handles displaying the zone */
	show = () => {
		this.isActive = true;
		this.zone.active = true;
		this.marker.clazz = this.base + ' show';
	}
	
	/** handles hiding a zone */
	hide = () => {
		this.isActive = false;
		delete this.zone.active;
		this.marker.clazz = this.base;
	}

	/** handles displaying the zone */
	edit = () => {
		this.show();
		this.isEditable = true;
		this.zone.editable = true;
	}
	
	/** handles hiding a zone */
	lock = () => {
		this.isEditable = false;
		this.zone.editable = false;
	}

	/** shows the content for a range */
	collapse = () => {
		if (this.isCollapsed) return;
		this.isCollapsed = true;
		this.zone.collapsed = true;
		this.zone.content = this.session.doc.getTextRange(this.range);
		this.session.remove(this.range);
	}

	/** expands the content for a range */
	expand = () => {
		if (!this.isCollapsed) return;
		this.isCollapsed = false;
		delete this.zone.collapsed;
		
		// get the original start
		const { row, column } = this.start;

		// insert contetn and fix
		this.session.insert(this.start, this.zone.content);
		this.start.setPosition(row, column);
		delete this.zone.content;
	}

	/** handles updating a zone when the ranges change */
	update = () => {
		const { zone, range } = this;
		zone.start.row = range.start.row
		zone.start.col = range.start.column
		zone.end.row = range.end.row
		zone.end.col = range.end.column

		// match styling
		const multiline = zone.start.row !== zone.end.row;
		this.marker.type = !(zone.line || multiline) ? 'text' : 'fullLine';
	}

	/** extra function to ensure that apply any extra changes to a zone to
	 * make sure they're aligned correctly
	 */
	sync = () => {

		// check for zone states
		if (this.isEditable && !this.zone.editable)
			this.lock();
		else if (!this.isEditable && this.zone.editable)
			this.edit();

		// check for visibility changes
		if (this.isActive && !this.zone.active)
			this.hide();
		else if (!this.isActive && this.zone.active)
			this.show();

		// check for collapse changes
		if (!this.isCollapsed && this.zone.collapsed)
			this.collapse();
		else if (this.isCollapsed && !this.zone.collapsed)
			this.expand();

		// sync styles and columns
		this.update();

	}

}
