(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

exports.default = createTasks;

var _lib = require('../lib');

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

// handles default tasks
var Task = function () {
	function Task(project, label, options) {
		_classCallCheck(this, Task);

		this.project = project;

		this.label = label;
		this.id = _lib._.uniqueId('task:');
		_lib._.assign(this, options);

		// constructor logic
		if (this.onCreateTask) this.onCreateTask.apply(this);
	}

	// get the current state


	_createClass(Task, [{
		key: 'isValid',
		get: function get() {
			return this.tasks ? _lib._.every(this.tasks, 'isValid')

			// check if this is presently value
			: !!this._valid;
		}

		// toggles and updates

		, set: function set(value) {
			this._valid = value;
			this.project.update();
		}
	}]);

	return Task;
}();

// handles project state


var TaskList = function () {
	function TaskList(options) {
		_classCallCheck(this, TaskList);

		this.options = options;
		this.tasks = [];
		this.root = [];

		// tracking counts
		this.total = 0;
	}

	_createClass(TaskList, [{
		key: 'taskSound',
		value: function taskSound(all) {

			// don't play sounds too fast
			var now = +new Date();
			if ((this._nextAllowed || -1) > now) return;
			this._nextAllowed = now + 1000;

			// play the sound
			this.sound.task(!!all);
		}

		// refreshes state data

	}, {
		key: 'update',
		value: function update(immediate, silent) {
			var _this = this;

			if (this.isLoading) return;

			// tracking state
			if (immediate) {
				var starting = this.completed || 0;
				this.completed = 0;
				this.state = [];

				// creates state for a node
				createState(this.root, this, this.state);

				var data = {
					total: this.total,
					complete: this.completed,
					state: this.state
				};

				var increased = this.completed > starting;
				var done = increased && this.completed === this.total;

				// renewed state
				this.broadcast('task-list-updated', data);

				if (done) {
					if (!silent) this.taskSound(done);
					setTimeout(function () {
						_this.broadcast('task-list-complete', data);
						_this.progress.next();
					});
				} else if (increased) if (!silent) this.taskSound();

				return;
			}

			// queue an update
			this.cancelUpdate();
			this._update = setTimeout(function () {
				return _this.update(true);
			}, 100);
		}
	}, {
		key: 'cancelUpdate',
		value: function cancelUpdate() {
			clearTimeout(this._update);
		}
	}]);

	return TaskList;
}();

// generate state recursively


function createState(tasks, project, node) {
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var task = _step.value;

			var item = {
				id: task.id,
				label: task.label,
				topic: task.topic,
				valid: !!task.isValid,
				count: 1
			};

			// show extra help
			if (task.details) item.details = task.details;

			// add to the completed count
			if (item.valid) project.completed++;

			// save the node item
			node.push(item);

			// count the child tasks
			if (task.tasks) {
				item.tasks = [];
				createState(task.tasks, project, item.tasks);

				// add up each count
				for (var i = 0; i < item.tasks.length; i++) {
					item.count += item.tasks[i].count;
				}
			}
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}
}

// handles creating a new project
function createTasks(obj, options, builder) {
	var project = void 0;

	// returns the current project state
	_lib._.assign(obj, {
		controller: true,
		isTaskList: true,

		// prepares the lesson
		onActivateLesson: function onActivateLesson() {

			// setup the new project
			project = new TaskList(options);
			project.instance = this;
			project.broadcast = this.events.broadcast;
			project.progress = this.progress;
			project.sound = this.sound;

			// handle setting up the work tree
			var stack = [project.root];
			function createTask(label, arg) {
				project.total++;

				// create the new task
				var task = new Task(project, label, arg);
				stack[0].push(task);

				// if the args are a function then
				// it's just a grouping for more tasks
				if (_lib._.isFunction(arg)) {
					task.tasks = [];
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
			project.isLoading = true;
			builder(createTask);
			project.isLoading = false;

			// perform the update
			project.update(true, true);
		},

		// execute an action against all tasks
		invoke: function invoke(action) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			// handle other actions
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = project.tasks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var task = _step2.value;

					if (action in task) {
						try {
							task[action].apply(task, args);
						} catch (ex) {
							task.isValid = false;
						}
					}
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		},
		respondsTo: function respondsTo() {
			return true;
		}

		// // props
		// get state() {
		// 	return project ? project.state : [ ];
		// },

		// get total() {
		// 	return project ? project.total : 0;
		// },

		// get complete() {
		// 	return project ? project.completed : 0;
		// }

	});
}

},{"../lib":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = configure;

var _lib = require('../lib');

function configure(obj, config) {
	_lib._.assign(obj, {

		controller: true,

		onOpenFile: function onOpenFile(file) {

			if (file.path === config.file) {
				this.progress.next();
				return true;
			}
		},
		onEnter: function onEnter() {
			var _this = this;

			this.progress.block();

			this.file.readOnly({ path: config.file });
			this.screen.highlight.fileBrowserItem(config.file);

			// get the actual name
			var name = config.fileName || config.file.split('/').pop();

			// check for content
			if (!config.content) {
				this.assistant.say({
					message: 'Open the file named `' + name + '` by [define double_click double clicking] on it in the [define file_browser File Browser].'
				});
			}

			this.delay(15000, function () {
				_this.assistant.say({
					message: '\n\t\t\t\t\t\tTo open the `' + name + '` file, [define double_click double click] the item in the [define file_browser File Browser].\n\t\t\t\t\t\tTo [define double_click double click], move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.'
				});
			});
		},
		onExit: function onExit() {
			this.screen.highlight.clear();
		}
	}, config.extend);
}

},{"../lib":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = configure;

var _lib = require('../lib');

function configure(obj, config) {
	_lib._.assign(obj, {

		controller: true,

		onChangeTab: function onChangeTab(file) {

			if (file.path === config.file) {
				this.progress.next();
				return true;
			}
		},
		onEnter: function onEnter() {
			var _this = this;

			this.progress.block();

			this.file.readOnly({ path: config.file });
			this.screen.highlight.tab(config.file);

			// get the actual name
			var name = config.file.split('/').pop();

			this.delay(15000, function () {
				_this.assistant.say({
					message: '\n\t\t\t\t\t\tSwitch to the `' + name + '` file by clicking on the highlighted [define codelab_tab tab] in the [define codelab_editor]'
				});
			});
		},
		onExit: function onExit() {
			this.screen.highlight.clear();
		}
	}, config.extend);

	// initialization
	if (obj.init) obj.init(obj);
}

},{"../lib":5}],4:[function(require,module,exports){
'use strict';

var _createClass = function () {
	function defineProperties(target, props) {
		for (var i = 0; i < props.length; i++) {
			var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
		}
	}return function (Constructor, protoProps, staticProps) {
		if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
	};
}();

// import controllers


var _lib = require('./lib');

var _waitForFile = require('./controllers/waitForFile');

var _waitForFile2 = _interopRequireDefault(_waitForFile);

var _waitForTab = require('./controllers/waitForTab');

var _waitForTab2 = _interopRequireDefault(_waitForTab);

var _list = require('./list');

var list = _interopRequireWildcard(_list);

function _interopRequireWildcard(obj) {
	if (obj && obj.__esModule) {
		return obj;
	} else {
		var newObj = {};if (obj != null) {
			for (var key in obj) {
				if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
			}
		}newObj.default = obj;return newObj;
	}
}

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

// lesson controller
var codeProject1Lesson = function () {

	// setup the lesson
	function codeProject1Lesson(project, lesson, api) {
		var _this = this;

		_classCallCheck(this, codeProject1Lesson);

		this.state = {};
		this.lesson = lesson;
		this.project = project;
		this.api = api;

		// core lesson data
		this.data = {
			"name": "Code Project #1",
			"type": "code",
			"description": "Creating a math gradebook on your own!",
			"lesson": [{
				"mode": "overlay",
				"title": "Progress Review #1",
				"content": "In this lesson we will be working on a project that reviews all of the skills that have been covered up to this point.\n"
			}, {
				"content": "This lesson is a _\"Project Lesson\"_ meaning that you will be given a list of **Objectives** to complete. \n\n[image task-list.png frame]\n"
			}, {
				"content": "As you work, the **Objective** list will update to show what items have been finished and which ones are still left to be done.\n\n[image task-done.png frame]\n\nWhen you have completed all items on the **Objectives** list, you will have successfully finished this project!\n"
			}, {
				"content": "The purpose of this project is to ensure that you have mastered all of the skills taught in previous lessons. There will **not** be any assistance or hints provided as you work.\n\n**Please keep in mind that it's entirely possible that you might get stuck!**\n"
			}, {
				"content": "If you find that you can't figure out how to finish this project, go back and retry previous lessons until you're ready to try again.\n\nLearning something new takes practice and sometimes that means going over a topic a few times before you completely understand it!\n"
			}, {
				"controller": "waitForHover",
				"mode": "popup",
				"showObjectiveList": true,
				"highlight": "#header .task-list .heading",
				"content": "The list of **Objectives** is found in the top right corner of the screen.\n\nMove your cursor over the highlighted area to see what must be accomplished before the project is completed.\n"
			}, {
				"highlight": "#header .task-list .heading",
				"content": "There are many objectives that you will need to complete. Some objectives are not visible unless you scroll the list down to see them.\n\nAdditionally, as you finish groups of objectives, they will be automatically collapsed into single items on the list.\n"
			}, {
				"content": "Finally, some objectives have an icon at the far right side. Moving the cursor over this icon will show the related skill.\n\nIf you're stuck this will help identify which lessons you should go back and review.\n"
			}, {
				"flags": "+OPEN-MODE",
				"controller": "list",
				"content": "Alright, it's time to get started!\n\nGood luck! I look forward to seeing what you create!\n"
			}, {
				"showObjectiveList": false,
				"content": "Great work! You've completed all of the objectives!\n\nYou're well on your way to becoming a great computer programmer!\n"
			}],
			"snippets": {},
			"resources": [],
			"definitions": {
				"double_click": {
					"id": "double_click",
					"name": "Double Click",
					"define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."
				},
				"file_browser": {
					"id": "file_browser",
					"name": "File Browser",
					"define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
				}
			}
		};

		// timing
		this._delays = {};
		this._intervals = {};

		// expose API tools
		this.assistant = api.assistant;
		this.events = api.events;
		this.preview = api.preview;
		this.screen = api.screen;
		this.progress = api.progress;
		this.file = api.file;
		this.editor = api.editor;
		this.sound = api.sound;
		this.flags = api.flags;

		// setup controllers
		this.controllers = {};

		// setup each included entry
		var refs = {
			list: list
		};

		// setup each reference
		_lib._.each(refs, function (ref, key) {
			if (ref.controller) {
				_this.controllers[key] = ref;

				// handle resets
				if (ref.onActivateLesson) ref.onActivateLesson.call(_this);
			}
		});

		// debugging
		if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
	}

	// returns the active controller


	_createClass(codeProject1Lesson, [{
		key: 'activateSlide',

		// helpers
		value: function activateSlide(slide) {

			// check for common controller scenarios
			if (slide.waitForFile) {
				slide.controller = _lib._.uniqueId('controller_');
				var controller = this.controllers[slide.controller] = {};
				(0, _waitForFile2.default)(controller, {
					file: slide.waitForFile,
					content: slide.content,
					fileName: slide.fileName
				});
			}

			if (slide.waitForTab) {
				slide.controller = _lib._.uniqueId('controller_');
				var _controller = this.controllers[slide.controller] = {};
				(0, _waitForTab2.default)(_controller, {
					file: slide.waitForTab
				});
			}

			if (slide.onActivate) {
				slide.onActivate.call(this, slide);
			}
		}

		// // leaves a slide
		// deactivateSlide(slide) {

		// }

		// executes an action if available

	}, {
		key: 'invoke',
		value: function invoke(action) {
			var _controller$invoke;

			var controller = this.controller;

			if (!controller) return;

			action = toActionName(action);

			// check the action

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			if (controller.invoke) return (_controller$invoke = controller.invoke).call.apply(_controller$invoke, [this, action].concat(args));else if (controller[action]) return controller[action].apply(this, args);
		}

		// checks if there's an action for this event

	}, {
		key: 'respondsTo',
		value: function respondsTo(action) {
			var controller = this.controller;

			if (!controller) return false;

			action = toActionName(action);

			// tasks lists will handle this themselves
			// it's safe to return true here since there
			// are no gate keepers
			if (controller.respondsTo) return controller.respondsTo(action);

			// perform normally
			return !!controller[action];
		}

		// resets any required information between slides

	}, {
		key: 'clearTimers',
		value: function clearTimers() {
			_lib._.each(this._delays, function (cancel) {
				return cancel();
			});
			_lib._.each(this._intervals, function (cancel) {
				return cancel();
			});
		}

		// resets any required information between slides

	}, {
		key: 'clear',
		value: function clear() {
			this.clearTimers();
		}

		// sets a timed delay

	}, {
		key: 'delay',
		value: function delay(time, action) {
			var _this2 = this;

			var ref = setTimeout(action, time);
			var cancel = this._delays[ref] = function () {
				clearTimeout(ref);
				delete _this2._delays[ref];
			};

			return cancel;
		}

		// sets a timed interval

	}, {
		key: 'interval',
		value: function interval(time, action) {
			var _this3 = this;

			var ref = setInterval(action, time);
			var cancel = this._intervals[ref] = function () {
				clearInterval(ref);
				delete _this3._intervals[ref];
			};

			return cancel;
		}
	}, {
		key: 'controller',
		get: function get() {
			var slide = this.lesson.slide;

			return slide && this.controllers[slide.controller];
		}

		// returns the current slide

	}, {
		key: 'slide',
		get: function get() {
			return this.lesson.slide;
		}
	}]);

	return codeProject1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
	if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
	return name;
}

// register the lesson for use
window.registerLesson('code_project_1', codeProject1Lesson);

},{"./controllers/waitForFile":2,"./controllers/waitForTab":3,"./lib":5,"./list":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var lib = window.__CODELAB_LIBS__;

var _ = exports._ = lib._;
var $ = exports.$ = lib.$;
var CodeValidator = exports.CodeValidator = lib.CodeValidator;
var HtmlValidator = exports.HtmlValidator = lib.HtmlValidator;
var CssValidator = exports.CssValidator = lib.CssValidator;
var createTestRunner = exports.createTestRunner = lib.createTestRunner;
var validateHtmlDocument = exports.validateHtmlDocument = lib.HtmlValidationHelper.validate;

$.preview = function () {
	return $('#preview .output').contents();
};

exports.default = {
	_: _, $: $,
	CodeValidator: CodeValidator,
	HtmlValidator: HtmlValidator,
	CssValidator: CssValidator,
	createTestRunner: createTestRunner,
	validateHtmlDocument: validateHtmlDocument
};

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _taskList = require('./controllers/task-list');

var _taskList2 = _interopRequireDefault(_taskList);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

// import * as tasks from './tasks';

var controller = exports.controller = true;

var flags = {};

var runner = (0, _lib.createTestRunner)();
runner.reset();

runner.configure({

	onConsoleAsk: function onConsoleAsk(message) {

		if (/student/i.test(message)) {
			return 'fred';
		}

		var isScore = /score/i.test(message);

		if (isScore && !flags.asking_for_student_score_1) {
			flags.asking_for_student_score_1 = true;
			return 100;
		} else if (isScore && !flags.asking_for_student_score_2) {
			flags.asking_for_student_score_2 = true;
			return 80;
		} else if (isScore && !flags.asking_for_student_score_3) {
			flags.asking_for_student_score_3 = true;
			return 60;
		} else if (isScore && !flags.asking_for_student_score_4) {
			flags.asking_for_student_score_4 = true;
			return 40;
		} else if (isScore && !flags.asking_for_student_score_5) {
			flags.asking_for_student_score_5 = true;
			return 20;
		}
	},

	onConsoleAlert: function onConsoleAlert(message) {
		console.log('did alert');
	},

	onConsoleLog: function onConsoleLog(message) {
		console.log('did log');
	}

});

var code = '\n\tvar name = console.ask(\'what is student name?\');\n\tvar score1 = console.ask(\'what is score 1?\');\n\tvar score2 = console.ask(\'what is score 2?\');\n\tvar score3 = console.ask(\'what is score 3?\');\n\tvar total = score1 + score2 + score3;\n\tvar avg = total / 3;\n\tconsole.log(total);\n\tconsole.log(avg);\n';
runner.run(code);

console.log(runner);

// // when activating a new 
// export default createTasks(module.exports, {
// 	title: 'Create a product website for "Juice Fruit" smoothie shop!',

// 	goal: `Create a program that asks for a student name and 5 grades. After doing that, get the average of the grades and then use if/then conditions to print A > 90 B > 80`
// }, {

// 	// tests the code
// 	onContentChanged(code) {


// 	}


// }

// // setup the main task
// task => {


// });

},{"./controllers/task-list":1,"./lib":5}]},{},[4]);
