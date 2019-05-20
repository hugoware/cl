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

},{"../lib":6}],2:[function(require,module,exports){
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

},{"../lib":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	var _this = this;

	this.progress.block();

	var waiting = this.events.listen('expand-objectives-list', function () {
		_this.progress.next();
		_this.events.clear();
	});
}

function onExit() {
	this.events.clear();
}

},{}],4:[function(require,module,exports){
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

},{"../lib":6}],5:[function(require,module,exports){
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

var _list = require('./list');

var list = _interopRequireWildcard(_list);

var _tasks = require('./tasks');

var tasks = _interopRequireWildcard(_tasks);

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
var webProject1Lesson = function () {

	// setup the lesson
	function webProject1Lesson(project, lesson, api) {
		var _this = this;

		_classCallCheck(this, webProject1Lesson);

		this.state = {};
		this.lesson = lesson;
		this.project = project;
		this.api = api;

		// core lesson data
		this.data = {
			"name": "Progress Review #1",
			"type": "web",
			"description": "Creating a basic website all on your own!",
			"isProject": true,
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
				"height": 462,
				"type": "png",
				"path": "task-done.png"
			}, {
				"width": 1300,
				"height": 462,
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
			list: list, tasks: tasks
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


	_createClass(webProject1Lesson, [{
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

	return webProject1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
	if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
	return name;
}

// register the lesson for use
window.registerLesson('web_project_1', webProject1Lesson);

},{"./controllers/waitForFile":2,"./controllers/waitForObjectivesList":3,"./controllers/waitForTab":4,"./lib":6,"./list":7,"./tasks":8}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _taskList = require('./controllers/task-list');

var _taskList2 = _interopRequireDefault(_taskList);

var _tasks = require('./tasks');

var tasks = _interopRequireWildcard(_tasks);

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

var controller = exports.controller = true;

// when activating a new 
exports.default = (0, _taskList2.default)(module.exports, {
	title: 'Create a product website for "Juice Fruit" smoothie shop!'
},

// setup the main task
function (task) {

	task('Create an `index.html` page', function () {

		task('Use the **Create new file** button to add `index.html`', {
			onCreateFile: tasks.checkNewFile('/index.html', true),
			onUploadFile: tasks.checkNewFile('/index.html', false),
			onRemoveItems: tasks.checkRemoveFile('/index.html')
		});

		task('Add a title to `index.html`', function () {

			task('Create the `title` Element', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'head > title'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Enter the title "Juice Fruit Smoothies"', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'head > title', { match: 'juice fruit smoothies' }),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});
		});

		task('Add the `/logo.png` image to `/index.html` ', function () {

			task('Create an `img` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Set the `src` attribute to `/logo.png', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
				onUpdatePreviewArea: function onUpdatePreviewArea(url, html, preview) {
					if (url !== '/index.html') return;
					this.isValid = preview.find('body > img[src="/logo.png"]').length === 1;
				}
			});
		});

		task('Add a heading to `index.html`', function () {

			task('Create a `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Place the `h1` Element after the `img` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > img', 'body > h1')
			});

			task('Enter a welcome message at least 10 characters long', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > h1', { min: 10 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});
		});

		task('Add a paragraph to `index.html`', function () {

			task('Create a `p` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Place the `p` Element after the `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > h1', 'body > p')
			});

			task('Enter a store description at least 15 characters long', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > p', { min: 15 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});
		});

		function createImageLink(options) {

			task('Add a link to `' + options.path + '`', function () {

				task('Create an `a` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > a'),
					onRemoveFile: tasks.checkRemoveFile('/index.html')
				});

				task('Place the link after the `p` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > p', 'body > a'),
					onRemoveFile: tasks.checkRemoveFile('/index.html')
				});

				task('Set the `href` attribute to `/index.html`', {
					topic: 'HTML Attributes',
					onRemoveFile: tasks.checkRemoveFile('/index.html'),
					onUpdatePreviewArea: function onUpdatePreviewArea(url, html, preview) {
						if (url !== '/index.html') return;
						this.isValid = preview.find('body > a[href="' + options.path + '"]').length === 1;
					}
				});

				task('Use the `' + options.imagePath + '` image as content', function () {

					task('Create an `img` Element inside of the link', {
						topic: 'HTML Attributes',
						onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > a[href="' + options.path + '"] > img'),
						onRemoveFile: tasks.checkRemoveFile('/index.html')
					});

					task('Set the `src` attribute to `' + options.imagePath + '`', {
						topic: 'HTML Attributes',
						onRemoveFile: tasks.checkRemoveFile('/index.html'),
						onUpdatePreviewArea: function onUpdatePreviewArea(url, html, preview) {
							if (url !== '/index.html') return;
							this.isValid = preview.find('body > a[href="' + options.path + '"] > img[src="' + options.imagePath + '"]').length === 1;
						}
					});
				});
			});
		}

		createImageLink({ path: '/apple.html', imagePath: '/apple.png' });
		createImageLink({ path: '/cherry.html', imagePath: '/cherry.png' });
		createImageLink({ path: '/orange.html', imagePath: '/orange.png' });
		createImageLink({ path: '/pineapple.html', imagePath: '/pineapple.png' });
	});

	// creates a task for a new product page
	function createProductPage(options) {

		task('Create ' + (options.determiner || 'a') + ' `' + options.path + '` product page', function () {

			task('Use the **Create new file** button to add `' + options.path + '`', {
				onCreateFile: tasks.checkNewFile(options.path, true),
				onUploadFile: tasks.checkNewFile(options.path, false)
			});

			task('Add a title to `' + options.path + '`', function () {

				task('Create a `title` Element', {
					topic: 'Page Structure',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'head > title'),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Use the title "' + options.title + '"', {
					topic: 'Page Structure',
					onUpdatePreviewArea: tasks.expectElementContent(options.path, 'head > title', { match: options.title }),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});
			});

			task('Add the `' + options.imagePath + '` image to `' + options.path + '` ', function () {

				task('Create an `img` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'body > img'),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Set the `src` attribute to `' + options.imagePath + '`', {
					topic: 'HTML Attributes',
					onRemoveFile: tasks.checkRemoveFile(options.path),
					onUpdatePreviewArea: function onUpdatePreviewArea(url, html, preview) {
						if (url !== options.path) return;
						this.isValid = preview.find('body > img[src="' + options.imagePath + '"]').length === 1;
					}
				});
			});

			task('Add a paragraph to `' + options.path + '`', function () {

				task('Create a `p` Element', {
					topic: 'Headings & Paragraphs',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'body > p'),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Place the `p` Element after the `img` Element', {
					topic: 'Headings & Paragraphs',
					onUpdatePreviewArea: tasks.expectOrder(options.path, 'body > img', 'body > p'),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Describe the product with at least 15 characters', {
					topic: 'Headings & Paragraphs',
					onUpdatePreviewArea: tasks.expectElementContent(options.path, 'body > p', { min: 15 }),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});
			});

			task('Add a return link to `/index.html`', function () {

				task('Create an `a` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'body > a'),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Place the link after the `p` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectOrder(options.path, 'body > p', 'body > a'),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Enter at least 5 characters in the link', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElementContent(options.path, 'body > a', { min: 5 }),
					onRemoveFile: tasks.checkRemoveFile(options.path)
				});

				task('Set the `href` attribute to `/index.html`', {
					topic: 'HTML Attributes',
					onRemoveFile: tasks.checkRemoveFile(options.path),
					onUpdatePreviewArea: function onUpdatePreviewArea(url, html, preview) {
						if (url !== options.path) return;
						this.isValid = preview.find('body > a[href="/index.html"]').length === 1;
					}
				});
			});
		});
	}

	createProductPage({
		title: 'Amazing Apple',
		path: '/apple.html',
		imagePath: '/apple.png',
		determiner: 'an'
	});

	createProductPage({
		title: 'Cherry Crush',
		path: '/cherry.html',
		imagePath: '/cherry.png'
	});

	createProductPage({
		title: 'Outrageous Orange',
		path: '/orange.html',
		imagePath: '/orange.png',
		determiner: 'an'
	});

	createProductPage({
		title: 'Pineapple Perfection',
		path: '/pineapple.html',
		imagePath: '/pineapple.png'
	});

	task('Fix all validation errors', {
		onCreateTask: function onCreateTask() {
			this.validation = {};
			this.isValid = false;
		},
		onContentChange: function onContentChange(file) {
			var _this = this;

			if (!this.validation) {
				this.validation = {
					'/index.html': false,
					'/apple.html': false,
					'/cherry.html': false,
					'/orange.html': false,
					'/pineapple.html': false
				};
			}

			(0, _lib.validateHtmlDocument)(file.current, function (doc) {
				_this.validation[file.path] = !doc.hasErrors;
				_this.isValid = _lib._.every(_this.validation);
			});
		}
	});
});

},{"./controllers/task-list":1,"./lib":6,"./tasks":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.checkNewFile = checkNewFile;
exports.checkRemoveFile = checkRemoveFile;
exports.expectElement = expectElement;
exports.expectElementContent = expectElementContent;
exports.expectOrder = expectOrder;

var _lib = require('./lib');

function checkNewFile(path, replaceContent) {
	return function (file) {
		if (file.path !== path) return;

		// creating a new file defaults to missing the title
		if (replaceContent) file.content = '<!DOCTYPE html>\n<html>\n\t<head>\n\n\t</head>\n\t<body>\n\n\t</body>\n</html>';

		this.isValid = true;
	};
}

// check if a file was removed
function checkRemoveFile(path) {
	return function (paths) {
		if (paths.indexOf(path) > -1) this.isValid = false;
	};
}

// helper functions
function expectElement(path, selector) {
	var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	return function (url, html, preview) {
		var _this = this;

		if (url !== path) return;
		(0, _lib.validateHtmlDocument)(html, function (doc) {

			var count = doc.find(selector).total();
			if (count === 0) {
				_this.isValid = false;
			} else if (!isNaN(options.limit)) {
				_this.isValid = count < options.limit;
			} else {
				_this.isValid = true;
			}
		});
	};
}

// check for content 
function expectElementContent(path, selector, options) {
	var min = isNaN(options.min) ? 0 : options.min;
	var max = isNaN(options.max) ? Number.MAX_SAFE_INTEGER : options.max;

	return function (url, html, preview) {
		if (url !== path) return;

		// get the text length
		var text = preview.find(selector).text();
		if (options.trim !== false) text = _lib._.trim(text);

		// checkng for a text match
		if (options.match) {
			this.isValid = _lib._.toLower(text) === _lib._.toLower(options.match);
			return;
		}

		// checking for a length match
		var length = text.length;
		this.isValid = length >= min && length <= max;
	};
}

// expect selectors in a certain order
function expectOrder(path) {
	for (var _len = arguments.length, selectors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		selectors[_key - 1] = arguments[_key];
	}

	return function (url, html, preview) {
		var _this2 = this;

		if (url !== path) return;

		(0, _lib.validateHtmlDocument)(html, function (doc) {

			// make sure all elements are present
			var sequence = _lib._.map(selectors, function (selector) {
				return doc.find(selector).index();
			});

			// make sure each match is in the sequential order
			var hwm = -1;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = sequence[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var index = _step.value;

					if (index === -1) {
						_this2.isValid = false;
						return;
					}

					if (index < hwm) {
						_this2.isValid = false;
						return;
					}

					hwm = index;
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

			_this2.isValid = true;
		});
	};
}

},{"./lib":6}]},{},[5]);
