import { _ } from '../../lib';
import Component from '../../component';
import generateMessage from '../../message-generator/index';


export default class Task extends Component {

	constructor(task) {
		super({
			template: 'task-item',

			ui: {
				label: '.label',
				details: '.details .content',
				topic: '.topic .content',
				items: '.items',
				count: '.count .value',
			}
		});

		this.task = task;

		// save the label info
		const message = generateMessage(task.label);
		this.ui.label.html(message.content);
		this.ui.count.text(task.count);

		// if there's a description
		if (task.details) {
			this.addClass('has-details');
			const message = generateMessage(task.details);
			this.ui.details.html(message.content);
		}

		// if there's a topic
		if (task.topic) {
			this.addClass('has-topic');
			this.ui.topic.text(task.topic);
		}

		// check for sub tasks
		this.toggleClass('has-tasks', _.some(task.tasks));

	}

	// refresh the task
	update(data) {
		this.toggleClass('done', data.valid);
	}

	get items() {
		return this.ui.items;
	}

}