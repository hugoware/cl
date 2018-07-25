import _ from 'lodash';

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

	/** syncs the project data
	 * @param {Project} project the data to replace
	*/
	updateProject: project => {
		$state.project = project;
		$state.paths = { };
		$state.items = { };

		// rebuild the path indexes
		syncProject(project.children, null, null);
	},

	/** finds a document item using a path
	 * @param {string} path the path to search
	 */
	findItemByPath: find => {
		for (const path in $state.paths)
			if (path === find)
				return $state.paths[path];
	},

	/** checks if a file path is found in the project
	 * @param {string} path the path of the file to check
	 * @returns {boolean} was this file found or not
	 */
	fileExists: path => {
		return !!$state.paths[path];
	}

};


// rebuilds the paths for each file in the project
function syncProject(children, parent, relativeTo) {
	relativeTo = relativeTo ? `${relativeTo}/` : '';

	// update each child path
	_.each(children, item => {

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
			syncProject(item.children, item, item.path);

	});
}

export default $state;