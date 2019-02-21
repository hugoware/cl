import _ from 'lodash';

// checks the path if it's actually a file
export function getPath(path) {
	return _.isString(path) ? path : _.get(path, 'path');
}