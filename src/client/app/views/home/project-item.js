import Component from '../../component';
import { semiRandomColor } from '../../utils/index';

export default class ProjectItem extends Component {

	constructor(data) {
		super({
			template: 'project-item',
			ui: {
				bar: '.bar'
			}
		});

		this.data = data;
		this.refresh();		
	}

	// update the project data
	refresh() {
		const { data } = this;

		// set the helper color
		if (!data.lesson) {
			const backgroundColor = semiRandomColor(data.id);
			this.ui.bar.css({ backgroundColor });
		}

		// populate data
		this.attr('data-id', data.id);
		this.attr('data-type', data.type);
		this.addClass(`type-${data.type}`);
		this.ui.name.text(data.name);
		this.ui.description.text(data.description);
		this.ui.modifiedAt.text(data.modifiedAt);
		this.toggleClassMap({
			'is-lesson': data.lesson,
			'is-new': !data.started && !data.finished,
			'in-progress': !!data.started && !data.finished,
			'is-finished': !!data.finished,
			'is-project': !data.lesson,
		});

	}

}