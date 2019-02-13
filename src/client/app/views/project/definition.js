
import { _ } from '../../lib';
import $state from '../../state';
import Component from '../../component';

export default class DefinitionPopUp extends Component {

	constructor(assistant) {
		super({
			template: 'definition-popup',

			ui: {
				name: '.name',
				aka: '.aka span',
				define: '.define'
			}
		});

		// handle events for moving over the definitions
		this.assistant = assistant;
		this.assistant.on('mouseover', '.define', this.onShow);
		this.assistant.on('mouseout', '.define', this.onHide);
		this.listen('activate-project', this.onHide);
		this.listen('deactivate-project', this.onHide);

		// update the position as required
		this.listen('window-resize', this.matchPosition);
	}

	// match the position on the screen
	matchPosition = () => {
		if (!this.target) return;

		// get the position
		const target = this.target.getBoundingClientRect();

		// get aligned
		this.$.offset({
			left: 0|((target.left + target.right) / 2),
			top: target.top
		});
	}

	// handles displaying the view
	onShow = event => {
		const { target } = event;
		const type = target.getAttribute('type');
		const definition = $state.lesson.definitions[type];

		// make sure something was found
		if (!definition)
			return console.warn(`missing definition: ${type}`);

		// update the content
		this.ui.name.text(definition.name);
		this.ui.aka.text(definition.aka);
		this.ui.define.html(definition.define);

		// set some class info, as required
		this.toggleClassMap({
			show: true,
			'has-aka': !!_.trim(definition.aka)
		});

		// set this as active
		this.target = target;
		this.matchPosition();
	}

	// hides the view
	onHide = () => {
		this.removeClass('show');
		this.target = null;
	}

}
