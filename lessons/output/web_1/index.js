(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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


var _validateList = require('./validateList');

var validateList = _interopRequireWildcard(_validateList);

var _verifyHasEnoughListItems = require('./verifyHasEnoughListItems');

var verifyHasEnoughListItems = _interopRequireWildcard(_verifyHasEnoughListItems);

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

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
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "Welcome to your first lesson on creating web pages!\n\n[image html-logo.png 140 inline]\n[image css-logo.png 140 inline fade]\n[image javascript-logo.png 140 inline fade]\n\nAs you work through this lesson you will be asked to complete certain tasks before you can move onto the next step.\n"
      }, {
        "mode": "overlay",
        "content": "It's exciting to start learning a new programming language, but before we learn how to use [define html] and [define css] to create web pages, it's a good idea to learn a bit about the technology that's running behind the scenes.\n"
      }, {
        "mode": "overlay",
        "content": "[define html] is a language that's used to display web pages on the [define internet]. For the most part, it's the content such as words and images on a web page.\n\nSimply put, [define html] is what a web page _says_.\n"
      }, {
        "mode": "overlay",
        "content": "[define css] is another language used when creating web pages. [define css] is used to create rules that decide how the page appears, such as choosing colors and or changing font sizes.\n\nGenerally speaking, [define css] is how the web page _looks_.\n"
      }, {
        "mode": "overlay",
        "content": "Finally, [define javascript] is a programming language that allows you to add logic and behaviors to a web page.\n\nFor the most part, [define javascript] is what a web page _does_.\n"
      }, {
        "mode": "overlay",
        "content": "For the most part, these three technologies are used to create most of what you see on the [define internet] today.\n\nTo start, we'll be learning mostly about how to use [define html] to create web pages, and then later how to apply [define css] to change the visual appearance of what we created.\n"
      }, {
        "mode": "overlay",
        "content": "[define html] is a set of instructions that a [define web_browser] uses to determine what is shown to use user.\n\nEach time you browse to a [define web_page], the [define web_browser] receives [define html] from the website, reads the instructions, and then creates the final page that you see on your screen.\n"
      }, {
        "mode": "overlay",
        "show": 4,
        "title": "What is the [define html] name of the `highlighted` block of code?",
        "content": "You're going to need to select the correct [define html] to get this right\n\n[snippet mary_example]\n",
        "hint": "This is a longer example of [define css] what a hint might look like. This is going to span for a period longer than the other items on the page.\n",
        "explain": "This is just a `summary message` to explain the final answer",
        "choices": ["this is `correct`", "This *is* incorrect", "This _is_ also wrong", "This ~shouldn't~ work", "This *is another* mix", "This _is_ failed"]
      }, {
        "mode": "overlay",
        "content": "Simple 1\n\n[snippet html_tag_example highlight:0,4|30,5]\n"
      }, {
        "mode": "overlay",
        "content": "Simple 2 [define javascript]"
      }, {
        "mode": "popup",
        "content": "Simple 3 [define html]"
      }, {
        "mode": "popup",
        "content": "Simple 4"
      }, {
        "mode": "overlay",
        "content": "Simple 5 [define css]"
      }, {
        "mode": "overlay",
        "content": "Simple 6"
      }, {
        "mode": "popup",
        "content": "Simple 7"
      }, {
        "mode": "popup",
        "content": "Simple 8"
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
      }],
      "snippets": {
        "complex_tag": {
          "content": "<div>\n  <h1>The Title</h1>\n  <p>The main content!</p>\n</div>",
          "type": "html"
        },
        "html_tag_example": {
          "content": "<h1>This is an example of HTML</h1>",
          "type": "html"
        },
        "mary_example": {
          "content": "function readTheFile() {\n  console.log('reads the file');\n}",
          "type": "javascript"
        }
      },
      "definitions": {
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full definition value"
        },
        "css": {
          "id": "css",
          "name": "CSS",
          "aka": "Cascading Style Sheets",
          "define": "Special rules for styling\n"
        },
        "internet": {
          "id": "internet",
          "name": "Internet",
          "define": "A world wide network of computers\n"
        },
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
        },
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
        "web_page": {
          "id": "web_page",
          "name": "Web Page",
          "define": "An individual view of a web site.\n"
        }
      }
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
    this.validate = api.validate;
    this.content = api.content;
    this.editor = api.editor;
    this.sound = api.sound;

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

    // returns the current slide

  }, {
    key: 'slide',
    get: function get() {
      return this.lesson.slide;
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

},{"./validateList":2,"./verifyHasEnoughListItems":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onInit = onInit;
exports.onEnter = onEnter;
exports.onContentChange = onContentChange;
var controller = exports.controller = true;

// entering and resetting
function onInit() {
  this.editor.area.lines(9, 12);
}

// initial entry for the slide
function onEnter() {
  this.progress.block();
  this.editor.readOnly('/index.html', false);
  this.editor.area.lines(9, 12);

  // let hint = 8;
  // setInterval(() => this.editor.hint('just a hint', { index: ++hint }), 1000);
  // this.editor.hint('just a hint', { index: hint });

  // let start = 8;
  // let end = start + 5;
  // setInterval(() => {
  // 	start++;
  // 	end++;
  // 	end++;
  // 	this.editor.area({ start, end });

  // 	console.log('try get');
  // 	const content = this.editor.area.content();
  // 	console.log(content);
  // }, 1000);

  // this.editor.area(82, 179, { path: '/index.html' });
  // this.editor.marker('start', { start: 5, end: 15 });

  this.invoke('contentChange');
}

function onContentChange() {
  var _this = this;

  var content = this.editor.area.content();

  var result = this.validate.html(content, function (test) {
    return test._t._t._t.tag('li').content().close('li')._n._t._t._t.tag('li').content().close('li')._n._t._t._t.tag('li').content().close('li')._n._t._t._t.tag('li').content().close('li')._n._t._t._t.tag('li').content().close('li').eof();
  });

  // update validation
  this.editor.hint.validate(result);

  // update progress
  this.progress.update(result, {
    allow: function allow() {
      return _this.assistant.say('Great! Let\'s move to the next step!');
    },
    deny: function deny() {
      return _this.assistant.show(_this.slide.content);
    },
    always: this.sound.notify
  });
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
exports.onReset = onReset;
exports.onOpenFile = onOpenFile;
exports.onBeforeContentChange = onBeforeContentChange;
var controller = exports.controller = true;

var MESSAGE_OPEN_FILE = '\nBefore we can continue, we need to open the `index.html` file.\n\n[snippet html_example]\n\nStart by double clicking the file in the file browser';

var MESSAGE_INCORRECT_FILE = '\nOops! That\'s not the correct file! Double click on the highlighted file in the file browser';

var MESSAGE_CORRECT_FILE = '\nGreat! Let\'s continue to the next slide!';

function onEnter() {
	this.editor.readOnly('/index.html', true);
	this.assistant.emote.sad();
	this.progress.block();
	this.screen.highlight.fileBrowserItem('/index.html');
}

function onExit() {
	this.screen.highlight.clear();
}

function onReset() {
	console.log('onReset');
}

function onOpenFile(file) {
	if (this.state.hasOpenedIndexHtml) return false;

	// check the file
	var correct = file.path === '/index.html';
	if (!correct) {
		this.assistant.say(MESSAGE_INCORRECT_FILE, { emote: 'sad', force: true });
		this.progress.block();
		return false;
	}

	// save this worked
	this.state.hasOpenedIndexHtml = true;
	this.assistant.say(MESSAGE_CORRECT_FILE, { emotion: 'happy' });
	this.progress.allow();
	this.screen.highlight.clear();
	return true;
}

function onBeforeContentChange(_ref, event) {
	var file = _ref.file,
	    session = _ref.session;

	this.assistant.say('Don\'t try and edit `' + file.name + '` just yet!', { emotion: 'sad' });
	return false;
}

},{}]},{},[1]);
