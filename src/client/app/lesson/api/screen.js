import { _ } from '../../lib';
import $focus from '../focus';

export default class ScreenAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// simple shortcuts
		_.each({
			fileBrowser: '#file-browser',
			workspace: '#workspace',
			codeEditor: '.editor.ace_editor',
			previewArea: '#preview',
			saveButton: '.code-editor .action.save',
			runButton: '.console .action.run-scripts',

		}, (selector, func) => {
			this.highlight[func] = options => this.highlight(selector, options);
			this.marker[func] = options => this.marker(selector, options);
		});

		_.each(['highlight', 'marker'], key => {
			const source = this[key];

			source.fileBrowserItem = (path, options) =>
				this[key](`#file-browser .item[file="${path}"]`, options);

			source.tab = (path, options) =>
				this[key](`#workspace .tab[file="${path}"]`, options);
		});

		// highlights
		this.highlight.clear = () => $focus.clearHighlights();
		this.marker.clear = () => $focus.clearMarkers();
		
		this.highlight.previewArea = (selector, options) =>
			this.highlight(`::preview ${selector}`, options);

		this.marker.previewArea = (selector, options) =>
			this.marker(`::preview ${selector}`, options);

	}

	// sets marked points
	marker = (selector, options) => {
		return $focus.setMarker(selector, options);
	}

	// sets highlight points
	highlight = (selector, options) => {
		return $focus.setHighlight(selector, options);
	}

	// clears all
	clear = () => {
		$focus.clearHighlights();
		$focus.clearMarkers();
	}

}
