
import _ from 'lodash';
import $nav from './nav';
import Component from './component';
import $state from './state'

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

	// // is this the project view
	// get isProjectView() {
	// 	return $nav.segments[0] === 'project'
	// }

	// return to the home view, if not already there
	onLeaveProject = () => {
		$nav.go('/');

		// navigate to the home page


		// this.navigateHome();
		// // already confirming the request
		// if (this.isConfirmingNavigation) return;
		
		// // check for unsaved changes
		// if (this.isProjectView && $state.hasUnsavedFiles()) {

		// 	// wants to make sure they need to navigate
		// 	this.isConfirmingNavigation = true;
		// 	this.broadcast('open-dialog', 'unsaved-changes', {
		// 		reason: 'closing',
		// 		confirm: () => this.navigateHome(),
		// 		cancel: () => this.isConfirmingNavigation = false
		// 	});

		// }
		// // can navigate back
		// else {
		// 	this.navigateHome();
		// }
	}

	// returns to the home screen
	navigateHome = () => {
		// this.isConfirmingNavigation = false;

		// clear project data
		// if (this.isProjectView) {
		// 	this.broadcast('deactivate-project');
		// }
		// other screens?
		// else { }

		// if not already at the home screen, navigate
		if ($nav.segments[0] !== '')
			$nav.go('/');
	}

}