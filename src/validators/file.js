import _ from 'lodash';
import { stringify, resolveError } from './utils';

// list of allowed project types
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;
const PROJECT_FILE_TYPES = {
  web: ['html', 'js', 'css', 'json', 'ts', 'scss', 'xml', 'txt'],
  mobile: ['html', 'js', 'css', 'scss', 'json', 'xml', 'txt'],
  code: ['js', 'json', 'txt', 'xml'],
  game: ['js', 'json', 'txt', 'xml'],
};

/** validates the provided name for a project
 * @param {string} type the requested project type
 * @param {object} [errors] an object to map errors
 * @returns {boolean} did this validate successfully
 */
export function validateName(name, errors) {
  name = stringify(name);
  const err =
    name.length < MIN_NAME_LENGTH
      ? 'required'
      : name.length > MAX_NAME_LENGTH
      ? 'too_long'
      : /[^a-z0-9 \-_]+/i.test(name)
      ? 'invalid'
      : null;

  return resolveError('name', err, errors);
}

/** validates if a file type is allowed for a specific project
 * @param {string} type the requested project type
 * @param {object} [errors] an object to map errors
 * @returns {boolean} did this validate successfully
 */
export function validateType(ext, projectType, errors) {
  // check types, improve this later
  const valid = PROJECT_FILE_TYPES[projectType];
  const err = !valid || !_.includes(valid, ext) ? 'invalid' : null;
  return resolveError('type', err, errors);
}

export default {
  validateName,
  validateType,
};
