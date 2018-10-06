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

	/** deactivates a zone entirely */
	clear = () => {
		this.hide();
	}

	/** handles displaying the zone */
	show = () => {
		console.log('will show', this.id);
		this.isActive = true;
		this.zone.active = true;
		this.marker.clazz = this.base + ' show';
	}
	
	/** handles hiding a zone */
	hide = () => {
		console.log('will hide', this.id);
		this.isActive = false;
		delete this.zone.active;
		this.marker.clazz = this.base;
	}

	/** handles displaying the zone */
	edit = () => {
		console.log('will edit', this.id);
		if (this.isCollapsed) this.expand();
		this.show();
		this.isEditable = true;
		this.zone.editable = true;
	}
	
	/** handles hiding a zone */
	lock = () => {
		console.log('will lock', this.id);
		this.hide();
		this.isEditable = false;
		this.zone.editable = false;
	}

	/** shows the content for a range */
	collapse = () => {
		console.log('will collapse', this.id);
		if (this.isCollapsed) return;
		this.isCollapsed = true;
		this.zone.collapsed = true;
		this.zone.content = this.session.doc.getTextRange(this.range);
		this.session.remove(this.range);
	}

	/** expands the content for a range */
	expand = () => {
		console.log('will expand', this.id);
		if (!this.isCollapsed) return;
		this.isCollapsed = false;
		delete this.zone.collapsed;

		// insert contetn and fix
		this.session.insert(this.range.start, this.zone.content);
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
		console.log('will change 3');

		// check for collapse changes
		if (!this.isCollapsed && this.zone.collapsed)
			this.collapse();
		else if (this.isCollapsed && !this.zone.collapsed)
			this.expand();

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

		// sync styles and columns
		this.update();

	}

}
