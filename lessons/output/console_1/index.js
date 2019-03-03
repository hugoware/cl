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
exports.onExit = onExit;
exports.onBeforeContentChange = onBeforeContentChange;
exports.onRunCodeAlert = onRunCodeAlert;
exports.onRunCode = onRunCode;

var _lib = require('./lib');

var controller = exports.controller = true;

function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 9, end: 22 });
	this.preview.clearRunner();
}

function onReset() {
	this.assistant.revert();
}

function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

function onExit() {
	this.editor.area.clear();
}

function onBeforeContentChange(file, change) {
	if (change.isNewline || change.data === "'" || change.data === '\\') return false;
}

function onRunCodeAlert(context, message) {

	if (_lib._.size(message) > 5) {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: 'Great! You can see your message displayed in the [define codelab_code_output].'
		});
	} else {
		var any = _lib._.some(message);
		this.assistant.say({
			message: 'Type a ' + (any ? 'longer' : '') + ' message before pressing the **Run Code** button!'
		});
	}
}

function onRunCode(context) {
	return true;
}

},{"./lib":7}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onEnter = onEnter;
exports.onRunCodeAlert = onRunCodeAlert;
exports.onReady = onReady;
exports.onContentChange = onContentChange;
exports.onExit = onExit;
exports.onRunCode = onRunCode;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $alertCount = 0;
var $isValid = false;

function validate(instance) {
	var content = instance.file.content({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(content, _validation.validate_free_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	$isValid = false;
	instance.progress.check({
		result: result,
		allow: function allow() {
			$isValid = true;
			instance.assistant.say({
				message: 'Great! Press the **Run Code** button to see what happens!'
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });
}

function onRunCodeAlert(context, message) {

	if ($alertCount === 0) {
		$alertCount++;

		this.assistant.say({
			message: 'When code is run it\'s done [define sequentially sequentially], meaning it will [define execute execute] in the order it appears in the file.\nYou can see that the first `alert` message has been displayed. Press **OK** to allow the code to continue running.'
		});
	} else if ($alertCount === 1) {
		this.assistant.say({
			message: 'Great! Now the second alert message has been displayed!',
			emote: 'happy'
		});
		this.progress.allow();
	}
}

function onReady() {
	validate(this);
}

function onContentChange(file) {
	this.progress.block();
	this.assistant.revert();
	validate(this);
}

function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

function onRunCode() {
	if (!$isValid) {
		this.assistant.revert();
		return false;
	}

	$alertCount = 0;
	return true;
}

},{"./lib":7,"./validation":10}],5:[function(require,module,exports){
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

var _codeEditorIntro = require('./codeEditorIntro');

var codeEditorIntro = _interopRequireWildcard(_codeEditorIntro);

var _codeOutputIntro = require('./codeOutputIntro');

var codeOutputIntro = _interopRequireWildcard(_codeOutputIntro);

var _customLogMessage = require('./customLogMessage');

var customLogMessage = _interopRequireWildcard(_customLogMessage);

var _freeConsoleMessage = require('./freeConsoleMessage');

var freeConsoleMessage = _interopRequireWildcard(_freeConsoleMessage);

var _highlightFileBrowser = require('./highlightFileBrowser');

var highlightFileBrowser = _interopRequireWildcard(_highlightFileBrowser);

var _repeatConsoleMessage = require('./repeatConsoleMessage');

var repeatConsoleMessage = _interopRequireWildcard(_repeatConsoleMessage);

var _runCodeButton = require('./runCodeButton');

var runCodeButton = _interopRequireWildcard(_runCodeButton);

var _validation = require('./validation');

var validation = _interopRequireWildcard(_validation);

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
        "controller": "waitForMainJs",
        "content": "Open the file named `main.js` by [define double_click double clicking] on it in the [define file_browser].\n"
      }, {
        "controller": "codeEditorIntro",
        "content": "The code file you just opened is now in the [define codelab_editor] area. This is where you can make changes to code.\n\nAt the top, you'll see there's a new tab added for the file you just opened.\n"
      }, {
        "controller": "codeOutputIntro",
        "content": "On the right side of the screen you can see the [define codelab_code_output]. This will show the output for your file when you press the **Run Code** button.\n"
      }, {
        "controller": "runCodeButton",
        "content": "Let's try and run this code example and see what happens.\n\nPress the **Run Code** button and watch the [define codelab_code_output] area.\n"
      }, {
        "content": "This is an example of using a programming feature called a _\"function\"_.\n\nWe'll learn more about how to use _functions_ in later lessons. For now, let's use it so we can display messages.\n"
      }, {
        "controller": "customLogMessage",
        "content": "Why don't you try changing the message that's displayed on the screen.\n\nReplace the phrase `hello, world!` with something different and then press the **Run Code** button to see the results.\n"
      }, {
        "content": "Now, let's try it again, but this time you'll write the entire example on your own.\n"
      }, {
        "controller": "freeConsoleMessage",
        "content": "Follow along with the guide to display another message in the [define codelab_code_output output] area.\n\n[snippet console_message_example]\n"
      }, {
        "start": true,
        "flags": "+OPEN_FILE",
        "content": "Practice makes perfect! Let's write another alert message!\n"
      }, {
        "controller": "repeatConsoleMessage",
        "content": "Write another alert message with any message you'd like, but this time put it at the top of the file so it runs first.\n\n[snippet repeat_message_example]\n"
      }, {
        "content": "About to finish"
      }, {
        "content": "Done"
      }],
      "snippets": {
        "console_message_example": {
          "content": "alert('coding is fun');",
          "type": "javascript"
        },
        "repeat_message_example": {
          "content": "alert('your message');",
          "type": "javascript"
        }
      },
      "resources": [],
      "definitions": {
        "codelab_code_output": {
          "id": "codelab_code_output",
          "name": "Code Output",
          "define": "The result of called code\n"
        },
        "sequentially": {
          "id": "sequentially",
          "name": "Sequentially",
          "define": "Sequentially means a sequence, normally a logical order such as a beginning to end, or numerically such as 1, 2, 3, etc...\n"
        },
        "execute": {
          "id": "execute",
          "name": "Execute",
          "define": "Another way to say when code is being run.\n"
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
      codeEditorIntro: codeEditorIntro, codeOutputIntro: codeOutputIntro, customLogMessage: customLogMessage, freeConsoleMessage: freeConsoleMessage, highlightFileBrowser: highlightFileBrowser, repeatConsoleMessage: repeatConsoleMessage, runCodeButton: runCodeButton, validation: validation, waitForMainJs: waitForMainJs
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

},{"./codeEditorIntro":1,"./codeOutputIntro":2,"./customLogMessage":3,"./freeConsoleMessage":4,"./highlightFileBrowser":5,"./lib":7,"./repeatConsoleMessage":8,"./runCodeButton":9,"./validation":10,"./waitForMainJs":11}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onEnter = onEnter;
exports.onInit = onInit;
exports.onReady = onReady;
exports.onContentChange = onContentChange;
exports.onExit = onExit;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $endIndex = void 0;

function validate(instance) {

	// let result;

	// check the working area first
	var workingArea = instance.editor.area.get({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(workingArea, _validation.validate_repeat_alert);

	// const success = 

	// console.log(workingArea);


	// const content = instance.file.content({ path: '/main.js' });
	// const result = CodeValidator.validate(content, validate_repeat_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	instance.progress.update({
		result: result,
		allow: function allow() {
			return instance.assistant.say({
				message: 'Great! Let\'s move to the next step!'
			});
		},
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });

	// determine the working area
	var content = this.file.content({ path: '/main.js' });
	$endIndex = content.length - _lib._.trimStart(content).length - 1;
}

function onInit() {
	this.editor.area({ path: '/main.js', start: 1, end: $endIndex });
}

function onReady() {
	validate(this);
}

function onContentChange(file) {
	validate(this);
}

function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

},{"./lib":7,"./validation":10}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onRunCode = onRunCode;
exports.onRunCodeAlert = onRunCodeAlert;
var controller = exports.controller = true;

function onEnter() {
	this.progress.block();
	this.screen.marker.runButton({ tr: true, offsetX: -2, offsetY: 2 });
}

function onRunCode(context) {
	this.screen.highlight.clear();
	return true;
}

function onRunCodeAlert(context, message) {

	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'Great! You can see that running this code caused an alert message to be displayed in the [define codelab_code_output output] area.'
	});
}

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var validate_alert = function validate_alert(test) {
	return test.id('alert').symbol('(').string(5, 25).symbol(')').symbol(';');
};

var validate_coding_alert = function validate_coding_alert(test) {
	return test.id('alert').symbol('(').string('coding is fun').symbol(')').symbol(';');
};

var validate_free_alert = exports.validate_free_alert = function validate_free_alert(test) {
	return test.__w$.merge(validate_alert)._n.__w$.merge(validate_coding_alert).__w$;
};

var validate_repeat_alert = exports.validate_repeat_alert = function validate_repeat_alert(test) {
	return test.__w$.merge(validate_alert)._n;
};

var validate_complete_repeat_alert = exports.validate_complete_repeat_alert = function validate_complete_repeat_alert(test) {
	return test.__w$.merge(validate_alert)._n.__w$.merge(validate_coding_alert)._n.__w$.merge(validate_alert);
};

// const validate_starting_alert = test => test
// 	.;


// export const validate_first_free_alert = test => test
// 	._w
// 	.merge(validate_h1)
// 	._n
// 	.__w
// 	.merge(validate_h3)
// 	.__w
// 	.eof();

// export const validate_insert_button = test => test
// 	._w
// 	.merge(validate_h1)
// 	._n
// 	.__w
// 	.merge(validate_h3)
// 	._n
// 	.__w
// 	.merge(validate_button)
// 	.__w
// 	.eof();

// export const validate_list = test => test
// 	._w
// 	.merge(validate_h1)
// 	._n
// 	.__w
// 	.merge(validate_h3)
// 	._n
// 	.__w
// 	.merge(validate_button)
// 	._n
// 	.__w
// 	.tag('ol')._n
// 	._t.tag('li').text('dog').close('li')._n
// 	._t.tag('li').text('cat').close('li')._n
// 	._t.tag('li').text('fish').close('li')._n
// 	.close('ol')
// 	.eof();


// export const validate_h1 = test => test

// export const validate_h3 = test => test

// export const validate_button = test => test

},{}],11:[function(require,module,exports){
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

},{}]},{},[6]);
