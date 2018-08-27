import _ from 'lodash';
import { stringify, resolveError } from './utils';
// import { ProjectTypes } from '../models/project';

const ProjectTypes = {
  'web': true,
  'game2d': true,
  'game3d': true,
  'mobile': true,
  'console': true
};

// list of allowed project types
const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 100;

/** validates the provided name for a project
 * @param {string} type the requested project type
 * @param {object} [errors] an object to map errors
 * @returns {boolean} did this validate successfully
 */
export function validateName(name, errors) {
	name = stringify(name);
	const err = name.length < MIN_NAME_LENGTH ? 'too_short'
		: name.length > MAX_NAME_LENGTH ? 'too_long'
		: /[^a-z0-9 \-_]+/i.test(name) ? 'invalid'
		: null;

	return resolveError('name', err, errors);
}


/** validates the description for a project
 * @param {string} description the requested description
 * @param {object} [errors] an object to map errors
 * @returns {boolean} did this validate successfully
 */
export function validateDescription(description, errors) {
	description = stringify(description);
	const err = description.length > MAX_DESCRIPTION_LENGTH ? 'too_long'
		: null;

	return resolveError('description', err, errors);
}


/** validates if a project is an allowed type
 * @param {string} type the requested project type
 * @param {object} [errors] an object to map errors
 * @returns {boolean} did this validate successfully
 */
export function validateType(type, errors) {
	type = _.toLower(type);
	const err = !ProjectTypes[type] ? 'invalid'
		: null;

	return resolveError('type', err, errors);
}

/** checks if the provided language may be used with the selected project
 * @param {string} language the language to use
 * @param {string} projectType the project type to use
 * @param {object} [errors] an object to map errors to
 * @returns {boolean} did this validate successfully
 */
export function validateLanguage(language, projectType, errors) {
	return true;
}

export default {
	validateName,
	validateDescription,
	validateType,
	validateLanguage
}