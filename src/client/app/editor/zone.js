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
		console.log('test edit', this.id);
		
		// check if this falls within range
		const { start, end } = this;
		const inRange = 
			range.start.row >= start.row
			&& range.start.row <= end.row
		
			&& range.end.row >= start.row
			&& range.end.row <= end.row

			&& range.start.column >= start.column
			&& range.start.column <= end.column

			&& range.end.column >= start.column
			&& range.end.column <= end.column;

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

			// inserting a new character before the start anchor
			if (startAtStart)
				this.resetColumn = start.column;

		}

		// good to go
		return true;
	}

	/** handles displaying the zone */
	show = () => {
		this.active = true;
		this.marker.clazz = this.base + ' show';
	}
	
	/** handles hiding a zone */
	hide = () => {
		this.active = false;
		this.marker.clazz = this.base;
	}

	/** shows the content for a range */
	collapse = () => {
		this.content = this.session.doc.getTextRange(this.range);
		this.session.remove(range);
	}

	/** expands the content for a range */
	expand = () => {
		const position = this.session.doc.indexToPosition(this.start);
		this.session.insert(position, this.content);
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
	 */
	sync = () => {

		// check if resetting the start position
		if ('resetColumn' in this) {
			this.start.setPosition(this.start.row, this.resetColumn);
			delete this.resetColumn;
		}

	}

	/** removes a zone from action */
	dispose = () => {
		this.start.detach();
		this.end.detach();
	}

}
