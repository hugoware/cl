
import _ from 'lodash';
import $madge from 'madge';
import DependencyResolver from './index';

// file types to resolve for
const RESOLVES_FOR = [
	'ts',
	'js',
	'sass', 'scss'
];

// related file types for dependency resolution
const EXTENSION_MAP = {
	ts: ['ts'],
	css: ['scss', 'sass'],
	sass: ['scss', 'sass'],
	scss: ['scss', 'sass']
};

/** determines if this resolver works for the extension provided */
function resolvesExtension(ext) {
	return _.includes(RESOLVES_FOR, ext);
}

/*** gathers dependencies for common files
 * @param {DependencyResolver} resolver the core resolver class
 */
async function find(resolver) {
	const fileExtensions = EXTENSION_MAP[resolver.ext];

	// search for dependencies
	const result = await $madge(resolver.projectPath, {
		filter: path => /\/\.cache\/?/i.test(path),
		fileExtensions
	});
	
	// check for local dependencies
	const local = resolver.localPath.replace(/^\/+/, '');
	return result.depends(local);
}

export default {
	resolvesExtension,
	find
};