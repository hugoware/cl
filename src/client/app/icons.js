import _ from 'lodash';

// all svgs
import folder from '../../icons/folder.svg';
import arrowRight from '../../icons/arrow-right.svg';

/** @type {Object<string, HTMLElement>} */
const $icons = {
	folder,
	arrowRight
};

// handles creating icon generators
const $generator = document.createElement('div');
_.each($icons, (svg, key) => {
	$generator.innerHTML = svg;
	$icons[key] = $generator.firstChild.cloneNode(true);
});

/** creates an SVG icon from a key
 * @param {string} key the icon to create an instance of
 * @returns {HTMLElement}
 */
export function get(key) {
	return $icons[key].cloneNode(true);
}

export default { 
	folder: () => get('folder'),
	arrowRight: () => get('arrowRight')
};