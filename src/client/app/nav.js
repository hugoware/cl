
import { broadcast } from './events';
import { _ } from './lib';
import $state from './state';

class Nav {

	constructor() {

		/** @type {string[]} a series of url params */
		this.segments = [ ];
		this.current = window.location.hash;

		// updateState the view
		window.addEventListener('hashchange', () => {
			if (this.updating) return;

			// has unsaved changes
			// if (this.segments[0] === 'project' && $state.hasUnsavedFiles())
			this.go(window.location.hash);

		});

		// sets the default state
		this.go(window.location.hash);
	}

	/** is the current view for the project editor page */
	get isProjectView() {
		return this.segments[0] === 'project';
	}

	/** changes the URL navigation for the app
	 * @param {string} path the new path to navigate to
	 */
	go = path => {

		// TODO: this doesn't work at all - at worst
		// the screen just flashes for all navigation, including
		// the same page
		if (path === this.lastNavigationPath) return;

		// check for unsaved changes first
		if (this.isProjectView && $state.hasUnsavedFiles() && $state.checkPermissions(['SAVE_FILE']))
			broadcast('open-dialog', 'unsaved-changes', {
				reason: 'closing',
				confirm: () => applyNavigation(this, path),
				cancel: () => revertHash(this)
			});

		// navigate normally
		else applyNavigation(this, path);
	}

}

// applies navigation changes
function applyNavigation(instance, path) {
	$state.clearProject();

	// update the state
	updateState(instance, path);

	// change the state
	instance.updating = true;
	instance.current = window.location.hash = `#!/${instance.path}`;
	instance.updating = false;

	// update the current routing
	broadcast('navigate', instance.path, instance);
}

// undo a navigation change without performing navigation
function revertHash(instance) {
	instance.updating = true;
	window.location.hash = instance.current;
	instance.updating = false;
}

// tracks the current state
function updateState(instance, path) {
	instance.lastNavigationPath = path;

	// clean up the path
  path = _.trim(path).replace(/^#!/g, '')
		.replace(/^\/|\/$/g, '');

  // update the path info
  instance.path = path;
	instance.segments = _.map(path.split(/\/+/g), _.trim);

  // there ended up not being any segments
	// so use an empty string
  if (!_.some(instance.segments))
		instance.segments = [''];
		
	// track the view
	instance.view = instance.segments[0] || 'home';
}

// share the navigation state
// const $nav = new Nav();
export default new Nav();