
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

	onLeaveProject = () => {
		this.broadcast('deactivate-project');
		$nav.go('/');
	}	

}