/// <reference path="../types/index.js" />

import { _ } from '../lib';
import Dialog from './';
import Component from '../component';
import $state from '../state';
import ErrorMessage from '../ui/error-message';
import { getExtension, cancelEvent } from '../utils/';

const MAX_FILE_SIZE_KB = 1024 * 1024 * 10;
const MAX_FILE_SIZE_MB = Math.floor(MAX_FILE_SIZE_KB / 1000000);

export default class UploadFileDialog extends Dialog {

	constructor() {
		super({
			template: 'dialog-upload-files',

			ui: {
				uploads: '.uploads',
				error: '.error',
				cancel: '.action.cancel'
			}
		});

		/** @type {number} the number of pending uploads */
		this.activeUploads = 0;

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: { }
		});

		// setup special events
		this.dialog.on('dragenter', this.onDragEnter);
		this.dialog.on('dragleave', this.onDragLeave);
		this.dialog.on('dragover', this.onDragOver);
		this.dialog.on('drop', this.onDrop);

		// listen for individual events
		this.ui.uploads.on('click', '.options .overwrite', this.onOverwriteFile);
		this.ui.uploads.on('click', '.options .clear', this.onCancelUpload);
		this.ui.uploads.on('upload-start', this.onUploadStart);
		this.ui.uploads.on('upload-end', this.onUploadEnd);

	}

	// when the dialog is opened
	onActivate = target => {
		const { folder } = target;
		this.parent = folder ? folder.path : '';

		// clear out pending uploads
		this.activeUploads = 0;
		this.ui.uploads.empty();
	}

	onUploadStart = () => {
		this.addClass('is-uploading');
		this.activeUploads++;
	}
	
	onUploadEnd = () => {
		this.activeUploads--;
		this.toggleClass('is-uploading', this.activeUploads === 0);
	}

	// forces the upload event
	onOverwriteFile = event => {
		const item = Component.getContext(event.target);
		item.upload(true);
	}

	// cancels the upload attempt
	onCancelUpload = event => {
		console.log('try remove');
		const item = Component.getContext(event.target);
		item.remove();
	}

	// enters the drag area
	onDragEnter = event => {
		this.addClass('show-drop-target');
		return cancelEvent(event);
	}
	
	// leaves the drag area
	onDragLeave = event => {
		this.removeClass('show-drop-target');
		return cancelEvent(event);
	}
	
	// over the drag area
	onDragOver = event => {
		this.addClass('show-drop-target');
		return cancelEvent(event);
	}
	
	// create the new file upload attempt
	onDrop = event => {
		this.removeClass('show-drop-target');

		// make sure this is allowed to do
		const files = [].slice.call(event.originalEvent.dataTransfer.files);
		const selected = _.map(files, file => ({
			name: file.name
		}));

		// make sure this can be uploaded
		if (!$state.checkPermissions('UPLOAD_FILE', { files: selected }))
			return cancelEvent(event);

		// send of each file for upload
		for (const file of files) {
			const item = new FileUpload(file, this.parent);
			item.appendTo(this.ui.uploads);
			item.upload();

			// update the scroll position
			const container = this.ui.uploads[0];
			container.scrollTop = Number.MAX_SAFE_INTEGER;
		}

		return cancelEvent(event);
	}

	// don't exit till files are uploaded
	onCancel = () => {
		if (this.activeUploads > 0)
			return false;
	}

}


// individual file upload attempt
class FileUpload extends Component {

	constructor(file, parent) {
		super({
			template: 'dialog-upload-file-item',
			ui: {
				name: '.name',
				progressBar: '.progress .current',
				error: '.action .error-message'
			}
		});

		this.errorMessage = new ErrorMessage({
			$: this.ui.error,
			errors: {
				file_upload_too_large: () => `You can only upload files that are a maximum of ${MAX_FILE_SIZE_MB}MB`,
				file_upload_invalid_type: () => `You cannot upload \`${getExtension(this.file.name)}\` file types`,
				default: 'There was an error uploading this file'
			}
		});

		// save the file info
		this.parent = parent;
		this.file = file;

		// update the UI
		this.ui.name.text(file.name);

		// verify this can be used
		try {
			validateUpload(this);
		}
		catch (err) {
			this.errorMessage.apply(err);
			this.finish('failed');
			this.isInvalid = true;
		}
	}

	// update the file upload progress
	onProgress = percent => {
		this.ui.progressBar.css({ width: `${percent * 100}%` });
	}

	/** performs the upload request */
	upload = async ignoreWarning => {
		if (this.hasRequested) return;
		const { file, parent, onProgress } = this;

		// check if possible
		if (this.isInvalid || (this.hasWarning && !ignoreWarning))
			return;

		// since it's working, set it to active
		this.hasRequested = true;
		this.removeClass('warning');
		this.addClass('active');

		// kick off the request
		this.raiseEvent('upload-start');
		try {

			// perform the upload
			const result = await $state.uploadFile(file, parent, onProgress);
			if (!result.success)
				throw result;

			// this worked
			this.broadcast('file-uploaded', { success: true, file: this.file });
			this.finish('success');
		}
		catch (err) {
			this.broadcast('file-uploaded', { file: this.file });
			this.finish('failed');
			this.errorMessage.apply(err);
		}
		finally {
			this.raiseEvent('upload-end');
			this.removeClass('active');
		}

	}

	// triggers finishing the upload
	finish(state) {
		this.addClass(`${state} done`);
	}

}

// verifies an upload before starting
function validateUpload(upload) {
	const { file, parent } = upload;
	const target = $state.findItem(parent) || $state.project;

	// check if this is conflicted or not
	const hasConflict = _.some(target.children, { name: file.name });
	console.log('checking for', target, hasConflict);;
	if (hasConflict) {
		upload.hasWarning = true;
		upload.addClass('warning');
		return;
	}

	// check other things, like file size or types
	if (file.size > MAX_FILE_SIZE_KB)
		throw 'file_upload_too_large';

	// check the file type
	const extension = getExtension(file.name);
	if (!$state.isValidFileType(extension))
		throw 'file_upload_invalid_type';

}