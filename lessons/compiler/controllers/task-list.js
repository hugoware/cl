import { $, _ } from '../lib';

// handles default tasks
class Task {

	constructor(project, label, options) {
		this.project = project;

		this.label = label;
		this.id = _.uniqueId('task:');
		_.assign(this, options);
	}

	// get the current state
	get isValid() {
		return this.tasks
			? _.every(this.tasks, 'isValid')

			// check if this is presently value
			: !!this._valid;
	}

	// toggles and updates
	set isValid(value) {
		this._valid = value;
		this.project.update();
	}

}


// handles project state
class TaskList {

	constructor(options) {
		this.options = options;
		this.tasks = [ ];
		this.root = [ ];

		// tracking counts
		this.total = 0;

	}

	// refreshes state data
	update(immediate) {

		// tracking state
		if (immediate) {
			this.completed = 0;
			this.state = [ ];

			// creates state for a node
			createState(this.root, this, this.state);
			
			// renewed state
			this.broadcast('task-list-updated', {
				total: this.total,
				complete: this.completed,
				state: this.state
			});

			return;
		}

		// queue an update
		clearTimeout(this._update);
		this._update = setTimeout(() => this.update(true), 100);
	}

}


// generate state recursively
function createState(tasks, project, node) {
	for (const task of tasks) {
		const item = {
			id: task.id,
			label: task.label,
			valid: !!task.isValid,
			count: 1,
		};

		// show extra help
		if (task.details)
			item.details = task.details;

		// add to the completed count
		if (item.valid)
			project.completed++;

		// save the node item
		node.push(item);

		// count the child tasks
		if (task.tasks) {
			item.tasks = [ ];
			createState(task.tasks, project, item.tasks);

			// add up each count
			for (let i = 0; i < item.tasks.length; i++)
				item.count += item.tasks[i].count;
		}

	}
}


// handles creating a new project
export default function createTasks(obj, options, builder) {
	const project = new TaskList(options);

	// handle setting up the work tree
	const stack = [ project.root ];
	const createTask = (label, arg) => {
		project.total++;

		// create the new task
		const task = new Task(project, label, arg);
		stack[0].push(task);
		
		// if the args are a function then
		// it's just a grouping for more tasks
		if (_.isFunction(arg)) {
			task.tasks = [ ];
			stack.unshift(task.tasks);
			arg();

			// remove project task from the stack
			stack.shift();
		}
		// it's an actual task that does something
		else {
			project.tasks.push(task);
		}

	}


	// setup tasks
	builder(createTask);

	// returns the current project state
	_.assign(obj, {
		controller: true,
		taskList: true,

		// execute an action against all tasks
		invoke(action, ...args) {

			// if entering
			if (action === 'onEnter' && !project.broadcast) {
				project.instance = this;
				project.broadcast = this.events.broadcast;
				project.update(true);
			}

			// handle other actions
			for (const task of project.tasks) {
				if (action in task) {
					try  {
						task[action].apply(task, args);
					}
					catch (ex) {
						task.isValid = false;
					}
				}
			}
		},

		respondsTo() {
			return true;
		},

		// props
		get state() {
			return project.state;
		},

		get total() {
			return project.total;
		},

		get complete() {
			return project.complete;
		}

	})




}


// // handles overall project controller state
// export default class TaskList {

// 	// creates a new project
// 	constructor(options, builder) {
		

// 	}

// 	// notifies the project tree should update
// 	update() {
// 		clearTimeout(this._update);
// 		this._update = setTimeout(() => {

// 		}, 100);
// 	}


// }




