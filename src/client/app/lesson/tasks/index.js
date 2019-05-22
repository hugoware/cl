
import { Showdown } from '../../lib';
import $state from '../../state';
import Component from '../../component';
import TaskItem from './item';

// create the markdown converter
const $converter = new Showdown.Converter({ tables: true });

export default class TaskList extends Component {

	constructor(options) {
		super({
			template: 'tasks',
			ui: {
				heading: '.heading',
				list: '.list',
				items: '.items',
				completed: '.completed',
				goal: '.goal',
				total: '.total',
				error: '.error .ex',

				highWaterMark: '#task-list-high-water-mark'
			}
		});

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onDeactivateProject);
		this.listen('slide-changed', this.onSlideChanged);
		this.listen('task-list-created', this.onTaskListCreated);
		this.listen('task-list-updated', this.onTaskUpdate);
		this.listen('toggle-objective-list', this.onToggleObjectiveList);

		// notify the task list was being looked at
		this.ui.heading.on('mouseover', () => {
			matchListSize(this);
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
		delete this.tasks;
	}

	// handled when created for the first time
	onTaskListCreated = data => {
		const hasGoal = 'goal' in data;
		
		// update the UI
		this.toggleClassMap({
			'has-goal': hasGoal
		});

		// update fields
		if (hasGoal) {
			const markup = $converter.makeHtml(data.goal);
			this.ui.goal.html(markup);
		}
		
	}

	// update task list results
	onTaskUpdate = tasks => {
		
		this.toggleClassMap({
			'has-error': !!tasks.ex
		});
		
		// update totals
		this.ui.total.text(tasks.total);
		this.ui.completed.text(tasks.complete);

		// update the error, if any
		if (tasks.ex)
			this.ui.error.text(tasks.ex.message || tasks.ex.toString());

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

function matchListSize(instance) {
	const assistant = Component.select('#assistant');
	const panel = assistant.find('.panel');
	const relativeTo = assistant.is('.hide-assistant')
		? { top: window.innerHeight - 100 }
		: panel[0].getBoundingClientRect();

	const highWaterMark = instance.ui.highWaterMark[0].getBoundingClientRect();
	const height = relativeTo.top - highWaterMark.bottom;
	instance.ui.list.css({ maxHeight: `${height}px` });
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