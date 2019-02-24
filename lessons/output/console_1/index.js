(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onTryEditReadOnly = onTryEditReadOnly;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight.codeEditor();
}

function onTryEditReadOnly() {
	this.assistant.say({
		emote: 'happy',
		message: 'Oops! I\'m glad you\'re so excited to start making changes, but you can\'t edit the file just yet!'
	});
}

function onExit() {
	this.screen.highlight.clear();
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight.previewArea();
}

function onExit() {
	this.screen.highlight.clear();
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onInit = onInit;
exports.onReset = onReset;
exports.onEnter = onEnter;
exports.onBeforeContentChange = onBeforeContentChange;
exports.onRunCode = onRunCode;
exports.onRunCodeEnd = onRunCodeEnd;

var _lib = require('./lib');

var controller = exports.controller = true;

function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 15, end: 28 });
}

function onReset() {
	this.assistant.revert();
}

function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

function onBeforeContentChange(file, change) {
	if (change.isNewline || change.data === "'") return false;
}

function onRunCode() {
	return true;
}

function onRunCodeEnd(context) {
	var _this = this;

	var message = context.output[1];

	if (_lib._.size(message) < 5) {
		this.delay(500, function () {
			return _this.screen.highlight('.line-number-1');
		});
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: 'Great! Looks like you typed in `' + message + '`.'
		});
	} else {
		this.assistant.say({
			message: 'Oops! Make sure to type a message!'
		});
	}
}

},{"./lib":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onOpenFile = onOpenFile;
exports.onEnter = onEnter;
var controller = exports.controller = true;

function onOpenFile(file) {
	this.screen.highlight.clear();
}

function onEnter() {
	this.screen.highlight.fileBrowser();
}

},{}],5:[function(require,module,exports){
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

var _codeEditorIntro = require('./codeEditorIntro');

var codeEditorIntro = _interopRequireWildcard(_codeEditorIntro);

var _codeOutputIntro = require('./codeOutputIntro');

var codeOutputIntro = _interopRequireWildcard(_codeOutputIntro);

var _customLogMessage = require('./customLogMessage');

var customLogMessage = _interopRequireWildcard(_customLogMessage);

var _highlightFileBrowser = require('./highlightFileBrowser');

var highlightFileBrowser = _interopRequireWildcard(_highlightFileBrowser);

var _runCodeButton = require('./runCodeButton');

var runCodeButton = _interopRequireWildcard(_runCodeButton);

var _waitForMainJs = require('./waitForMainJs');

var waitForMainJs = _interopRequireWildcard(_waitForMainJs);

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

// lesson controller
var console1Lesson = function () {

  // setup the lesson
  function console1Lesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, console1Lesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Intro to Programming",
      "type": "code",
      "description": "An basic introduction to programming with JavaScript",
      "lesson": [{
        "mode": "overlay",
        "title": "Introduction to Programming",
        "content": "Welcome to your first lesson on basic computer programming!\n\nAs you work through this lesson you will be asked to complete certain tasks before you can move onto the next step.\n"
      }, {
        "content": "Computer programming is a way of giving computers instructions about what they should do next. These instructions are known as code, and computer programmers write code to solve problems or perform a task.\n"
      }, {
        "content": "Here is why it's a thing"
      }, {
        "content": "What it's used for"
      }, {
        "content": "There\n"
      }, {
        "content": "JavaScript"
      }, {
        "mode": "popup",
        "content": "We've talked a lot about how computer programming works, so let's jump into writing some code and see what happens.\n"
      }, {
        "controller": "highlightFileBrowser",
        "content": "On the left side of the screen is the [define file_browser]. This is a list of all files in your project.\n"
      }, {
        "flags": "+OPEN_FILE",
        "controller": "waitForMainJs",
        "content": "Open the file named `main.js` by [define double_click double clicking] on it in the [define file_browser].\n"
      }, {
        "controller": "codeEditorIntro",
        "content": "The code file you just opened is now in the [define codelab_editor] area. This is where you can make changes to code.\n\nAt the top, you'll see there's a new tab added for the file you just opened.\n"
      }, {
        "controller": "codeOutputIntro",
        "content": "On the right side of the screen you can see the [define codelab_code_output]. This will show the output for your file when you press the **Run Code** button.\n"
      }, {
        "start": true,
        "controller": "runCodeButton",
        "content": "Let's try and run this code example and see what happens.\n\nPress the **Run Code** button and watch the [define codelab_code_output] area.\n"
      }, {
        "content": "This is an example of using a programming feature called a _\"function\"_.\n\nWe'll learn more about how to use _functions_ in later lessons, but for now let's use it so we can display messages in the [define codelab_code_output output] area.\n"
      }, {
        "controller": "customLogMessage",
        "content": "Why don't you try changing the message that's displayed on the screen.\n\nReplace the phrase `\"hello, world!\"` with something different and then press the **Run Code** button to see the results.\n"
      }, {
        "content": "About to finish"
      }, {
        "content": "Done"
      }],
      "snippets": {},
      "resources": [],
      "definitions": {
        "codelab_code_output": {
          "id": "codelab_code_output",
          "name": "Code Output",
          "define": "The result of called code\n"
        },
        "double_click": {
          "id": "double_click",
          "name": "Double Click",
          "define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."
        },
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
        },
        "codelab_editor": {
          "id": "codelab_editor",
          "name": "Code Editor",
          "define": "The CodeLab editing area\n"
        }
      }
    };

    // timing
    this._delays = {};
    this._intervals = {};

    // expose API tools
    this.assistant = api.assistant;
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
      codeEditorIntro: codeEditorIntro, codeOutputIntro: codeOutputIntro, customLogMessage: customLogMessage, highlightFileBrowser: highlightFileBrowser, runCodeButton: runCodeButton, waitForMainJs: waitForMainJs
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(console1Lesson, [{
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

    // resets any required information between slides

  }, {
    key: 'clear',
    value: function clear() {
      _lib._.each(this._delays, function (cancel) {
        return cancel();
      });
      _lib._.each(this._intervals, function (cancel) {
        return cancel();
      });
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

  return console1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('console_1', console1Lesson);

},{"./codeEditorIntro":1,"./codeOutputIntro":2,"./customLogMessage":3,"./highlightFileBrowser":4,"./lib":6,"./runCodeButton":7,"./waitForMainJs":8}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onRunCode = onRunCode;
exports.onRunCodeEnd = onRunCodeEnd;
var controller = exports.controller = true;

function onEnter() {
	this.progress.block();
	this.screen.marker.runButton({ tr: true, offsetX: -2, offsetY: 2 });
}

function onRunCode() {
	this.screen.highlight.clear();
	return true;
}

function onRunCodeEnd(context) {
	var _this = this;

	this.progress.allow();
	this.delay(500, function () {
		return _this.screen.highlight('.line-number-1');
	});
	this.assistant.say({
		emote: 'happy',
		message: 'Great! You can see that running this code caused a message to be displayed in the [define codelab_code_output output] area.'
	});
}

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onOpenFile = onOpenFile;
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onOpenFile(file) {

	if (file.path === '/main.js') {
		this.progress.next();
		return true;
	}
}

function onEnter() {
	var _this = this;

	this.progress.block();

	this.file.readOnly({ path: '/main.js' });
	this.screen.highlight.fileBrowserItem('/main.js');

	this.delay(10000, function () {
		_this.assistant.say({
			message: '\n\t\t\t\tTo open the `main.js` file, [define double_click double click] the item in the [define file_browser File Browser].\n\t\t\t\tTo [define double_click double click], move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.'
		});
	});
}

function onExit() {
	this.screen.highlight.clear();
}

},{}]},{},[5]);
