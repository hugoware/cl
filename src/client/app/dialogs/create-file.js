import _ from 'lodash';
import Dialog from './';
import Component from '../component';
import $state from '../state';

export default class CreateFileDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-file',

			ui: {
				fileSelection: '.file-type-selector',
				fileTypes: '.file-type',
				categories: '.category',

				folderPath: '.in-folder',
				fileName: '.fileName',
				extension: '.extension',

				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});

		this.listen('activate-project', this.onActivateProject);
		this.on('click', '.category', this.onSelectCategory);
		this.on('click', '.file-type', this.onSelectFileType);
		this.on('click', '.selected-file-type .cancel', this.clearSelection);
		this.ui.cancel.on('click', this.onCancel);
	}

	// the extension to use for this file
	get extension() {
		return this._extension;
	}

	set extension(value) {
		this._extension = value;
		this.ui.extension.text(value);
	}

	// saving to the root of the project
	get isRoot() {
		return _.trim(this.folderPath) === '';
	}

	// the location to save to
	get folderPath() {
		return this._folderPath;
	}

	set folderPath(value) {
		this._folderPath = value;
		this.ui.folderPath.text(value);
	}

	// changes the file name value
	set fileName(value) {
		this.ui.fileName.text(value);
	}

	// gets the name fileName input
	get fileName() {
		return this.ui.fileName.text();
	}

	// called when opening a new project
	onActivateProject = project => {
		this.changeClass(/allow\-file\-type\-[a-z]+/gi, '');

		// activate each allowed type
		// TODO: this is project dependent
		const allowed = ['html', 'css', 'scss', 'pug', 'js', 'ts', 'txt', 'xml'];
		_.each(allowed, type => {
			console.log('add', `allow-file-type-${type}`);
			this.addClass(`allow-file-type-${type}`);
		});

	}

	// called when opening the dialog
	onActivate = ({ folder } = { }) => {

		// set the selected folder location
		const path = folder && folder.path;
		this.toggleClassMap({
			'in-root': !path,
			'in-folder': !!path
		});

		delete this.fileType;
		this.folderPath = path;
		this.selectCategory('all');
		this.clearSelection();
	}
	
	// handle changing the category filter
	onSelectCategory = event => {
		const target = Component.bind(event.target);
		this.selectCategory(target);
	}

	/** replaces the category selection
	 * @param {string} category the new category to use
	 */
	selectCategory = category => {
		let target;

		// provided a string name
		if (_.isString(category))
			target = this.find(`[category="${category}"]`);

		// provided the DOM element
		else {
			target = category;
			category = target.attr('category');
		}

		// get the replacement category
		this.ui.fileSelection.changeClass(/category\-[a-z]+/, '');
		this.ui.fileSelection.addClass(`category-${category}`);

		// change the selection
		this.ui.categories.removeClass('selected');
		target.addClass('selected');

		// for clarity sake, if the category is changed, but the selected
		// file type is no longer visible, remove the type selection
		this.clearSelection();
	}
	
	// handle changing the category filter
	onSelectFileType = event => {
		const target = Component.locate(event.target, '.file-type');
		this.selectFileType(target);
	}

	clearSelection = () => {
		this.ui.fileTypes.removeClass('selected');
		this.removeClass('has-type-selected');
		this.changeClass(/file\-type\-[a-z]+/, '');
	}

	/** replaces the category selection
	 * @param {string} type the new category to use
	 */
	selectFileType = type => {
		this.ui.fileTypes.removeClass('selected');
		this.addClass('has-type-selected');
		
		// find the selection
		const target = _.isString(type)
			? Component.locate(event.target, `[file-type="${type}"]`)
			: type;
		
		// update the visible file extension
		const category = target.attr('category');
		type = target.attr('file-type');
		this.fileName = category;
		this.extension = `.${type}`;
		
		// swap the selected file type
		this.changeClass(/file\-type\-[a-z]+/, '');
		this.addClass(`file-type-${type}`);
		
		// get the target type
		target.addClass('selected');
		this.fileType = target.attr('file-type');
		this.ui.fileName.selectText();
	}

	// if everything was selected
	onConfirm = async () => {

		const name = _.trim(this.fileName);
		const extension = _.trim(this.extension);
		const location = this.isRoot ? '' : this.folderPath;
		const path = `${location}/${name + extension}`;

		// console.log('wants to save', path);
		// try and create the new file
		this.busy = true;
		try {
			await $state.createFile(path);
		}
		catch (err) {
			console.log(err);
			// handleError(err, {

			// });
		}
		finally {
			this.busy = false;
		}

	}

}