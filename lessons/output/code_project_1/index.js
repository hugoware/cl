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

	// perform validation


	_createClass(Task, [{
		key: 'validateTasks',
		value: function validateTasks() {
			this.project.validateTasks();
			setTimeout(this.project.update);
		}

		// get the current state

	}, {
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

	// performs a blanket validation


	_createClass(TaskList, [{
		key: 'validateTasks',
		value: function validateTasks() {
			this.instance.invoke('onValidateTasks', this);
		}

		// updates the error state

	}, {
		key: 'setError',
		value: function setError(ex) {
			this.ex = ex;
			this.update(true);
		}
	}, {
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
					state: this.state,
					ex: this.ex
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
			this.taskList = project;
			project.instance = this;
			project.broadcast = this.events.broadcast;
			project.progress = this.progress;
			project.sound = this.sound;
			project.event = this.event;

			// renewed state
			project.broadcast('task-list-created', options);

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
			var _this2 = this;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			var sources = [options.events].concat(project.tasks);
			_lib._.each(sources, function (item, index) {
				if (!item) return;

				if (action in item) {
					try {
						item[action].apply(index === 0 ? _this2.taskList : item, args);
					} catch (ex) {
						item.isValid = false;
					}
				}
			});
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

},{"../lib":7}],2:[function(require,module,exports){
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

},{"../lib":7}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = configure;

var _lib = require('../lib');

function configure(obj, config) {

	_lib._.assign(obj, {

		controller: true,

		onEnter: function onEnter() {
			var _this = this;

			this.progress.block();

			var waiting = this.events.listen('expand-objectives-list', function () {
				_this.progress.next();
				_this.events.clear();
			});
		},
		onExit: function onExit() {
			this.events.clear();
		}
	});
}

},{"../lib":7}],4:[function(require,module,exports){
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

},{"../lib":7}],5:[function(require,module,exports){
"use strict";

},{}],6:[function(require,module,exports){
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

var _waitForObjectivesList = require('./controllers/waitForObjectivesList');

var _waitForObjectivesList2 = _interopRequireDefault(_waitForObjectivesList);

var _executionTests = require('./executionTests');

var executionTests = _interopRequireWildcard(_executionTests);

var _list = require('./list');

var list = _interopRequireWildcard(_list);

var _validationTests = require('./validationTests');

var validationTests = _interopRequireWildcard(_validationTests);

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
			"description": "Creating a student grade calculator on your own!",
			"lesson": [{
				"mode": "overlay",
				"title": "Progress Review #1",
				"content": "In this lesson we will be working on a project that reviews all of the skills that have been covered up to this point.\n"
			}, {
				"content": "This lesson is a _\"Project Lesson\"_ meaning that you will be given a goal to accomplish. How you get it done is up to you.\n\n[image task-list.png frame]\n\nYou will be provided a list of **Objectives** that will be used to check if your code behaves the way that it should.\n"
			}, {
				"content": "As you work, the **Objective** list will update to show what items have been finished and which ones are still left to be done.\n\n[image task-done.png frame]\n\nWhen you have completed all items on the **Objectives** list, you will have successfully finished this project!\n"
			}, {
				"content": "The purpose of this project is to ensure that you have mastered all of the skills taught in previous lessons. There will **not** be any assistance or hints provided as you work.\n\n**Please keep in mind that it's entirely possible that you might get stuck!**\n"
			}, {
				"content": "If you find that you can't figure out how to finish this project, go back and retry previous lessons until you're ready to try again.\n\nLearning something new takes practice and sometimes that means going over a topic a few times before you completely understand it!\n"
			}, {
				"mode": "popup",
				"waitForObjectivesList": true,
				"showObjectiveList": true,
				"highlight": "#header .task-list .heading",
				"content": "The list of **Objectives** is found in the top right corner of the screen.\n\nMove your cursor over the highlighted area to see what must be accomplished before the project is completed.\n"
			}, {
				"highlight": "#header .task-list .heading",
				"content": "There are many objectives that you will need to complete. Some objectives are not visible unless you scroll the list down to see them.\n\nAdditionally, as you finish groups of objectives, they will be automatically collapsed into single items on the list.\n"
			}, {
				"content": "Finally, some objectives have an icon at the far right side. Moving the cursor over this icon will show the related skill.\n\nIf you're stuck this will help identify which lessons you should go back and review.\n"
			}, {
				"mode": "popup",
				"showObjectiveList": true,
				"flags": "+OPEN-MODE",
				"controller": "list",
				"content": "Alright, it's time to get started!\n\nGood luck! I look forward to seeing what you create!\n"
			}, {
				"showObjectiveList": false,
				"content": "Great work! You've completed all of the objectives!\n\nYou're well on your way to becoming a great computer programmer!\n"
			}],
			"snippets": {},
			"resources": [{
				"width": 1300,
				"height": 600,
				"type": "png",
				"path": "task-done.png"
			}, {
				"width": 1300,
				"height": 600,
				"type": "png",
				"path": "task-list.png"
			}],
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
			executionTests: executionTests, list: list, validationTests: validationTests
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

			if (slide.waitForObjectivesList) {
				slide.controller = _lib._.uniqueId('controller_');
				var _controller2 = this.controllers[slide.controller] = {};
				(0, _waitForObjectivesList2.default)(_controller2, {});
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

},{"./controllers/waitForFile":2,"./controllers/waitForObjectivesList":3,"./controllers/waitForTab":4,"./executionTests":5,"./lib":7,"./list":8,"./validationTests":10}],7:[function(require,module,exports){
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
var runTests = exports.runTests = lib.runTests;

$.preview = function () {
	return $('#preview .output').contents();
};

exports.default = {
	_: _, $: $,
	CodeValidator: CodeValidator,
	HtmlValidator: HtmlValidator,
	CssValidator: CssValidator,
	createTestRunner: createTestRunner,
	runTests: runTests,
	validateHtmlDocument: validateHtmlDocument
};

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lib = require('./lib');

var _taskList = require('./controllers/task-list');

var _taskList2 = _interopRequireDefault(_taskList);

var _validationTests = require('./validationTests');

var _validationTests2 = _interopRequireDefault(_validationTests);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

// when activating a new 
exports.default = (0, _taskList2.default)(module.exports, {
	title: 'Create a Student Grade Calculator',

	goal: 'Use `console.ask` to get the **student\'s name** and **five individual scores**. Calculate the **student\'s average score** using each of the scores provided.\n\nNext, use `console.log` to print the **student\'s name**, the **average**, and then call `showGrade` to display the **student\'s grade**.\n\nFinally, create a function called `showGrade` that accepts a `score` argument and then prints a grade using the following table.\n\n### Grading Table\n\n| Score                       \t\t\t\t\t\t| Grade |\n|=========================================|=======|\n| `score` greater than or equal to 100  | A+    |\n| `score` greater than or equal to 90   | A     |\n| `score` greater than or equal to 80   | B     |\n| `score` greater than or equal to 70   | C     |\n| `score` less than 70\t\t\t\t\t\t\t\t  | F     |\n\n',

	events: {

		// perform 
		onContentChange: function onContentChange(file) {
			var _this = this;

			delete this.ex;

			// only checking for main.js
			if (file.path !== '/main.js') return;

			// check the content
			(0, _validationTests2.default)(file, function (err, result) {
				_this.state = result;

				if (!err && !result.hasException) _this.validateTasks();

				// set the error
				else _this.setError(err || result.ex || result.exception || result.error || result.err);
			});
		}
	}

},

// setup the main task
function (task) {

	task('Create a `showGrade` function', function () {

		task('Declare a function `showGrade`', {
			topic: 'Functions',
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.hasShowGradeFunction;
			}
		});

		task('Accept a single argument named `score`', {
			topic: 'Functions',
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.showGradeArgumentCount === 1;
			}
		});

		task('Use `console.log` to show results for `score`', function () {

			task('Log `A++` if `score` greater than or equal to `100', {
				topic: 'Logical Conditions',
				onValidateTasks: function onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeAPlusPlus;
				}
			});

			task('Log `A` if `score` greater than or equal to `90', {
				topic: 'Logical Conditions',
				onValidateTasks: function onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeA;
				}
			});

			task('Log `B` if `score` greater than or equal to `80', {
				topic: 'Logical Conditions',
				onValidateTasks: function onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeB;
				}
			});

			task('Log `C` if `score` greater than or equal to `70', {
				topic: 'Logical Conditions',
				onValidateTasks: function onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeC;
				}
			});

			task('Log `F` if `score` for all other values', {
				topic: 'Logical Conditions',
				onValidateTasks: function onValidateTasks() {
					this.isValid = this.project.state.didDisplayGradeF;
				}
			});
		});
	});

	task('Collect Student Information', function () {

		task('Use `console.ask` to ask for the "student name"', {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didAskForName;
			}
		});

		task('Use `console.ask` to ask for "score 1"', {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didAskForScore1;
			}
		});

		task('Use `console.ask` to ask for "score 2"', {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didAskForScore2;
			}
		});

		task('Use `console.ask` to ask for "score 3"', {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didAskForScore3;
			}
		});

		task('Use `console.ask` to ask for "score 4"', {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didAskForScore4;
			}
		});

		task('Use `console.ask` to ask for "score 5"', {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didAskForScore5;
			}
		});
	});

	task('Print Student Information', function () {

		task("Use `console.log` to print the student\'s name", {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didPrintStudentName;
			}
		});

		task("Use `console.log` to print the student's average", {
			onValidateTasks: function onValidateTasks() {
				this.isValid = this.project.state.didPrintAverage;
			}
		});
	});

	task("Use `showGrade` function with the student's average", {
		topic: 'Functions',
		onValidateTasks: function onValidateTasks() {
			this.isValid = this.project.state.didPrintGrade;
		}
	});
});

},{"./controllers/task-list":1,"./lib":7,"./validationTests":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.randomString = randomString;
exports.randomNumber = randomNumber;
exports.findBoundary = findBoundary;
exports.simplify = simplify;
exports.stringRange = stringRange;
exports.oxfordize = oxfordize;
exports.pluralize = pluralize;
exports.similarity = similarity;

var _lib = require('./lib');

var CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var TOTAL_CHARACTERS = CHARACTERS.length;
function randomString() {
	var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
	var prefix = arguments[1];

	var result = '';
	for (var i = 0; i < length; i++) {
		result += CHARACTERS.charAt(Math.floor(Math.random() * TOTAL_CHARACTERS));
	}
	return (prefix || '') + result;
}

function randomNumber() {
	var min = void 0;
	var max = void 0;

	if (arguments.length === 1) {
		min = 0;
		max = arguments.length <= 0 ? undefined : arguments[0];
	} else {
		min = arguments.length <= 0 ? undefined : arguments[0];
		max = arguments.length <= 1 ? undefined : arguments[1];
	}

	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// finds a trimmed code boundary
function findBoundary(code, options) {
	var index = void 0;

	// literal match
	if (_lib._.isString(options.expression)) index = code.indexOf(options.expression);

	// regular expression
	else if (_lib._.isRegExp(options.expression)) {
			var match = options.expression.exec(code);
			index = match ? match.index : -1;
		}
		// just a number
		else if (_lib._.isNumber(options.index)) {
				index = options.index;
			}

	// trim at the first newline
	var trim = 0;
	if (!!options.trimToLine) {

		while (true) {
			var char = code.charAt(index - ++trim);

			// whitespace, we can continue
			if (char === ' ' || char === '\t') continue;

			// if it's a newline, apply it
			if (char !== '\n') trim = 0;

			break;
		}
	}

	// // check for trimming
	// if (options.trim !== false) {
	// 	const range = _.trimEnd(code.substr(0, index));
	// 	index = range.length;
	// }

	if (isNaN(index)) console.warn('find boundary: NaN');

	// return the final value
	return Math.max(-1, index - trim);
}

// creates a text/numeric only representation for a strin
function simplify(str) {
	return (str || '').toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
}

// checks for range messages
function stringRange(value, min, max, asSingular, asPlural) {
	var num = !value ? 0 : _lib._.isNumber(value.length) ? value.length : value;

	if (num < min) {
		var diff = min - num;
		return 'Expected ' + diff + ' more ' + (diff > 1 ? asPlural : asSingular);
	} else if (num > max) {
		var _diff = num - max;
		return 'Expected ' + _diff + ' fewer ' + (_diff > 1 ? asPlural : asSingular);
	}
}

// performs the oxford comma
function oxfordize(items, conjunction) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	var total = items.length;
	if (!options.asLiteral) items = _lib._.map(items, function (item) {
		return "`" + item.replace("`", '\\`') + "`";
	});

	// determine the best
	if (total === 1) return items.join('');else if (total == 2) return items.join(' ' + conjunction + ' ');

	// return the result
	else {
			var last = items.pop();
			return items.join(', ') + ', ' + conjunction + ' ' + last;
		}
}

// pluralizes a word
function pluralize(value, single, plural, none) {
	plural = plural || single + 's';
	none = none || plural;

	if (value === null || value === undefined) value = 0;
	if (!isNaN(value.length)) value = value.length;
	value = Math.abs(value);

	return value === 0 ? none : value === 1 ? single : plural;
}

// checks for string similarity
function similarity(s1, s2) {
	var longer = s1;
	var shorter = s2;
	if (s1.length < s2.length) {
		longer = s2;
		shorter = s1;
	}
	var longerLength = longer.length;
	if (longerLength == 0) {
		return 1.0;
	}
	return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
	s1 = s1.toLowerCase();
	s2 = s2.toLowerCase();

	var costs = new Array();
	for (var i = 0; i <= s1.length; i++) {
		var lastValue = i;
		for (var j = 0; j <= s2.length; j++) {
			if (i == 0) costs[j] = j;else {
				if (j > 0) {
					var newValue = costs[j - 1];
					if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
					costs[j - 1] = lastValue;
					lastValue = newValue;
				}
			}
		}
		if (i > 0) costs[s2.length] = lastValue;
	}
	return costs[s2.length];
}

},{"./lib":7}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = execute;

var _lib = require('./lib');

var _utils = require('./utils');

function execute(file, callback) {

	// setup the return result
	var result = {
		scoreRequests: 0
	};

	var state = {};

	var studentName = (0, _utils.randomString)(10);
	var scoreValues = [(0, _utils.randomNumber)(25, 100), (0, _utils.randomNumber)(25, 100), (0, _utils.randomNumber)(25, 100), (0, _utils.randomNumber)(25, 100), (0, _utils.randomNumber)(25, 100)];

	var scoreAverage = (scoreValues[0] + scoreValues[1] + scoreValues[2] + scoreValues[3] + scoreValues[4]) / 5;

	var expectedGrade = scoreAverage >= 100 ? 'A++' : scoreAverage >= 90 ? 'A' : scoreAverage >= 80 ? 'B' : scoreAverage >= 70 ? 'C' : 'F';

	(0, _lib.runTests)({
		file: file,

		// setup the run state
		onInit: function onInit(runner) {
			var showGradeKey = (0, _utils.randomString)(10, '__showGrade__');

			runner.inject += '\n\n\t\t\t\t// required before testing functions\n\t\t\t\tvar hasFunction = !/null|undefined/i.test(typeof showGrade);\n\t\t\t\t' + runner.key + '({ hasShowGradeFunction: hasFunction });\n\n\t\t\t\tif (hasFunction) {\n\t\t\t\t\t' + runner.key + '({ showGradeArgumentCount: showGrade.length });\n\n\t\t\t\t\t// replace the function\n\t\t\t\t\tvar ' + showGradeKey + ' = showGrade;\n\t\t\t\t\tshowGrade = function(arg1) {\n\t\t\t\t\t\t' + runner.key + '({ showGradeArg1: arg1 });\n\t\t\t\t\t\t' + showGradeKey + '.apply(null, arguments);\n\t\t\t\t\t}\n\n\t\t\t\t\t' + runner.key + '({ isExpectingGrade: \'A++\' });\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 100 });\n\t\t\t\t\tshowGrade(100);\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 101 });\n\t\t\t\t\tshowGrade(101);\n\n\t\t\t\t\t' + runner.key + '({ isExpectingGrade: \'A\' });\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 90 });\n\t\t\t\t\tshowGrade(90);\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 91 });\n\t\t\t\t\tshowGrade(91);\n\n\t\t\t\t\t' + runner.key + '({ isExpectingGrade: \'B\' });\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 80 });\n\t\t\t\t\tshowGrade(80);\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 81 });\n\t\t\t\t\tshowGrade(81);\n\n\t\t\t\t\t' + runner.key + '({ isExpectingGrade: \'C\' });\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 70 });\n\t\t\t\t\tshowGrade(70);\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 71 });\n\t\t\t\t\tshowGrade(71);\n\n\t\t\t\t\t' + runner.key + '({ isExpectingGrade: \'F\' });\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: 69 });\n\t\t\t\t\tshowGrade(69);\n\t\t\t\t\t' + runner.key + '({ showGradePassedArg1: -100 });\n\t\t\t\t\tshowGrade(-100);\n\n\t\t\t\t\t' + runner.key + '({ isExpectingGrade: false });\n\t\t\t\t}\n\n\t\t\t';
		},
		onError: function onError(runner, ex) {
			callback(ex, {});
		},
		onDone: function onDone(runner) {
			result.hasShowGradeFunction = state.hasShowGradeFunction;
			result.showGradeFunction = state.showGradeFunction;
			result.showGradeArgumentCount = state.showGradeArgumentCount;
			callback(null, result);
		},

		tests: [

			// // make sure there's a function 
			// function(runner) {
			// }

		],

		// setup the configuration
		config: {

			onError: function onError(ex) {
				result.hasException = true;
				result.exception = ex;
			},

			// update state info
			onSyncState: function onSyncState(update) {
				_lib._.assign(state, update);
			},

			// watching for questions
			onConsoleAsk: function onConsoleAsk(message) {

				// looking for a name
				if (/name/i.test(message)) {
					result.didAskForName = true;
					return studentName;
				}

				// looking for a score
				if (/score/.test(message)) {
					var num = 0 | message.replace(/[^0-9]/g, '');
					result['didAskForScore' + num] = true;
					return scoreValues[num - 1];
				}
			},

			// handle alerts
			onConsoleAlert: function onConsoleAlert(message) {},

			// check for printing results
			onConsoleLog: function onConsoleLog(message) {

				// check if printing grades
				if (state.isExpectingGrade) {
					var propToCheck = state.isExpectingGrade === 'A++' ? 'didDisplayGradeAPlusPlus' : state.isExpectingGrade === 'A' ? 'didDisplayGradeA' : state.isExpectingGrade === 'B' ? 'didDisplayGradeB' : state.isExpectingGrade === 'C' ? 'didDisplayGradeC' : state.isExpectingGrade === 'F' ? 'didDisplayGradeF' : null;

					// checking props
					if (propToCheck && (!(propToCheck in result) || result[propToCheck] === true)) {
						result[propToCheck] = message === state.isExpectingGrade && state.showGradePassedArg1 === state.showGradeArg1;
					}
				}

				// score must match
				if (scoreAverage === message || (0 | message) === (0 | scoreAverage)) result.didPrintAverage = true;

				// did use the correct one
				if (message === expectedGrade) {
					result.didPrintGrade = true;
				}

				if (message === studentName) result.didPrintStudentName = true;
			}

		}

	});
}

},{"./lib":7,"./utils":9}]},{},[6]);
