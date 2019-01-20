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

		// bind text
		this.ui.name.text(data.name);
		this.ui.description.text(data.description);
		this.ui.lesson.text(`Lesson #${data.number}`);
		this.ui.modifiedAt.text(data.modifiedAt);

		const isLesson = !!data.lesson;
		const isDone = !!data.done;
		const isActive = !!data.active;

		// toggle view
		this.toggleClassMap({
			// 'in-progress': !!data.started && !data.finished,
			'is-locked': isLesson && !isActive,
			'is-lesson': isLesson,
			'is-new': !isDone && isActive,
			'is-finished': isDone && isActive,
			'is-project': !isLesson,
		});

	}

}