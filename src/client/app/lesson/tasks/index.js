
import $state from '../../state';
import Component from '../../component';
import TaskItem from './item';

export default class TaskList extends Component {

	constructor(options) {
		super({
			template: 'tasks',
			ui: {
				heading: '.heading',
				items: '.items',
				completed: '.completed',
				total: '.total',
			}
		});

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('slide-changed', this.onSlideChanged);
		this.listen('task-list-updated', this.onTaskUpdate);
		this.listen('toggle-objective-list', this.onToggleObjectiveList);

		// notify the task list was being looked at
		this.ui.heading.on('mouseover', () => {
			this.broadcast('expand-objectives-list');
		});
	}

	onToggleObjectiveList = show => {
		this.toggleClassMap({ 'active': show });
	}

	onActivateProject = () => {
		this.removeClass('active');
	}

	onDeactivateProject = () => {
		this.removeClass('active');
	}

	// update task list results
	onTaskUpdate = tasks => {

		// update totals
		this.ui.total.text(tasks.total);
		this.ui.completed.text(tasks.complete);

		// create the new list
		if (!this.tasks) {

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