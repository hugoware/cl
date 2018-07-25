import _ from 'lodash';
import $path from '../path';

// dependency resolvers
import commonResolver from './common';
import pugResolver from './pug';

/** Handles finding file dependencies for project files */
export default class DependencyResolver {

	/** Creates a new dependency resolver for a project
	 * @param {string} id the ID of the project to work with
	 * @param {string} path the path to resolve dependencies for
	*/
	constructor(id, path) {
		const ext = $path.extalias(path);

		this.projectPath = $path.resolveProject(id);
		this.path = $path.resolveProject(id, path);
		this.localPath = path;
		this.ext = ext;

		// find the resolver to use
		this.resolver = pugResolver.resolvesExtension(ext) ? pugResolver
			: commonResolver.resolvesExtension(ext) ? commonResolver
			: null;
	}

	/** Checks if a resolver was found for this path
	 * @returns {boolean} there was a resolver found or not
	 */
	get hasResolver() {
		return !!this.resolver;
	}

	/** Handles finding dependencies for a path in a project
	 * @returns {string[]} The paths for resolved dependencies
	 */
	async findDependencies() {
		const self = this;
		if (!this.hasResolver) return [];

		// requires searching
		return new Promise(async (resolve) => {
			const matches = await self.resolver.find(self);
			const files = _.filter(matches, file => file !== self.localPath);
			resolve(files);
		});
	}
}
