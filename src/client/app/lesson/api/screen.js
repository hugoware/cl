import $focus from '../focus';

export default class ScreenAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// highlights
		this.highlight.fileBrowserItem = path => this.highlight(`.item[file="${path}"]`);
		this.highlight.fileBrowser = () => this.highlight(`#file-browser`);
		this.highlight.clear = () => this.clear();
		
		// markers
		this.marker.fileBrowserItem = path => this.marker(`.item[file="${path}"]`);
		this.marker.fileBrowser = () => this.marker(`#file-browser`);
		this.marker.clear = () => this.clear();

	}

	// sets marked points
	marker = selectors => {
		$focus.setMarker(selectors);
	}

	// sets highlight points
	highlight = selectors => {
		$focus.setHighlight(selectors);
	}

	// clears all
	clear = () => {
		$focus.clear();
	}

}
