// import { _, Brace } from '../lib';

// managing text ranges
// const Range = Brace.acequire('ace/range').Range;

/** creates a managed zone for code editing */
export default class ManagedZone {

	// constructor(id, zone, session) {
	// 	this.id = id;
	// 	this.zone = zone;
	// 	this.session = session;
	// 	this.base = `zone zone-${id}`;

	// 	// create two anchors that act as the start
	// 	// and end range of a zone
	// 	const { start, end } = zone;
	// 	const startRow = start ? start.row : 0;
	// 	const startCol = start ? start.col : 0;
	// 	const endRow = end ? end.row : startRow;
	// 	const endCol = end ? end.col : startCol;
	// 	this.range = new Range(startRow, startCol, endRow, endCol);

	// 	// capture the marker
	// 	const index = session.addMarker(this.range);
	// 	this.marker = session.getMarkers()[index];
	// 	this.marker.clazz = this.base;
	// }

	// /** sync the zone to the zone data */
	// sync = () => {
	// 	const { zone } = this;

	// 	// nothing to show
	// 	if (!(zone.start && zone.end) || !zone.visible) {
	// 		this.marker.clazz = 'hide';
	// 		return;
	// 	}

	// 	// update the class
	// 	const show = zone.visible || zone.allow;
	// 	this.marker.type = zone.line ? 'fullLine' : 'text';
	// 	this.marker.clazz = `${this.base} ${show ? 'show' : 'hide'}`;

	// 	// sync the cursor positions
	// 	this.range.start.row = zone.start.row - 1;
	// 	this.range.start.column = zone.start.col - 1;
	// 	this.range.end.row = zone.end.row - 1;
	// 	this.range.end.column = zone.end.col - 1;
	// }

}
