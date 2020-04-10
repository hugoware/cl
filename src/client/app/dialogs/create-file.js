import { _ } from '../lib';
import Dialog from './';
import Component from '../component';
import TextInput from '../ui/text-input';
import ErrorMessage from '../ui/error-message';
import $state from '../state';
import { requirePermission } from '../views/project/prevent';

const ALLOWED_FILE_TYPES = {
  game: ['js', 'txt', 'xml', 'json'],
  code: ['js', 'txt', 'xml', 'json'],
  web: ['html', 'css', 'js', 'scss', 'ts', 'md', 'txt', 'xml', 'json'],
  mobile: ['html', 'css', 'js', 'scss', 'txt', 'xml', 'json'],
};

export default class CreateFileDialog extends Dialog {
  constructor() {
    super({
      template: 'dialog-create-file',

      ui: {
        fileSelection: '.file-type-selector',
        fileTypes: '.file-type',
        categories: '.category',

        error: '.error',
        folderPath: '.in-folder',

        fileName: '.fileName',
        extension: '.extension',

        submit: '.action.submit',
        cancel: '.action.cancel',
      },
    });

    this.errorMessage = new ErrorMessage({
      $: this.ui.error,
      errors: {
        name_required: `A file name is required`,
        name_too_long: `A file name cannot be longer than 50 characters`,
        name_invalid: `A file name cannot contain special characters`,
        file_already_exists: () =>
          `There is already a file named \`${this.fileDisplayName}\` in ${this.folderPathDisplayName}`,
        type_invalid: () =>
          `You cannot use a \`${this.extension}\` file type in this project`,
      },
    });

    this.fileName = new TextInput({
      $: this.ui.fileName,
      includeTail: true,
    });

    // handled when pressing enter
    this.fileName.on('confirm-entry', this.onConfirm);

    // events
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
    this.fileName.suffix = value;
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

  get folderPathDisplayName() {
    return this.isRoot ? 'the root of the project' : `\`${this.folderPath}\``;
  }

  get fileDisplayName() {
    return this.fileName.value + this.extension;
  }

  // called when opening a new project
  onActivateProject = (project) => {
    this.changeClass(/allow\-file\-type\-[a-z]+/gi, '');

    // activate each allowed type
    // TODO: this is project dependent
    const allowed = ALLOWED_FILE_TYPES[project.type];
    _.each(allowed, (type) => {
      this.addClass(`allow-file-type-${type}`);
    });
  };

  // called when opening the dialog
  onActivate = ({ folder } = {}) => {
    this.errorMessage.clear();

    // set the selected folder location
    const path = folder && folder.path;
    this.toggleClassMap({
      'in-root': !path,
      'in-folder': !!path,
    });

    delete this.fileType;
    this.folderPath = path;
    this.selectCategory('all');
    this.clearSelection();
  };

  // handle changing the category filter
  onSelectCategory = (event) => {
    const target = Component.bind(event.target);
    this.selectCategory(target);
  };

  /** replaces the category selection
   * @param {string} category the new category to use
   */
  selectCategory = (category) => {
    let target;

    // provided a string name
    if (_.isString(category)) target = this.find(`[category="${category}"]`);
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
  };

  // handle changing the category filter
  onSelectFileType = (event) => {
    const target = Component.locate(event.target, '.file-type');
    this.selectFileType(target);
  };

  clearSelection = () => {
    this.errorMessage.clear();
    this.ui.fileTypes.removeClass('selected');
    this.removeClass('has-type-selected');
    this.changeClass(/file\-type\-[a-z]+/, '');
  };

  /** replaces the category selection
   * @param {string} type the new category to use
   */
  selectFileType = (type) => {
    this.errorMessage.clear();
    this.ui.fileTypes.removeClass('selected');
    this.addClass('has-type-selected');

    // find the selection
    const target = _.isString(type)
      ? Component.locate(event.target, `[file-type="${type}"]`)
      : type;

    // update the visible file extension
    const category = target.attr('category');
    const preferredName = target.attr('file-name');
    type = target.attr('file-type');
    this.fileName.value = preferredName || category;
    this.extension = `.${type}`;

    // swap the selected file type
    this.changeClass(/file\-type\-[a-z]+/, '');
    this.addClass(`file-type-${type}`);

    // get the target type
    target.addClass('selected');
    this.fileType = target.attr('file-type');
    this.fileName.select();
  };

  // if everything was selected
  onConfirm = async () => {
    if (this.busy) return;

    // make sure something was entered
    if (_.trim(this.fileName.value) === '') return;

    // check the selection
    const name = _.trim(this.fileName.value);
    const extension = _.trim(this.extension);
    const location = this.isRoot ? '' : this.folderPath;
    const path = `${location}/${name + extension}`;

    // console.log('wants to save', path);
    // try and create the new file
    this.busy = true;
    try {
      const result = await $state.createFile(path);
      if (result.success) this.hide();
      else this.errorMessage.apply(result);
    } catch (err) {
      this.errorMessage.apply(err);
    } finally {
      this.busy = false;
    }
  };

  onCancel = () => {
    // requirePermission({
    // 	require: !$state.getPermission('DISALLOW_DIALOG_HIDE')
    // });
  };
}
