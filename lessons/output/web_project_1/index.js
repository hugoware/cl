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
			var name = config.file.split('/').pop();

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

var _tasks = require('./tasks');

var tasks = _interopRequireWildcard(_tasks);

var _waitForHover = require('./waitForHover');

var waitForHover = _interopRequireWildcard(_waitForHover);

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
			"name": "Web Project #1",
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
				"content": "The purpose of this lesson is to ensure that you have mastered all of the skills taught in previous lessons.\n\n**Keep in mind that it's entirely possible that you might get stuck!**\n\nIf that happens, go back and retry previous lessons until you're ready to try this project again. Sometimes it takes going over a topic a few times before you fully understand it!\n"
			}, {
				"controller": "waitForHover",
				"mode": "popup",
				"showObjectiveList": true,
				"highlight": "#header .task-list .heading",
				"content": "The list of **Objectives** is found in the top right corner of the screen.\n\nMove your mouse over the highlighted area to see what must be accomplished before the project is completed.\n"
			}, {
				"mode": "popup",
				"highlight": "#header .task-list .heading",
				"content": "There are many objectives that you will need to complete. Some objectives are not visible unless you scroll the list down to see them.\n\nAdditionally, as you finish groups of objectives, they will be automatically collapsed into single items on the list.\n"
			}, {
				"flags": "+OPEN-MODE",
				"controller": "list",
				"content": "Alright, it's time to get started!\n\nGood luck! I look forward to seeing what you create!\n"
			}, {
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
			"definitions": {}
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
			list: list, tasks: tasks, waitForHover: waitForHover
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
					file: slide.waitForFile
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

	return webProject1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
	if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
	return name;
}

// register the lesson for use
window.registerLesson('web_project_1', webProject1Lesson);

},{"./controllers/waitForFile":2,"./controllers/waitForTab":3,"./lib":5,"./list":6,"./tasks":7,"./waitForHover":8}],5:[function(require,module,exports){
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
var validateHtmlDocument = exports.validateHtmlDocument = lib.HtmlValidationHelper.validate;

$.preview = function () {
	return $('#preview .output').contents();
};

exports.default = {
	_: _, $: $,
	CodeValidator: CodeValidator,
	HtmlValidator: HtmlValidator,
	CssValidator: CssValidator,
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
	title: 'Create a small website'
},

// setup the main task
function (task) {

	task('Fix any validation errors', {
		onCreateTask: function onCreateTask() {
			this.validation = {};
			this.isValid = false;
		},
		onContentChange: function onContentChange(file) {
			var _this = this;

			if (!this.validation) {
				this.validation = {};
			}

			(0, _lib.validateHtmlDocument)(file.current, function (html) {
				_this.validation[file.path] = !html.hasErrors;
				_this.isValid = _lib._.every(_this.validation);
			});
		}
	});

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

			task('Enter at least 5 characters in the title', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'head > title', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});
		});

		task('Add a heading to `index.html`', function () {

			task('Create a `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Enter at least 10 characters in the heading', {
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
				onUpdatePreviewArea: function onUpdatePreviewArea(url, preview, html) {
					if (url !== '/index.html') return;
					var header = preview.find('body > h1').index();
					var paragraph = preview.find('body > p').index();
					return this.isValid = header > -1 && paragraph > -1 && header < paragraph;
				}
			});

			task('Enter at least 15 characters in the paragraph', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > p', { min: 15 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});
		});

		task('Add the `fox.png` image to `index.html`', function () {

			task('Create an `img` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Place the `img` Element between the `h1` and `p` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > h1', 'body > img', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Set the `src` attribute to `/fox.png`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
				onUpdatePreviewArea: function onUpdatePreviewArea(url, preview, html) {
					if (url !== '/index.html') return;
					this.isValid = preview.find('body > img[src="/fox.png"]').length === 1;
				}
			});
		});

		task('Add a link to `/about.html`', function () {

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

			task('Enter at least 5 characters in the link', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > a', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Set the `href` attribute to `/index.html`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
				onUpdatePreviewArea: function onUpdatePreviewArea(url, preview, html) {
					if (url !== '/index.html') return;
					this.isValid = preview.find('body > a[href="/about.html"]').length === 1;
				}
			});
		});
	});

	task('Create an `about.html` page', function () {

		task('Use the **Create new file** button to add `about.html`', {
			onCreateFile: tasks.checkNewFile('/about.html', true),
			onUploadFile: tasks.checkNewFile('/about.html', false)
		});

		task('Add a title to `about.html`', function () {

			task('Create a `title` Element', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'head > title'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Enter at least 5 characters in the title', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'head > title', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});
		});

		task('Add a heading to `about.html`', function () {

			task('Create a `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Enter at least 10 characters in the heading', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > h1', { min: 10 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});
		});

		task('Add a paragraph to `about.html`', function () {

			task('Create a `p` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Place the `p` Element after the `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/about.html', 'body > h1', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Enter at least 15 characters in the paragraph', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > p', { min: 15 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});
		});

		task('Add the `/cat.png` image', function () {

			task('Create an `img` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Place the `img` Element between the `h1` and `p` Elements', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/about.html', 'body > h1', 'body > img', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Set the `src` attribute to `/cat.png`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
				onUpdatePreviewArea: function onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > img[src="/cat.png"]').length === 1;
				}
			});
		});

		task('Add a link to `/index.html`', function () {

			task('Create an `a` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Place the link after the `p` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectOrder('/about.html', 'body > p', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Enter at least 5 characters in the link', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > a', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html')
			});

			task('Set the `href` attribute to `/index.html`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
				onUpdatePreviewArea: function onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > a[href="/index.html"]').length === 1;
				}
			});
		});
	});
});

},{"./controllers/task-list":1,"./lib":5,"./tasks":7}],7:[function(require,module,exports){
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
	return function (url, preview) {
		if (url !== path) return;
		this.isValid = preview.find(selector).length === 1;
	};
}

// check for content 
function expectElementContent(path, selector, options) {
	var min = isNaN(options.min) ? 0 : options.min;
	var max = isNaN(options.max) ? Number.MAX_SAFE_INTEGER : options.max;

	return function (url, preview) {
		if (url !== path) return;

		// get the text length
		var text = preview.find(selector).text();
		if (options.trim !== false) text = _lib._.trim(text);

		// check the result
		var length = text.length;
		this.isValid = length >= min && length <= max;
	};
}

// expect selectors in a certain order
function expectOrder(path) {
	for (var _len = arguments.length, selectors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		selectors[_key - 1] = arguments[_key];
	}

	return function (url, preview) {
		if (url !== path) return;

		// make sure all elements are present
		var sequence = _lib._.map(selectors, function (selector) {
			return preview.find(selector).index();
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
					this.isValid = false;
					return;
				}

				if (index < hwm) {
					this.isValid = false;
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

		this.isValid = true;
	};
}

},{"./lib":5}],8:[function(require,module,exports){
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

},{}]},{},[4]);
