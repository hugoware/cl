import _ from 'lodash';
import { broadcast } from '../../events';
import $state from '../../state';
import { getPath } from './utils';

export default class FileAPI {

	constructor(lesson) {
		this.lesson = lesson;
	}

	// trigger opening a file
	open = ({ path, file }) => {
		path = getPath(path || file);
		$state.openFile(path);
	}

	close = ({ path, file }) => {
		path = getPath(path || file );
		$state.openFile(path);
	}

	// gets or sets the content
	content({ path, file, replaceRestore, content }) {
		file = this.get({ path, file });

		// changes the content for the file, if any
		if (_.isString(content)) {
			file.current = content;
			broadcast('set-editor-content', path, content, replaceRestore);
		}

		return file.current || file.content;
	}

	get({ path, file }) {
		path = getPath(path || file);
		return $state.paths[path];
	}
	
	// changes the edit mode for a file
	readOnly = ({ path, file, readOnly = true }) => {
		path = getPath(path || file);
		file = $state.paths[path];
		file.readOnly = readOnly;
		// broadcast('set-editor-readonly', file, !!readOnly);
	}

	// allow editing
	allowEdit = ({ path, file }) => {
		this.readOnly({ path, file, readOnly: false });
	}
	

}

