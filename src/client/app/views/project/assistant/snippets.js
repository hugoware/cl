
import _ from 'lodash';
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
		const highlight = _.trim(element.getAttribute('highlight')).split(/ +/g);
		const snippet = lesson.getSnippet(type);
		const zones = lesson.zones[type];
		$editor.colorize(example, { snippet, zones, highlight });
	});

}
