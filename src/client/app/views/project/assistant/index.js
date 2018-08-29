
import $state from '../../../state';
import Component from '../../../component';

export default class Assistant extends Component {

	constructor() {
		super({
			template: 'assistant',

			ui: {
				assistant: '.assistant',
				dialog: '.dialog',
			}
		});

		// this is attached 
		this.listen('clear-project', this.onClearProject);
		this.listen('activate-project', this.onActivateProject);

		this.on('click', () => {
			const mode = this.is('.overlay') ? 'corner' : 'overlay';
			this.setMode(mode);
		});

	}

	onClearProject = () => {
		this.hide();
	}

	/** sets the display mode */
	setMode = mode => {
		const isOverlay = mode === 'overlay';
		const isPopUp = !isOverlay;
		this.toggleClassMap({
			'popup': isPopUp,
			'overlay': isOverlay
		})
	}

	// activates
	onActivateProject = () => {

		// test if there's a lesson to display
		const hasLesson = !!$state.lesson;
		this.toggleClass('active', hasLesson);
		if (!hasLesson) return;

		// since there's a lesson, set current state info
		this.show();

	}

}
