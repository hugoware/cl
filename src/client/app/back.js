
import _ from 'lodash';
import $nav from './nav';
import Component from './component';

export default class BackButton extends Component {

	// creates the new header
	constructor(config) {
		_.assign(config, {

			ui: {
				logo: '.logo',
				back: '.back-to-projects',
			}
		});

		// load the component
		super(config);

		this.on('click', this.onLeaveProject);
	}

	// return to the home view, if not already there
	onLeaveProject = () => {

		// clear project data
		if ($nav.segments[0] === 'project') {
			this.broadcast('deactivate-project');
		}
		// other screens?
		// else { }

		// if not already at the home screen, navigate
		if ($nav.segments[0] !== '')
			$nav.go('/');

	}	

}