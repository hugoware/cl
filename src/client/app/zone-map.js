import _ from 'lodash';

// common conditions
const BACKSPACE = { isBackspace: true };
const DELETE = { isDelete: true };
const INSERT = { isInsert: true };

export default class ZoneMap {

	/** syncs a document to zone information
	 * @param {string} content the document to work with
	 * @param {Object<string, Zone>} zones a map of zones
	 * @returns {ZoneMap}
	 */
	static create(content, zones) {
		const map = new ZoneMap();
		map.characterTotal = [];
		map.characterSum = [];
		map.content = content;
		map.zones = zones;

		// timestamp for tracking changes
		map.lastUpdate = 0;

		// get the initial state for the document
		syncDocument(map);
		syncIndexes(map);

		// return the generated map
		return map;
	}

	/** allows editing for a zone. Will also expand the zone if not ready
	 * @param {string} id the id of the zone to allow editing
	 */
	edit = id => {
		const zone = this.zones[id];
		zone.allow = true;

		// expand, if needed
		if (!zone.end)
			this.expand(id);
	}

	/** disables editing for a zone
	 * @param {string} id the id of the zone to disable
	 */
	lock = id => {
		const zone = this.zones[id];
		delete zone.allow;
	}

	/** collapses a zone so it cannot be accessed
	 * @param {string} id the ID of the zone to collapse
	 */
	collapse = id => {
		collapseZone(this, id);
		syncDocument(this);
		syncPositions(this);
	}

	/** expands a zone in the document
	 * @param {string} id the ID of the zone to expand
	 */
	expand = id => {
		expandZone(this, id);
		syncDocument(this);
		syncPositions(this);
	}

	/** finds the index for a row and column
	 * @param {number|Position} row the row or a Position object with row and column
	 * @param {number} col the column to include if not using a Position object
	 * @returns {number} the index for the position provided
	 */
	getIndex = (row, col) => {
		if (isNaN(col)) {
			col = row.col;
			row = row.row;
		}

		const characters = this.characterSum[row - 2];
		return (characters || 0) + (row - 1) + (col - 1);
	}

	/** determines the row and column for a zone based on the index
	 * @param {number} index the index to try and find
	 * @returns {Position} the row and column that was detected
	 */
	getPosition = index => {
		let row;

		// start checking each row
		for (row = 0; row < this.totalLines; row++) {
			if ((this.characterSum[row] + row) < index) continue;
			break;
		}

		// get the column
		const col = index - ((this.characterSum[row - 1] + row) || 0);
		return { row: row + 1, col: col + 1 };
	}

	/** checks if a range can be inserted into
	 * @param {Position} start the starting cursor
	 * @param {Position} [end] the ending range, if any
	 */
	canInsert = (start, end, includesNewLine) => {
		return evaluateRange(this, start, end, includesNewLine, INSERT);
	}

	/** checks if a range can be backspaced (from the left)
	 * @param {Position} start the starting cursor
	 * @param {Position} [end] the ending range, if any
	 */
	canBackspace = (start, end, includesNewLine) => {
		return evaluateRange(this, start, end, includesNewLine, BACKSPACE);
	}

	/** checks if a range can be deleted (from the right)
	 * @param {Position} start the starting cursor
	 * @param {Position} [end] the ending range, if any
	 */
	canDelete = (start, end, includesNewLine) => {
		return evaluateRange(this, start, end, includesNewLine, DELETE);
	}

	/** changes the content for the document between two ranges
	 * @param {number} startRow the start row to start from
	 * @param {number} startCol the column to start from
	 * @param {number} endRow the end row to end at
	 * @param {number} endCol the column to end at
	 * @param {string} [content] the content to insert, if any
	 */
	modify = (startRow, startCol, endRow, endCol, content) => {
		const startIndex = this.getIndex(startRow, startCol);
		const endIndex = this.getIndex(endRow, endCol);
		const isInsert = _.isString(content);

		// const range = endIndex - startIndex;
		if (isInsert) insertContent(this, startIndex, endIndex, content);
		else extractContent(this, startIndex, endIndex);
		
		// determine the character shift
		const range = startIndex - endIndex;
		const delta = isInsert ? content.length + range
			: _.isNumber(content) ? content
			: range;

		// revise all zones
		for (const id in this.zones) {
			const zone = this.zones[id];

			// update the tail and lead
			if (zone.start && zone.start.index > startIndex)
				zone.start.index += delta;

			// adjust just the tail end
			if (zone.end && zone.end.index >= startIndex)
				zone.end.index += delta;

		}
		
		// adapt to changes
		syncDocument(this);
		syncPositions(this);
	}

}


// expands a zone 
function expandZone(instance, id, skip) {
	const zone = instance.zones[id];

	// not a collapsed zone
	if (!('content' in zone)) return;

	// if there's a parent, if needs to be expanded first
	// which will fix this zone before being used
	if (zone.parent)
		expandZone(instance, zone.parent);

	// insert the zone content
	insertContent(instance, zone.start.index, zone.content);
	const length = zone.content.length;

	// fix the node
	zone.end = { index: zone.start.index + length };

	// need to shift all indexes
	for (const alt in instance.zones) {
		if (alt === id) continue;
		const adjust = instance.zones[alt];

		// this is a collapsed zone inside
		// of another zone - restore the start index
		if (adjust.parent === id) {
			adjust.start = { index: zone.start.index + adjust.offset };
			delete adjust.parent;
			delete adjust.offset;
		}
		// adjustable external zone
		else {

			// since each group is updated, get their new indexes
			if (adjust.end && adjust.end.index > zone.start.index)
				adjust.end.index += length;

			if (adjust.start && adjust.start.index > zone.start.index)
				adjust.start.index += length;

		}

		delete zone.parent;
		delete zone.content;
	}
}


// captures all indexes for active zones
function syncIndexes(instance) {
	for (const id in instance.zones) {
		const zone = instance.zones[id];

		// capture the current index for each
		if (zone.start)
			zone.start.index = instance.getIndex(zone.start.row, zone.start.col);

		if (zone.end)
			zone.end.index = instance.getIndex(zone.end.row, zone.end.col);
	}
}


// establishes the state of the document
function syncDocument(instance) {
	instance.content = instance.content.replace(/\t/, '  ');
	instance.lines = instance.content.split(/\n/g);
	instance.totalLines = instance.lines.length;
	
	// add up the total lines
	let sum = 0;
	instance.characterTotal = [ ];
	instance.characterSum = [ ];
	for (let i = 0; i < instance.totalLines; i++) {
		const total = instance.lines[i].length;
		sum += total;
		instance.characterTotal[i] = total;
		instance.characterSum[i] = sum;
	}
}


// match all rows/columns
function syncPositions(instance) {
	for (const id in instance.zones) {
		const zone = instance.zones[id];

		// check for a start marker
		if (zone.start) {
			const index = zone.start.index;
			zone.start = instance.getPosition(index);
			zone.start.index = index;
		}

		// check for an end marker
		if (zone.end) {
			const index = zone.end.index;
			zone.end = instance.getPosition(index);
			zone.end.index = index;
		}
	}
}

// tests if a range can be applied to the map
function evaluateRange(instance, start, end, includesNewLine, { isInsert, isBackspace, isDelete }) {
	const hasRange = start !== end;

	// make sure this is allowed
	for (const id in instance.zones) {
		const zone = instance.zones[id];
		if (!zone.allow) continue;

		// make sure it's expanded - this shouldn't happen
		// unless it's also marked as allowed
		if (!(zone.start && zone.end)) continue;
		
		// test if out of range first
		if (start < zone.start.index
			|| start > zone.end.index
			|| end < zone.start.index
			|| end > zone.end.index)
			continue;

		// check for removal actions
		if (isBackspace || isDelete) {
			const startAtStart = zone.start.index === start;
			const endAtEnd = zone.end.index === end;
			
			// if they have a range selected, it's okay
			// to backspace all of the way to the front or
			// delete from the end -- otherwise, it's going
			// to grab a character outside the area
			if (!hasRange)
				if ((isBackspace && startAtStart) || (isDelete && endAtEnd))
					continue;
		}
		// check for insert actions
		else if (isInsert) {

			// prevent new lines in standard fields
			if (includesNewLine && !zone.multiline)
				continue;

		}

		// this seems to be allowed
		return true;
	}

	// nothing passed, so assume this is false
	return false;
}

// handles recursively collapsing zones
function collapseZone(instance, id) {
	const zone = instance.zones[id];

	// this is already collapsed
	if (zone.parent || 'content' in zone)
		return;

	// get all zones contained within this zone
	const contained = getContainedZones(instance, id);
	for (let i = 0, total = contained.length; i < total; i++) {
		const alt = contained[i];
		const inner = instance.zones[alt];

		// try and collapse it entirely
		collapseZone(instance, alt);
		
		// capture the inner offset value
		if (inner.start) {
			inner.offset = inner.start.index - zone.start.index;
			inner.parent = id;
		}

		// clear the start marker since
		// it can't be moved anymore
		delete inner.start;
	}

	// finalize the content
	zone.content = extractContent(instance, zone.start.index, zone.end.index);
	const length = zone.content.length;
	
	// need to shift all indexes
	for (const alt in instance.zones) {
		if (alt === id) continue;
		const adjust = instance.zones[alt];
		
		// since each group is updated, get their new indexes
		if (adjust.end && adjust.end.index > zone.end.index)
		adjust.end.index -= length;
		
		if (adjust.start && adjust.start.index > zone.end.index)
		adjust.start.index -= length;
		
	}
	
	// clean up the zone
	delete zone.end;
}


// adds content
function insertContent(instance, insert, content) {
	instance.lastUpdate = +new Date;
	instance.content = instance.content.substr(0, insert) + content + instance.content.substr(insert);
}


// gather the content
function extractContent(instance, start, end) {
	instance.lastUpdate = +new Date;
	const content = instance.content.substr(start, end - start);
	instance.content = instance.content.substr(0, start) + instance.content.substr(end);
	return content;
}


// finds all zones contained within another zone
function getContainedZones(instance, id) {
	const zone = instance.zones[id];
	const contained = [];

	// check each other zone
	for (const alt in instance.zones) {
		if (alt === id) continue;

		// check if contained inside of another zone
		const compare = instance.zones[alt];

		// if this already has a parent, then there's
		// nothing to do at this point
		if (compare.parent) {

			// if it's contained in the zone in question
			// then we're going to return i
			if (compare.parent === id)
				contained.push(alt);
			continue;
		}

		// check the indexes
		const isStartWithinRange = zone.start.index < compare.start.index;
		const isEndWithinRange = zone.end ? zone.end.index > compare.end.index : isStartWithinRange;
		if (isStartWithinRange && isEndWithinRange)
			contained.push(alt);
	}

	return contained;
}
