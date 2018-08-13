/// <reference path="./types/index.js" />

import _ from 'lodash';
import $lfs from './lfs';
import $api from './api';
import { getExtension, getPathInfo } from './utils/index';
import { broadcast } from './events';
import { simplifyPathCollection } from '../../utils/project';

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

	// /** handles mapping local file information to
	//  * the project record 
	//  * @param {string} path the file path to save
	//  * @param {string} content the file content to replace, if not provided, the content is loaded from the file system
	//  */
	// saveFile: async (path, content) => {
	// 	const file = $state.findItemByPath(path);
	// 	if (!file) return;

	// 	// load the content, if missing
	// 	if (!_.isString(content))
	// 		content = await $lfs.read(path);

	// 	// replace the content for this entry
	// 	file.content = content;
	// },

	/** handles marking a file as closed 
	 * @param {string} path the file to close
	*/
	closeFile: (path) => {
		const file = $state.findItemByPath(path);
		if (!file) return;
		file.isOpen = false;
	},

	/** resets the item selection state in the app */
	clearSelection: () => {
		$state.selected = {};
	},

	/** returns a list of all selected items */ 
	getSelection: () => {
		const selections = [ ];
		_.each($state.selected, (selected, path) => {
			if (selected) selections.push(path);
		});

		return selections;
	},

	/** writes file data to the server */
	saveFile: async (path, content) => {
		const { projectId } = $state;
		const result = await $api.request('write-file', { projectId, path, content });

		// returned, but actually failed
		if (!result.success)
			throw result;

		// finalize the file changes
		const file = $state.findItemByPath(path);
		file.content = content;

		// notify and return
		broadcast('save-file', path);
		return result;
	},

	/** requests a new file be created */
	createFile: async path => {
		const { projectId } = $state;
		const result = await $api.request('create-file', { projectId, path });

		// returned, but actually failed
		if (!result.success)
			throw result;

		// find the folder this was added into
		const data = getPathInfo(path, { removeTrailingSlash: true });
		let parent = $state.findItemByPath(data.directory) || $state.project;
		parent.children = parent.children || [ ];
		parent.children.push(result.file);

		// select by default
		$state.clearSelection();
		result.file.selected = true;

		// also sort the files by their name
		_.sortBy(parent.children, 'name');

		// if the parent isn't already expanded, do it now
		while (parent) {
			parent.expanded = true;
			parent = parent.parent;
		}

		// update the project data
		await $state.updateProject($state.project);
		broadcast('update-project', $state.project);

		// also, open the new file
		const file = $state.findItemByPath(path);
		broadcast('activate-file', file);
		return result;
	},

	/** handles removing a series of items from the project
	 * @param {string[]} selection the path items to remove
	 */
	deleteItems: async selection => {
		const items = simplifyPathCollection(selection);
		const { projectId } = $state;
		const result = await $api.request('remove-items', { projectId, items });

		// appears there was some sort of error
		if (!result.success)
			throw result;

		// since it was successful, clear out all items
		const remove = [ ];
		for (const path of items) {
			const item = $state.findItemByPath(path);
			deleteItem(item, remove);
		}

		// with the list of files to remove, clear the local
		// stored versions of the file
		$lfs.remove(remove);

		// share that files have been removed so the
		// UI can update
		broadcast('delete-items', items);

		// notify the result
		return result;
	}

};

// handles deleting an item and all children
function deleteItem(item, files) {
	
	// make sure it's removed from selection
	delete $state.selected[item.path];
	
	// add the file that needs to be removed
	if (item.isFile)
		files.push(item.path);

	// if this item has children, process them as well
	if (item.children)
		_.each(item.children, child => {
			deleteItem(child, files);
		});

		// remove it entirely from the parent node
		// maybe this could be handled better
		const parent = item.parent || $state.project;
		_.remove(parent.children, child => child.path === item.path);

		// final clean up
		delete $state.paths[item.path];
		delete $state.items[item.id];
		delete item.parent;

}


// rebuilds the paths for each file in the project
async function syncProject(children = [ ], parent, relativeTo) {
	relativeTo = relativeTo ? `${relativeTo}/` : '';
	const prefix = parent ? '' : '/';

	// update each child path
	for (const item of children) {

		// check if this has been synced yet
		if (!('id' in item)) {

			// create a unique ID to make tracking easier
			item.id = _.uniqueId('id:');
			item.path = prefix + relativeTo + item.name;
			item.parent = parent;

			// gather extra info about this item
			item.isFolder = _.isArray(item.children);
			item.isFile = !item.isFolder;
	
			// file info
			if (item.isFile)
				item.ext = getExtension(item.path, { removeLeadingDot: true });
	
			// check if this is a content file 
			if ('content' in item)
				await $lfs.write(item.path, item.content);

		}

		// save the path info
		$state.paths[item.path] = item;
		$state.items[item.id] = item;

		// check for files
		item.isEmpty = item.isFolder && !_.some(item.children);
		if (!item.isEmpty)
			await syncProject(item.children, item, item.path);
	}

}

export default $state;