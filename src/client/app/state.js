import _ from 'lodash';
import $lfs from './lfs';

/** @typedef {Object} Project
 * @prop {string} name
 * @prop {string} description
 * @prop {ProjectItem[]} children
 */

/** @typedef {Object} ProjectItem 
 * @prop {string} name
 * @prop {string} path
 * @prop {string} id
 * @prop {ProjectItem} parent
 * @prop {ProjectItem[]} [children]
 * @prop {boolean} isFile
 * @prop {boolean} isFolder
 * @prop {boolean} isEmpty
*/

const $state = { 

	/** @type {Project} */
	project: null,

	/** a map of paths to project items
	 * @type {Object<string, ProjectItem}
	 */
	paths: { },

	/** a map of IDs to project items
	 * @type {Object<string, ProjectItem>}
	 */
	items: { },

	/** returns the resource domain for this project
	 * @returns {string} the root domain to use */
	getProjectDomain() {
		const { protocol, host } = window.location;
		return `${protocol}//${this.project.id}.${host}`;
	},

	/** syncs the project data
	 * @param {Project} project the data to replace
	*/
	updateProject: async project => {
		$state.project = project;
		$state.paths = { };
		$state.items = { };

		// rebuild the path indexes
		await syncProject(project.children, null, null);
	},

	/** finds a document item using a path
	 * @param {string} path the path to search
	 */
	findItemByPath: find => {
		return $state.paths[find];
		// for (const path in $state.paths)
		// 	if (path === find)
		// 		return $state.paths[path];
	},

	/** checks if a file path is found in the project
	 * @param {string} path the path of the file to check
	 * @returns {boolean} was this file found or not
	 */
	fileExists: path => {

		// remove the leading slash, if any
		// there's a bit of a battle of using and removing
		// the slash in different places
		path = path.replace(/^\//, '');
		return !!$state.findItemByPath(path);
	}

};


// rebuilds the paths for each file in the project
async function syncProject(children = [ ], parent, relativeTo) {
	relativeTo = relativeTo ? `${relativeTo}/` : '';

	// update each child path
	for (const item of children) {

		// create a unique ID to make tracking easier
		item.id = _.uniqueId('id:');
		item.path = relativeTo + item.name;
		item.parent = parent;

		// save the path info
		$state.paths[item.path] = item;
		$state.items[item.id] = item;

		// gather extra info about this item
		item.isFolder = _.isArray(item.children);
		item.isFile = !item.isFolder;
		item.isEmpty = item.isFolder && !_.some(item.children);

		// check if this is  
		if (!item.isEmpty)
			await syncProject(item.children, item, item.path);

		// check if this is a content file 
		if ('content' in item)
			await $lfs.write(item.path, item.content);


	}
}

export default $state;