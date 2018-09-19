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
		this.isMultiLine = !!zone.multiline;
		// this.isHidden = !!zone.hide;

		// create two anchors that act as the start
		// and end range of a zone
		const { start, end } = zone;
		this.start = new Anchor(session.doc, start.row, start.col);
		this.end = new Anchor(session.doc, end.row, end.col);
		this.range = new Range(start.row, start.col, end.row, end.col);

		// capture the marker
		const index = session.addMarker(this.range);
		this.marker = session.getMarkers()[index];
		this.marker.clazz = this.base;

		// // stay in sync
		this.start.on('change', this.update);
		this.end.on('change', this.update);
	}

	/** checks if a zone edit is allowed or not */
	allowEdit = (event, range, options) => {
		
		// check if this falls within range
		const { start, end } = this;

		// create fake indexes
		const SHIFT = 1000000;
		const rangeStart = (range.start.row * SHIFT) + range.start.column;
		const rangeEnd = (range.end.row * SHIFT) + range.end.column;
		const zoneStart = (start.row * SHIFT) + start.column;
		const zoneEnd = (end.row * SHIFT) + end.column;
		const inRange = rangeStart >= zoneStart && rangeEnd <= zoneEnd;

		// if it's not in range, quit now
		if (!inRange) return;

		// get some range info
		const command = event.command.name;
		const startAtStart = start.column === range.start.column && start.row === range.start.row;
		const endAtStart = start.column === range.end.column && start.row === range.end.row;
		const startAtEnd = end.column === range.start.column && end.row === range.start.row;
		const endAtEnd = end.column === range.end.column && end.row === range.end.row;
		const entireSelection = startAtStart && endAtEnd;
		
		// trying to delete the value
		if (/backspace/i.test(command)) {

			// mark this as empty so we can display
			// a range of characters even though it's empty
			if (entireSelection)
				this.isEmpty = true;

			// can't delete from the start of the selection
			if (endAtStart)
				return false;

		}

		// using the delete
		else if (/del/i.test(command)) {

			// mark this as empty so we can display
			// a range of characters even though it's empty
			if (entireSelection)
				this.isEmpty = true;

			// trying to delete the characters beyond the end
			// by using the del hey
			if (startAtEnd)
				return false;
		}

		// checking for adding characters
		else if (/insert/i.test(command)) {

			// if this doesn't allow more than one line, check for newlines
			if (!this.isMultiLine) {
				const newline = this.session.doc.getNewLineCharacter();
				if (event.args.indexOf(newline) > -1)
					return false;
			}

			// inserting a new character before the start anchor
			if (startAtStart)
				this.resetColumn = start.column;

		}

		// good to go
		return true;
	}

	/** handles displaying the zone */
	show = () => {
		console.log('try show');
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

	/** shows the content for a range */
	collapse = () => {
		if (this.isCollapsed) return;
		this.isCollapsed = true;
		this.zone.collapsed = true;
		this.content = this.session.doc.getTextRange(this.range);
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
		this.session.insert(this.start, this.content);
		this.start.setPosition(row, column);
	}

	/** handles updating a zone when the ranges change */
	update = () => {
		const { zone, range, start, end } = this;
		zone.start.row = range.start.row = start.row;
		zone.start.col = range.start.column = start.column;
		zone.end.row = range.end.row = end.row;
		zone.end.col = range.end.column = end.column;

		// match styling
		const multiline = zone.start.row !== zone.end.row;
		this.marker.type = !(zone.line || multiline) ? 'text' : 'fullLine';
	}

	/** extra function to ensure that apply any extra changes to a zone to
	 * make sure they're aligned correctly
	 * @param {boolean} [autoUpdate] calls update at the end of syncing
	 */
	sync = autoUpdate => {

		// check if resetting the start position
		if ('resetColumn' in this) {
			this.start.setPosition(this.start.row, this.resetColumn);
			delete this.resetColumn;
		}

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

		// sync the view
		if (!!autoUpdate)
			this.update();

	}

	/** removes a zone from action */
	dispose = () => {
		this.start.detach();
		this.end.detach();
	}

}
