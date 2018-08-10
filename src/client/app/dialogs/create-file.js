import _ from 'lodash';
import Dialog from './';
import Component from '../component';

export default class CreateFileDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-create-file',

			ui: {
				fileSelection: '.file-type-selector',
				fileTypes: '.file-type',
				categories: '.category',

				fileName: '.fileName',
				extension: '.extension',

				submit: '.action.submit',
				cancel: '.action.cancel',
			}
		});

		this.on('click', '.category', this.onSelectCategory);
		this.on('click', '.file-type', this.onSelectFileType);
		this.ui.cancel.on('click', this.onCancel);
	}

	// changes the file extension for the file
	set extension(value) {
		this.ui.extension.text(value);
	}

	// changes the file name value
	set fileName(value) {
		this.ui.fileName.text(value);
	}

	// gets the name fileName input
	get fileName() {
		return this.ui.fileName.text();
	}

	onActivate = () => {
		delete this.fileType;
		this.selectCategory('all');
		this.removeClass('has-type-selected');
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
		let selection = this.ui.fileSelection.attr('class');
		selection = selection.replace(/ ?category\-[a-z]+ ?/, '');
		this.ui.fileSelection.attr('class', selection);
		this.ui.fileSelection.addClass(`category-${category}`);

		// change the selection
		this.ui.categories.removeClass('selected');
		target.addClass('selected');
	}
	
	// handle changing the category filter
	onSelectFileType = event => {
		const target = Component.locate(event.target, '.file-type');
		this.selectFileType(target);
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

		console.log('target', target);

		// update the visible file extension
		const category = target.attr('category');
		type = target.attr('file-type');
		this.fileName = category;
		this.extension = `.${type}`;

		// get the target type
		target.addClass('selected');
		this.fileType = target.attr('file-type');
	}

}