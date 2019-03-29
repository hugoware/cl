
import $state from '../../state';
import Component from '../../component';
import TaskItem from './item';

export default class TaskList extends Component {

	constructor(options) {
		super({
			template: 'tasks',
			ui: {
				items: '.items',
				completed: '.completed',
				total: '.total',
			}
		});

		// events
		this.listen('slide-changed', this.onSlideChanged);
		this.listen('task-list-updated', this.onTaskUpdate);
	}

	onDeactivateProject = () => {
		this.removeClass('active');
	}

	// update task list results
	onTaskUpdate = tasks => {
		console.log('up', tasks);

		// update totals
		this.ui.total.text(tasks.total);
		this.ui.completed.text(tasks.complete);

		// create the new list
		if (!this.tasks) {
			this.show();

			// create the task list
			this.tasks = { };
			this.ui.items.empty();
			createList(this, this.ui.items, tasks.state);
		}
		// update the existing
		else {
			updateList(this, tasks.state);
		}

	}


	// handle changing slides
	onSlideChanged = () => {
		this.tasks = undefined;

		// hide all tasks
		if ($state.lesson.isTaskList) {
			this.hide();
		}
	}

}


// refresh list items
function updateList(instance, tasks) {
	for (const task of tasks) {
		const item = instance.tasks[task.id];
		item.toggleClassMap({
			'complete': !!task.valid
		});

		// create each child task
		if (task.tasks)
			updateList(instance, task.tasks);
	}
}


// generates the list of tasks
function createList(instance, target, tasks, depth = 0) {
	for (const task of tasks) {

		// create and add the task
		const item = new TaskItem(task);
		item.addClass(`task-depth-${depth}`);
		item.appendTo(target);
		
		// save the reference
		instance.tasks[task.id] = item;

		// create each child task
		if (task.tasks)
			createList(instance, item.items, task.tasks, depth + 1);
	}
}