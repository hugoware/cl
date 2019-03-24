(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../lib":3}],2:[function(require,module,exports){
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

var _lib = require('./lib');

var _waitForFile = require('./controllers/waitForFile');

var _waitForFile2 = _interopRequireDefault(_waitForFile);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

// import controllers


// lesson controller
var webCssIdClassSelectorsLesson = function () {

	// setup the lesson
	function webCssIdClassSelectorsLesson(project, lesson, api) {
		var _this = this;

		_classCallCheck(this, webCssIdClassSelectorsLesson);

		this.state = {};
		this.lesson = lesson;
		this.project = project;
		this.api = api;

		// core lesson data
		this.data = {
			"name": "Title",
			"type": "web",
			"description": "Description",
			"lesson": [{
				"mode": "overlay",
				"title": "Title",
				"content": "content\n"
			}],
			"snippets": {},
			"resources": [],
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
		var refs = {};

		// setup each reference
		_lib._.each(refs, function (ref, key) {
			if (ref.controller) _this.controllers[key] = ref;
		});

		// debugging
		if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
	}

	// returns the active controller


	_createClass(webCssIdClassSelectorsLesson, [{
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
		}

		// // leaves a slide
		// deactivateSlide(slide) {

		// }

		// executes an action if available

	}, {
		key: 'invoke',
		value: function invoke(action) {
			if (!this.respondsTo(action)) return null;
			action = toActionName(action);
			var controller = this.controller;

			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			return controller[action].apply(this, args);
		}

		// checks if there's an action for this event

	}, {
		key: 'respondsTo',
		value: function respondsTo(action) {
			action = toActionName(action);
			var controller = this.controller;

			return !!controller && controller[action];
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

	return webCssIdClassSelectorsLesson;
}();

// converts to an invoke action name


function toActionName(name) {
	if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
	return name;
}

// register the lesson for use
window.registerLesson('web_css_id_class_selectors', webCssIdClassSelectorsLesson);

},{"./controllers/waitForFile":1,"./lib":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var lib = window.__CODELAB_LIBS__;

var _ = exports._ = lib._;
var $ = exports.$ = lib.$;
var CodeValidator = exports.CodeValidator = lib.CodeValidator;
var HtmlValidator = exports.HtmlValidator = lib.HtmlValidator;
var CssValidator = exports.CssValidator = lib.CssValidator;

exports.default = {
	_: _, $: $,
	CodeValidator: CodeValidator,
	HtmlValidator: HtmlValidator,
	CssValidator: CssValidator
};

},{}]},{},[2]);
