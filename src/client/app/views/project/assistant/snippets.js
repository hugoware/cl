
import { _, $ } from '../../../lib';
import $editor from '../../../editor';

// attach each snippet
export function applySnippets(slide, lesson) {

	// replace all snippets
	const snippets = slide.find('.snippet');
	snippets.each((index, element) => {

		// create the target for styling
		const example = document.createElement('div');
		element.appendChild(example);

		// update the element
		const type = element.getAttribute('type');
		const snippet = lesson.getSnippet(type);

		// check for a preview
		const previewWidth = element.getAttribute('preview');
		if (_.some(previewWidth)) {
			const preview = $(`<div class="snippet-preview" style="width: ${previewWidth}" >
				<div class="snippet-title">Preview</div>
				<div class="snippet-output" >${snippet.content}</div>
			</div>`);

			// show the preview area
			element.appendChild(preview[0]);
		}
		
		// capture all highlighted areas
		let highlight = _.trim(element.getAttribute('highlight')).split(/\|+/g);
		highlight = _.map(highlight, item => {
			const parts = item.split(',');
			const start = 0|parts[0];
			const end = start + (0|parts[1]);
			const isLine = /l(ine)?/i.test(parts[2] || '');
			return { start, end, isLine };
		});

		// check for resizing
		const size = _.trim(element.getAttribute('size'));
		const fontSize = size === 'small' ? -3
			: size === 'xsmall' ? -5
			: size === 'medium' ? -2
			: null;

		// convert to ranges
		$editor.colorize(example, { snippet, highlight, fontSize });
	});

}
