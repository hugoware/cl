
import { _ } from '../../../lib';
import $editor from '../../../editor';

// attach each snippet
export function applySnippets(slide, lesson) {
	console.log(slide, lesson);

	// replace all snippets
	const snippets = slide.find('.snippet');
	snippets.each((index, element) => {

		// create the target for styling
		const example = document.createElement('div');
		element.appendChild(example);

		// update the element
		const type = element.getAttribute('type');
		const snippet = lesson.getSnippet(type);
		
		// capture all highlighted areas
		let highlight = _.trim(element.getAttribute('highlight')).split(/\|+/g);
		highlight = _.map(highlight, item => {
			const parts = item.split(',');
			const start = 0|parts[0];
			const end = start + (0|parts[1]);
			const isLine = /l(ine)?/i.test(parts[2] || '');
			return { start, end, isLine };
		});

		// convert to ranges
		$editor.colorize(example, { snippet, highlight });
	});

}
