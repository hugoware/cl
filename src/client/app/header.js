
import _ from 'lodash';
import $nav from './nav';
import Component from "./component";

export default class Header extends Component {

	// creates the new header
	constructor(config) {
		_.assign(config, {

			ui: {
				logo: '.logo'
			}
		});

		// load the component
		super(config);

		this.ui.logo.on('click', this.onLeaveProject);

	}

	onLeaveProject = () => {
		this.broadcast('deactivate-project');
		$nav.go('/');
	}

}