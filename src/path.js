
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
	path = sanitizePath(path);
  path = path.replace('~', $config.root);
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

/** Resolves a path to a lesson directory
 * @param {string} [id] the ID of the lesson to find
 * @param {string} [file] the file to locate in the lesson directory
 * @returns {string} the resolved path
 */
export function resolveLesson(id = '', file) {
	let path = `~/dist/lessons/${id}`;
	if (!!file) path += '/' + removeLeadingSlash(file)
  return resolveRoot(path);
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
	path = sanitizePath(path);
	path = removeLeadingSlash(path);
	path = removeTrailingSlash(path);
	const root = resolveRoot(`~/.data/projects/${id}`);
	const result = $path.resolve(`${root}/${path}`);
	const head = result.substr(0, root.length);
	const tail = result.substr(root.length + 1);
	const startsWith = head === root;
	const endsWith = tail === path;
	return startsWith && endsWith ? result : null;
}

/** Returns a simple alias for a file extension (lowercase, no leading delimeter)
 * @param {string} path The path to get the extension from
*/
export function extalias(path) {
  return $path.extname(path).toLowerCase().replace(/^\./, '')
}

/** returns full information about a path 
 * @param {string} path the full path to the file
 * @returns {PathInfo}
*/
export function getPathInfo(path) {
	const segments = _.trim(path).split(/\/+/g);
	const fileName = segments.pop();
	const directory = segments.join('/');
	const ext = extalias(fileName);
	const name = fileName.substr(0, (fileName.length - (ext.length + 1)));
	return { fileName, directory, ext, name };
}

/** removes any leading slashes for path requests 
 * @param {string} str the path to remove from
*/
export function removeLeadingSlash(str) {
	return _.trim(str).replace(/^\/*/, '');
}

/** removes any trailing slashes for path requests 
 * @param {string} str the path to remove from
*/
export function removeTrailingSlash(str) {
	return _.trim(str).replace(/\/*$/, '');
}

/** handles cleaning up a path to make sure it's usable
 * @param {string} path the path to clean up
 * @returns {string} the final path to return
 */
export function sanitizePath(path) {
	path = _.trim(path);
	return path.replace(/\/+/g, '/')
		.replace(/\.+/g, '.')
		.replace(/\/\.\//g, '/');
}

export default {
	resolve,
	extalias,
	getPathInfo,
	removeLeadingSlash,
	resolveRoot,
	resolveModule,
	resolvePath,
	resolvePublic,
	resolveCache,
	resolveProject,
	resolveData,
	sanitizePath,
};