import _ from 'lodash';

// all svgs
import arrowRight from '../../icons/arrow-right.svg';
import folderIcon from '../../icons/icon-folder.svg';
import pugIcon from '../../icons/icon-pug.svg';
import jsIcon from '../../icons/icon-js.svg';
import htmlIcon from '../../icons/icon-html.svg';
import scssIcon from '../../icons/icon-scss.svg';
import tsIcon from '../../icons/icon-ts.svg';
import txtIcon from '../../icons/icon-txt.svg';
import cssIcon from '../../icons/icon-css.svg';
import coffeeIcon from '../../icons/icon-coffee.svg';
import rbIcon from '../../icons/icon-rb.svg';
import mdIcon from '../../icons/icon-md.svg';
import pyIcon from '../../icons/icon-py.svg';
import xmlIcon from '../../icons/icon-xml.svg';
import csIcon from '../../icons/icon-cs.svg';
import javaIcon from '../../icons/icon-java.svg';
import sqlIcon from '../../icons/icon-sql.svg';
import closeIcon from '../../icons/icon-close.svg';
import unknownIcon from '../../icons/icon-unknown.svg';
import errorIcon from '../../icons/icon-error.svg';
import warningIcon from '../../icons/icon-warning.svg';
import refreshIcon from '../../icons/icon-refresh.svg';
import addFolderIcon from '../../icons/icon-add-folder.svg';
import addFileIcon from '../../icons/icon-add-file.svg';

/** @type {Object<string, HTMLElement>} */
const $icons = {
	arrowRight,
	
	// icons
	errorIcon,
	warningIcon,
	refreshIcon,
	addFolderIcon,
	addFileIcon,
	closeIcon,
	folderIcon,
	pugIcon,
	jsIcon,
	tsIcon,
	txtIcon,
	htmlIcon,
	scssIcon,
	cssIcon,
	rbIcon,
	coffeeIcon,
	mdIcon,
	pyIcon,
	xmlIcon,
	csIcon,
	javaIcon,
	sqlIcon,
	unknownIcon
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
	arrowRight: () => get('arrowRight'),
	close: () => get('closeIcon'),
	error: () => get('errorIcon'),
	warning: () => get('warningIcon'),
	refresh: () => get('refreshIcon'),
	icon: key => get(`${key}Icon`),

	// file browser
	folder: open => get('folderIcon'),
	fileType: type => {
		const source = $icons[`${type}Icon`] || $icons.unknownIcon;
		return source.cloneNode(true);
	}
};