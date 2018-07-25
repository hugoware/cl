import _ from 'lodash';
import $path from 'path';
import $config from './config';

/**
 * Resolves a path
 * @param {...string[]} args 
 * @returns {string} the resolved path
 */
export function resolve(...args) {
	return $path.resolve(...args);
}

/** Resolves a path from the root of the project
 * @param {string} path the path to resolve
 * @returns {string} the resolved path
 */
export function resolveRoot(path) {
  path = path.replace(/\/+/, '/')
    .replace('~', $config.root);
  return $path.resolve(path);
}

/** Resolves a path to a node module for the project
 * @param {string} path the path to resolve
 * @returns {string} the resolved path
 */
export function resolveModule(path) {
  return resolveRoot(`~/node_modules/${path}`);
}

/** Resolves a path from the application directory
 * @param {string} path the path to resolve
 * @returns {string} the resolved path
 */
export function resolvePath(path) {
  path = removeLeadingSlash(path);
  return resolveRoot(`~/dist/${path}`);
}

/** Resolves a path from the public web server directory
 * @param {string} path the path to resolve
 * @returns {string} the resolved path
 */
export function resolvePublic(path) {
  path = removeLeadingSlash(path);
  return resolveRoot(`~/dist/public/${path}`);
}

/** Resolves a path to the temporary file cache
 * @param {string} path the path to resolve
 * @returns {string} the resolved path
 */
export function resolveCache(path) {
  path = removeLeadingSlash(path);
  const result = $path.resolve(resolveRoot('~/.cache') + path);
  return result;
}

/** Resolves a path to the reserved data directory
 * @param {string} path the path to resolve
 * @returns {string} the resolved path
 */
export function resolveData(path) {
  path = removeLeadingSlash(path);
  const result = $path.resolve(resolveRoot('~/.data') + path);
  return result;
}

/** Resolves a project path
 * @param {string} id the ID of the project to resolve
 * @param {string?} path an additional path to include
 * @returns {string} the resolved path
 */
export function resolveProject(id, path = '', fromCache) {
  if (fromCache)
    path = `.cache/${path}/`;

  // sort out the path
  path = removeLeadingSlash(path);
  const result = $path.resolve(resolveRoot(`~/.data/projects/${id}`) + `/${path}`);
  return result;
}

/** Returns a simple alias for a file extension (lowercase, no leading delimeter)
 * @param {string} path The path to get the extension from
*/
export function extalias(path) {
  return $path.extname(path).toLowerCase().replace(/^\./, '')
}

// removes any leading slashes for path requests
function removeLeadingSlash(str) {
	return _.trim(str).replace(/^\/*/, '');
}

export default {
	resolve,
	extalias,
	resolveRoot,
	resolveModule,
	resolvePath,
	resolvePublic,
	resolveCache,
	resolveProject,
	resolveData
};