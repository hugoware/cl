
import _ from 'lodash';
import $fs from '../storage/file-system';
import DependencyResolver from './index';

// file types to resolve for
const RESOLVES_FOR = [
	'pug',
	'jade'
];

/** determines if this resolver works for the extension provided */
function resolvesExtension(ext) {
	return _.includes(RESOLVES_FOR, ext);
}

/*** gathers dependencies for common files
 * @param {DependencyResolver} resolver the core resolver class
 */
async function find(resolver) {
	return await $fs.find(resolver.projectPath, ['.pug', '.jade'], {
		exclude: path => /\/\.cache(\/|$)/.test(path)
	});
}

export default {
	resolvesExtension,
	find
};