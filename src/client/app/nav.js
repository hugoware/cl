
import { broadcast } from './events';
import _ from 'lodash';

class Nav {

	constructor() {

		/** @type {string[]} a series of url params */
		this.segments = [ ]

		// updateState the view
		window.addEventListener('hashchange', () => {
			if (this.updating) return;
			this.go(window.location.hash);
		});

		// sets the default state
		this.go(window.location.hash);
	}

	/** changes the URL navigation for the app
	 * @param {string} path the new path to navigate to
	 */
	go = path => {

		// check if leaving a project view
		const navToProject = /project\/.+/i.test(path);
		const atProject = /project\/.+/i.test(this.path);
		if (!navToProject && atProject)
			broadcast('deactivate-project');

		// update the state
		updateState(this, path);
		
		// change the state
		this.updating = true;
		window.location.hash = `#!/${this.path}`;
		this.updating = false;

		// update the current routing
		broadcast('navigate', this.path, this);
	}

}


// tracks the current state
function updateState(instance, path) {
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