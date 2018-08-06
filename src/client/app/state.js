/// <reference path="./types/index.js" />

import _ from 'lodash';
import $lfs from './lfs';
import {getExtension} from './utils/index'

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
		$state.projectId = project.id;
		await syncProject(project.children, null, null);

		window.STATE = $state;
	},

	// /** finds a project item using an ID
	//  * @param {string} id the ID of the item to find
	//  * @returns {ProjectItem}
	//  */
	// getItemById(id) {
	// 	return $state.items[id];
	// },

	/** finds a document item using a path
	 * @param {string} path the path to search
	 */
	findItemByPath: find => {
		return $state.paths[find];
	},

	/** checks if a file path is found in the project
	 * @param {string} path the path of the file to check
	 * @returns {boolean} was this file found or not
	 */
	fileExists: path => {
		return !!$state.findItemByPath(path);
	},

	/** marks a file as opened as well as syncs the file
	 * content with the file system
	 * @param {string} path the file path to open
	 * @param {boolean} [forceRefresh] force the sync, even if the file is already "open"
	 */
	openFile: async (path, forceRefresh = false) => {
		const file = $state.findItemByPath(path);
		if (!file) return;

		// mark the file as open
		if (!file.isOpen || forceRefresh)
			await $lfs.write(file.path, file.content);

		// mark the file as open
		file.isOpen = true;
	},

	/** handles mapping local file information to
	 * the project record 
	 * @param {string} path the file path to save
	 * @param {string} content the file content to replace, if not provided, the content is loaded from the file system
	 */
	saveFile: async (path, content) => {
		const file = $state.findItemByPath(path);
		if (!file) return;

		// load the content, if missing
		if (!_.isString(content))
			content = await $lfs.read(path);

		// replace the content for this entry
		file.content = content;
	},

	/** handles marking a file as closed 
	 * @param {string} path the file to close
	*/
	closeFile: (path) => {
		const file = $state.findItemByPath(path);
		if (!file) return;
		file.isOpen = false;
	}

};


// rebuilds the paths for each file in the project
async function syncProject(children = [ ], parent, relativeTo) {
	relativeTo = relativeTo ? `${relativeTo}/` : '';
	const prefix = parent ? '' : '/';

	// update each child path
	for (const item of children) {

		// create a unique ID to make tracking easier
		item.id = _.uniqueId('id:');
		item.path = prefix + relativeTo + item.name;
		item.parent = parent;

		// save the path info
		$state.paths[item.path] = item;
		$state.items[item.id] = item;

		// gather extra info about this item
		item.isFolder = _.isArray(item.children);
		item.isFile = !item.isFolder;
		item.isEmpty = item.isFolder && !_.some(item.children);

		// file info
		if (item.isFile)
			item.ext = getExtension(item.path, { removeLeadingDot: true });

		// check if this is  
		if (!item.isEmpty)
			await syncProject(item.children, item, item.path);

		// check if this is a content file 
		if ('content' in item)
			await $lfs.write(item.path, item.content);


	}
}

export default $state;