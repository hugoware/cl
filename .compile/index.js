'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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