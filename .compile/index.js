'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import controllers


var _validateList = require('./validateList');

var validateList = _interopRequireWildcard(_validateList);

var _verifyHasEnoughListItems = require('./verifyHasEnoughListItems');

var verifyHasEnoughListItems = _interopRequireWildcard(_verifyHasEnoughListItems);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// performs the oxford comma
function $oxford(items, conjunction) {
	var total = items.length;

	// determine the best
	if (total === 1) return items.join('');else if (total == 2) return items.join(' ' + conjunction + ' ');

	// return the result
	else {
			var last = items.pop();
			return items.join(', ') + ', ' + conjunction + ' ' + last;
		}
}

// pluralizes a word
function $plural(count, single, plural, none) {
	var delimeter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '@';

	var value = Math.abs(count);
	var message = value === 1 ? single : value > 1 ? plural ? plural : single + 's' : none || plural;
	return message.replace(delimeter, count);
}

// lesson controller

var web1Lesson = function () {

	// setup the lesson
	function web1Lesson(project, lesson, api, utils) {
		var _this = this;

		_classCallCheck(this, web1Lesson);

		this.state = {};
		this.lesson = lesson;
		this.project = project;
		this.api = api;

		// core lesson data
		this.data = {
			"name": "Basics 1",
			"type": "web",
			"description": "Introduction to building Web Pages",
			"lesson": [{
				"mode": "popup",
				"controller": "verifyHasEnoughListItems",
				"content": "Let's learn about unordered lists!\n\nStart by opening the `index.html` file by double clicking on it\n"
			}, {
				"mode": "popup",
				"controller": "validateList",
				"content": "These are tags that wrap the unordered list\n"
			}, {
				"mode": "overlay",
				"show": 4,
				"title": "What is the name of the `highlighted` block of code?",
				"content": "[snippet mary_example]\n",
				"hint": "This is a longer example of what a hint might look like. This is going to span for a period longer than the other items on the page.\n",
				"explain": "This is just a `summary message` to explain the final answer",
				"choices": ["this is `correct`", "This *is* incorrect", "This _is_ also wrong", "This ~shouldn't~ work", "This *is another* mix", "This _is_ failed"]
			}, {
				"mode": "overlay",
				"show": 4,
				"title": "This is another question about what you've learned?",
				"hint": "It's really pretty obvious",
				"explain": "This is just a `summary message` to explain the final answer",
				"choices": ["this is `correct`", "This *is* incorrect", "This _is_ also wrong", "This ~shouldn't~ work", "This *is another* mix", "This _is_ failed"]
			}, {
				"checkpoint": true,
				"mode": "popup",
				"content": "That's it! The lesson is finished!"
			}]
		};

		// other utilities
		utils.plural = $plural;
		utils.oxford = $oxford;

		// share utility function
		var _ = window._ = utils._;
		utils._.assign(_, utils);

		// expose API tools
		this.assistant = api.assistant;
		this.screen = api.screen;
		this.progress = api.progress;
		this.content = api.content;
		this.editor = api.editor;

		// setup controllers
		this.controllers = {};

		// setup each included entry
		var refs = {
			validateList: validateList, verifyHasEnoughListItems: verifyHasEnoughListItems
		};

		// setup each reference
		_.each(refs, function (ref, key) {
			if (ref.controller) _this.controllers[key] = ref;else _.assign(_this, ref);
		});

		// debugging
		if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
	}

	// returns the active controller


	_createClass(web1Lesson, [{
		key: 'invoke',


		// executes an action if available
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
	}, {
		key: 'timeout',
		value: function timeout(action, time) {}
	}, {
		key: 'interval',
		value: function interval(action, time) {}
	}, {
		key: 'controller',
		get: function get() {
			var slide = this.lesson.slide;

			return slide && this.controllers[slide.controller];
		}
	}]);

	return web1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
	if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
	return name;
}

// register the lesson for use
window.registerLesson('web_1', web1Lesson);