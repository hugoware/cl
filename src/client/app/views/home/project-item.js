import Component from '../../component';
import { semiRandomColor } from '../../utils/index';

export default class ProjectItem extends Component {

	constructor(data, previous) {
		super({
			template: 'project-item',
			ui: {
				bar: '.bar',
				requirements: '.requirements',
			}
		});

		this.previous = previous;
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

		// check for a lesson to activate
		if (data.lesson)
			this.attr('data-lesson', data.lesson);

		// bind text
		this.ui.name.text(data.name);
		this.ui.description.text(data.description);
		this.ui.lesson.text(`Lesson #${data.number}`);
		this.ui.modifiedAt.text(data.modifiedAt);

		const isPlaceholder = !data.id;
		const isLesson = !!data.lesson;
		const isDone = !!data.done;
		const isCompleted = !!data.completed;
		const isActive = !data.isPreview;
		const isLocked = !isActive;

		// replace the locked message
		if (isLocked && this.previous) {
			const html = `Complete the lesson <strong>${this.previous.name}</strong> to unlock`;
			this.ui.requirements.html(html);
		}

		// toggle view
		this.toggleClassMap({
			// 'in-progress': !!data.started && !data.finished,
			'is-placeholder': isPlaceholder,
			'is-redo': isCompleted && !isDone,
			'is-locked': isLocked,
			'is-lesson': isLesson,
			'is-new': !isCompleted && isActive,
			'is-finished': isDone && isActive,
			'is-project': !isLesson,
		});

	}

}