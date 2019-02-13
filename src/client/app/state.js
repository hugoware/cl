/// <reference path="./types/index.js" />

import { _ } from './lib';
import $lfs from './lfs';
import $api from './api';
import $speech from './speech';
import { getExtension, getPathInfo } from './utils/index';
import { broadcast, listen } from './events';
import { simplifyPathCollection } from '../../utils/project';
import Lesson from './lesson';
import checkPermissions from './permissions';

const ROOT = { path: '/' };
const CODE_FILES = ['html', 'js', 'ts', 'css', 'scss', 'txt', 'sql', 'pug', 'py', 'rb'];
const IMAGE_FILES = ['jpg', 'jpeg', 'bmp', 'png', 'gif'];

const isProd = !/localhost/gi.test(window.location.host);

const $state = {

	// some helpers
	isProd,
	isLocal: !isProd,

	/** @type {UserDetail} */
	user: null,

	/** @type {Object<string, boolean>} map of lesson permissions */
	permissions: null,

	/** tracks the config flags in a project */
	flags: { },

	/** @type {Lesson} */
	lesson: null,

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

	/** current content for files in the editor
	 * @type {Object<string, string>}
	 */
	content: { },

	/** checks if the application is in free mode, meaning not managed by a lesson */
	get freeMode() {
		return !$state.lesson
			|| ($state.lesson && $state.lesson.done)
			|| window.__FREEMODE__ === true;
	},

	/** returns all folders found in the project 
	 * @returns {ProjectItem} found folders
	 */
	get folders() {
		return _($state.paths).values().filter(item => item.isFolder).value();
	},
	
	/** returns all files found in the project 
	 * @returns {ProjectItem} found folders
	*/
	get files() {
		return _($state.paths).values().filter(item => item.isFile).value();
	},

	/** returns a list of all open files
	 * @returns {ProjectItem[]} the open files
	 */
	get openFiles() {
		return _.filter($state.files, 'isOpen');
	},

	/** returns a list of all modified files
	 * @returns {ProjectItem[]} the modified files
	 */
	get modifiedFiles() {
		return _.filter($state.files, 'modified');
	},

	/** returns the currently active file
	 * @returns {ProjectItem} the active file
	 */
	get activeFile() {
		return _.find($state.files, 'isActive');
	},

	// creates an in-memory restore point for files
	createRestorePoint: () => {

		// save each restore point
		_.each($state.files, file => {
			if (file.hasContent)
				file.restore = file.current || file.content;
		});

	},

	/** clears all project data and notifies the app */
	clearProject: () => {

		// cleanup
		if ($state.lesson)
			$state.lesson.dispose();

		// reset
		$state.project = null;
		$state.lesson = null;
		$state.paths = { };
		$state.items = { };
		$state.content = { };
		broadcast('deactivate-project');
	},

	/** checks if any files are currently unsaved */
	hasUnsavedFiles: () => {
		if (!$state.project) return false;
		const { files } = $state;
		for (const file of files)
			if (file.modified)
				return true;
		return false;
	},

	/** opens the current project in a window */
	openProjectPreviewWindow: ({ id, path = '' } = { }) => {

		// without an ID, check for the current project
		if (!id) {
			const { project } = $state;
			
			// without a project, this can't be done
			if (!project) return;
			
			// get the current project ID
			id = project.id;
		}

		// open the window
		const { protocol, host } = window.location;
		window.open(`${protocol}//${id}.${host}${path}`, `__project_${id}`);
	},

	/** returns the resource domain for this project
	 * @returns {string} the root domain to use */
	getProjectDomain: () => {
		const { version, project } = $state;
		const { id } = project;
		const { protocol, host } = window.location;
		return `${protocol}//${version}.${id}.${host}`;
	},

	/** checks for a lesson permission
	 * @param {string} key the permission to check for
	 * @returns {boolean} does the user have access
	 */
	checkPermissions: (permissions, ...args) => {
		if ($state.freeMode) return true;
		return checkPermissions($state, permissions, args);
	},

	/** checks if a file type can be uploaded or not
	 * @param {string} ext the file extension to test
	 */
	isValidFileType: ext => {
		// return _.includes(['html', 'js', 'ts'])
		return true;
	},

	/** updates the version number for the project */
	updateVersion: () => {
		$state.version = +new Date;
	},

	/** syncs the project data
	 * @param {Project} project the data to replace
	*/
	updateProject: async project => {
		$state.project = project;
		$state.paths = { };
		$state.items = { };
		$state.config = { };
		$state.flags = { };
		$state.content = { };

		// rebuild the path indexes
		$state.projectId = project.id;
		$state.updateVersion();
		await syncProject(project.children, null, null);

		window.STATE = $state;
	},

	/** activates a lesson for a user */
	updateLesson: async project => {
		return new Promise(async resolve => { 

			// then load the project data
			if ('lesson' in project && !project.finished) {

				// since lessons depend on speech, make sure
				// the speech engine is loaded
				try {
					await $speech.init();
				}
				// failed to load
				catch (err) {
					console.log('tried for speech', err);
					// hide speech options
				}

				// populate modified files
				let modified = _.get(project, 'progress.modified', [ ]);
				if (!_.isArray(modified)) modified = [ ];

				// update all local files to use the current
				// lesson modified versions
				for (let i = 0; i < modified.length; i++) {
					const file = modified[i];
					await $lfs.write(file.path, file.content);
				}

				// load the lesson info
				$state.lesson = await Lesson.load(project);

				// ready to go
				resolve();
			}
			// no lesson to perform
			else {
				delete $state.lesson;
				resolve();
			}
		});
	},

	/** checks for the current content for a zone */
	getZoneContent: (path, id) => {
		const map = $state.lesson.getMap(path);
		return map.getContent(id);
	},

	/** gets the current content for a file path */
	getFileContent: (path, options) => {
		const file = $state.paths[path];
		if (!file) return '';

		// check what to use
		let content = file.current || file.content;
		if (options.useCached) content = file.content;
		return content;
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
	findItemByPath: path => {
		return $state.paths[path];
	},

	/** finds a document item using a path
	 * @param {string|ProjectItem} pathOrItem the object to look up
	 */
	findItem: pathOrItem => {
		const path = _.isObject(pathOrItem) ? pathOrItem.path : pathOrItem;
		return $state.paths[path];
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

	/** handles marking a file as closed 
	 * @param {string} path the file to close
	*/
	closeFile: (path) => {
		const file = $state.findItemByPath(path);
		if (!file) return;
		file.isOpen = false;
	},

	/** checks if an item is selected or not 
	 * @param {pathOrItem} pathOrItem the item or path to return selection state for
	 * @return {boolean} is this item selected or not
	*/
	isSelected: pathOrItem => {
		const path = _.isObject(pathOrItem) ? pathOrItem.path : pathOrItem;
		return !!$state.selected[path];
	},

	/** resets the item selection state in the app */
	clearSelection: () => {
		$state.selected = { };
	},

	/** sets an item as selected 
	 * @param {string|ProjectItem} pathOrItem the item to select
	 * @param {boolean} selected is the item selected or not
	 * @param {boolean} [shouldClearSelections] should this keep other selected items
	*/
	setSelection: (items, selected = true, shouldClearSelections = true) => {
		if (!!shouldClearSelections) $state.clearSelection();
		if (!_.isArray(items)) items = [ items ];
		_.each(items, pathOrItem => {
			const path = _.isObject(pathOrItem) ? pathOrItem.path : pathOrItem;
			$state.selected[path] = selected;
		});
	},

	/** returns a list of all selected items 
	 * @returns {ProjectItem[]} the selected items
	 * */ 
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
		file.modified = false;

		// version updates
		$state.updateVersion();

		// notify and return
		broadcast('save-file', path);
		return result;
	},

	/** handles moving all of the items */
	moveItems: async (paths, target) => {
		const { projectId } = $state;
		const result = await $api.request('move-items', { projectId, paths, target });

		// returned, but actually failed
		if (!result.success)
			throw result;

		// since this was successful, reorganize the project
		const moveTo = $state.findItem(target) || $state.project;
		const moves = simplifyPathCollection(paths);
		const renames = [ ];
		const selected = [ ];

		// start moving each item
		for (const move of moves) {
			const item = $state.findItem(move);
			const parent = item.parent || $state.project;

			// save the rename info
			const path = `${moveTo.path || ''}/${item.name}`;
			renames.push({
				previous: { name: item.name, path: item.path },
				item,
				name: item.name,
				path
			});

			// remove the existing reference
			_.remove(parent.children, child => child.path === item.path);

			// also remove any existing items in the same directory with
			// the same name since they will be overwritten
			_.remove(moveTo.children, child => child.name === item.name);
			moveTo.children.push(item);

			// select base on the new names
			selected.push(path);

			// force the rebuild
			delete item.id;
		}

		// make sure to expand the targeted folder
		expandFolder(moveTo);

		// update the data
		await $state.updateProject($state.project);
		$state.setSelection(selected);

		// move each file in the file system as well
		// for (let i = 0; i < renames.length; i++) {
		// 	const rename = renames[i];
		for (const rename of renames) {
			if (!(rename.item.isFile && rename.item.hasContent)) return;
			await $lfs.move(rename.previous.path, rename.path);
		}

		// broadcast relevant events
		_.each(renames, rename => broadcast('rename-item', rename));

		// notify the project is updated
		broadcast('update-project', $state.project);
	},

	/** performs a file upload to the server
	 * @param {File} file the file info to upload
	 * @param {string} parent the directory to upload the file to
	 * @param {function<number>} [onProgress] optional argument to track progress
	 */
	uploadFile: async (file, parent, onProgress) => {
		const { projectId } = $state;
		const path = `${parent}/${file.name}`;
		const result = await $api.uploadFile(projectId, path, file, onProgress);

		// make sure this worked
		if (!result || (result && !result.success))
			throw result || 'file_upload_error';

		// since it worked, we can add the file to the project
		const target = parent ? $state.findItem(parent) : $state.project;
		
		// if there happens to be another file of the exact same name, replace it
		const existing = _.find(target.children, { name: file.name });
		if (existing) {
			_.remove(target.children, { name: file.name });
			await $lfs.remove(existing.path);
		}

		// write the new file
		const create = { name: file.name };
		if ('content' in result)
			create.content = result.content;

		// save the record
		target.children.push(create);

		// update to project data
		await $state.updateProject($state.project);
		broadcast('update-project', $state.project);

		// upload was successful
		return result;
	},

	// handles renaming an item
	renameItem: async (item, name) => {
		const { projectId } = $state;
		const source = item.path;

		// get the updated name
		const parent = item.parent || $state.project;
		const target = `${parent.path || ''}/${name}`;

		// send the request
		const result = await $api.request('rename-item', { projectId, source, target });

		// handle the result
		if (!result.success)
			throw result;
	
		// replace the file name
		const update = $state.findItemByPath(item.path);
		const previous = { 
			name: item.name,
			path: item.path
		};

		// update the values
		delete update.id;
		update.name = name;
		update.path = target;
		
		// update the data
		$state.setSelection(target);
		await $state.updateProject($state.project);

		// update the file system value, if any
		if (update.isFile && update.hasContent)
			await $lfs.move(previous.path, update.path);

		// broadcast relevant events
		broadcast('rename-item', { previous, item, name, path: target });
		broadcast('update-project', $state.project);

		return result;
	},

	/** attempts to create a new folder in the project
	 * @param {string} path the path to create
	 */
	createFolder: async (name, relativeTo) => {
		const { projectId } = $state;
		const result = await $api.request('create-folder', { projectId, name, relativeTo });

		// check for an error
		if (!result.success)
			throw result;

		// add this to the project
		const { folder } = result;
		const { path } = folder;
		const data = getPathInfo(path);
		let parent = $state.findItemByPath(data.directory) || $state.project;
		parent.children = parent.children || [];
		parent.children.push(result.folder);

		// select by default
		$state.setSelection(path, true, true);

		// if the parent isn't already expanded, do it now
		expandFolder(parent);
		
		// update the project data
		await $state.updateProject($state.project);
		broadcast('update-project', $state.project);

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
		$state.setSelection(path, true, true);

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
		$state.clearSelection();

		// fix the version
		$state.updateVersion();

		// notify the result
		return result;
	}

};

// handles expanding a folder 
function expandFolder(parent) {
	let safety = 100;
	while (parent && (--safety > 0)) {
		parent.expanded = true;
		parent = parent.parent;
	}
}

// handles deleting an item and all children
function deleteItem(item, files) {
	
	// dont' delete missing items
	if (!item) {
		console.warn('tried to delete a null item');
		return;
	}
	
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

			// determine the type, if needed
			const { ext } = item;
			item.type = item.isFolder ? 'folder'
				: _.includes(CODE_FILES, ext) ? 'code'
				: _.includes(IMAGE_FILES, ext) ? 'image'
				: 'not-supported';
	
			// check if this is a content file 
			item.hasContent = 'content' in item;
			if (item.hasContent)
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

// clean up all lesson data
function disposeLesson() {
	if (!$state.lesson) return;
	$state.lesson.dispose();
	delete $state.lesson;
}

// clean up open files
listen('activate-file', file => {
	_.each($state.files, file => file.isActive = false);
	file.isOpen = true;
	file.isActive = true;
});

// setup opened file
listen('open-file', file => {
	file.isOpen = false;
});

// clean up closed file
listen('close-file', file => {
	file.isOpen = false;
	file.isActive = false;
});

// handle lesson cleanup
listen('deactivate-project', disposeLesson)
listen('lesson-finished', disposeLesson);

export default $state;