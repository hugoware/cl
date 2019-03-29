(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onSaveFile = onSaveFile;
exports.onReady = onReady;
var controller = exports.controller = true;

function onSaveFile() {
	this.progress.next();
	return true;
}

function onReady() {
	this.screen.marker.saveButton({ offsetX: -2, offsetY: 2, tr: true });
}

},{}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"../lib":16}],5:[function(require,module,exports){
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

},{"../lib":16}],6:[function(require,module,exports){
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
exports.onRunCode = onRunCode;
exports.onRunCodeAlert = onRunCodeAlert;

var _lib = require('./lib');

var controller = exports.controller = true;

function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 8, end: 11 });
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
	return change.isBackspace || change.isDelete || /^[0-9]+$/.test(change.data);
}

function onRunCode() {

	var input = this.editor.area.get({ path: '/main.js' });

	// make sure it's only numbers
	if (!/^[0-9]+$/.test(input)) {
		this.assistant.say({
			message: 'Make sure to only use numbers in this example!'
		});

		return false;
	}

	// if it's only zeros
	if (/^0+[1-9]$/.test(input)) {
		this.assistant.say({
			message: 'You\'ve got the right idea, but try a number that doesn\'t start with a zero'
		});

		return false;
	}

	// make sure it's long enough
	var size = _lib._.size(input);
	if (size < 5) {
		var any = size > 0;
		this.assistant.say({
			message: 'Type ' + (any ? 'some more' : 'a few') + ' numbers before pressing the **Run Code** button!'
		});

		return false;
	}

	if (size > 15) {
		;
		this.assistant.say({
			message: 'Type a few less numbers before pressing the **Run Code** button!'
		});

		return false;
	}

	return true;
}

function onRunCodeAlert(context, message) {

	this.editor.area.clear();
	this.file.readOnly({ path: '/main.js' });
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'Great! You can see the numbers you typed in are displayed in the alert message!'
	});
}

},{"./lib":16}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onContentChange = onContentChange;
exports.onInit = onInit;
exports.onRunCodeError = onRunCodeError;
exports.onRunCode = onRunCode;
exports.onRunCodeAlert = onRunCodeAlert;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $isValid = void 0;

function validate(instance) {
	var workingArea = instance.editor.area.get({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(workingArea, _validation.validate_complete_fix_number_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	$isValid = instance.progress.check({
		result: result,
		allow: function allow() {
			instance.assistant.say({
				message: 'Great! Press the **Run Code** button to see if the problem is now fixed!'
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onActivateLesson() {
	$isValid = false;
}

function onEnter() {
	this.file.allowEdit({ path: '/main.js' });
}

function onContentChange() {
	validate(this);

	if ($isValid) return;
	this.progress.block();
}

function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 0, end: 14 });
	this.editor.cursor({ path: '/main.js', index: 13 });
	validate(this);
}

function onRunCodeError() {
	this.progress.allow();
	this.assistant.say({
		message: 'Seems like there\'s still a problem with this code. Keep trying until you fix the [define syntax_error].'
	});
}

function onRunCode() {
	return true;
}

function onRunCodeAlert() {
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'That did it! You fixed the [define syntax_error]!\n\nThe second `)` is very important when you use functions like `alert`!'
	});
}

},{"./lib":16,"./validation":20}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onContentChange = onContentChange;
exports.onInit = onInit;
exports.onRunCodeError = onRunCodeError;
exports.onRunCode = onRunCode;
exports.onRunCodeAlert = onRunCodeAlert;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $isValid = void 0;
var $isShowingHelp = void 0;

function validate(instance) {
	var workingArea = instance.editor.area.get({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(workingArea, _validation.validate_complete_fix_string_alert);

	// update validation
	if ($isShowingHelp) instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	$isValid = false;
	instance.progress.check({
		result: result,
		allow: function allow() {
			$isValid = true;
			instance.assistant.say({
				message: 'Great! Press the **Run Code** button to see if the problem is now fixed!'
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onActivateLesson() {
	$isValid = false;
	$isShowingHelp = false;
}

function onEnter() {
	var _this = this;

	this.file.allowEdit({ path: '/main.js' });
	this.delay(15000, function () {
		$isShowingHelp = true;
		validate(_this);
	});
}

function onContentChange() {
	this.progress.block();
	validate(this);
}

function onInit() {
	this.progress.block();
	this.editor.area({ path: '/main.js', start: 0, end: 18 });
	this.editor.cursor({ path: '/main.js', index: 16 });
	validate(this);
}

function onRunCodeError() {
	this.progress.allow();
	this.assistant.say({
		message: 'Seems like there\'s still a problem with this code. Keep trying until you fix the [define syntax_error].'
	});
}

function onRunCode() {
	return true;
}

function onRunCodeAlert() {
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'There we go! You fixed the [define syntax_error]!\n\nThis example also required that we include the second `\'` as well as the `)`!'
	});
}

},{"./lib":16,"./validation":20}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
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

function onActivateLesson() {
	$alertCount = 0;
	$isValid = false;
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
			message: 'That\'s it! The second alert message has been displayed showing the numbers you just added!',
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

},{"./lib":16,"./validation":20}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onRunCodeAlert = onRunCodeAlert;
exports.onInit = onInit;
exports.onReady = onReady;
exports.onBeforeContentChange = onBeforeContentChange;
exports.onContentChange = onContentChange;
exports.onExit = onExit;
exports.onRunCode = onRunCode;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $isValid = void 0;

function validate(instance) {
	var content = instance.editor.area.get({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(content, _validation.validate_free_string_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	$isValid = instance.progress.check({
		result: result,
		allow: function allow() {
			instance.assistant.say({
				message: 'Looks good! Press the **Run Code** button to see what happens!'
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onActivateLesson() {
	$isValid = false;
}

function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });

	// adjust the file
	var content = '\n\n\n' + this.file.content({ path: '/main.js' });
	$state.endIndex = content.length - _lib._.trimStart(content).length - 1;

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: content
	});
}

function onRunCodeAlert(context, message) {

	this.progress.allow();
	this.assistant.say({
		message: 'Wonderful! Using [define javascript_string s] is pretty easy and allows you to have even better messages!',
		emote: 'happy'
	});
}

function onInit() {
	this.editor.area({ path: '/main.js', start: 0, end: $state.endIndex });
}

function onReady() {
	validate(this);
}

function onBeforeContentChange(change) {
	if (change.hasNewLine) return false;
	return true;
}

function onContentChange(file) {
	validate(this);

	if ($isValid) return;
	this.progress.block();
	this.assistant.revert();
}

function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

function onRunCode() {
	if (!$isValid) {
		this.assistant.revert();
		return false;
	}

	return true;
}

},{"./lib":16,"./validation":20}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

var _aboutSaving = require('./aboutSaving');

var aboutSaving = _interopRequireWildcard(_aboutSaving);

var _codeEditorIntro = require('./codeEditorIntro');

var codeEditorIntro = _interopRequireWildcard(_codeEditorIntro);

var _codeOutputIntro = require('./codeOutputIntro');

var codeOutputIntro = _interopRequireWildcard(_codeOutputIntro);

var _customLogMessage = require('./customLogMessage');

var customLogMessage = _interopRequireWildcard(_customLogMessage);

var _fixNumberError = require('./fixNumberError');

var fixNumberError = _interopRequireWildcard(_fixNumberError);

var _fixStringError = require('./fixStringError');

var fixStringError = _interopRequireWildcard(_fixStringError);

var _freeConsoleMessage = require('./freeConsoleMessage');

var freeConsoleMessage = _interopRequireWildcard(_freeConsoleMessage);

var _freeStringAlert = require('./freeStringAlert');

var freeStringAlert = _interopRequireWildcard(_freeStringAlert);

var _highlightFileBrowser = require('./highlightFileBrowser');

var highlightFileBrowser = _interopRequireWildcard(_highlightFileBrowser);

var _insertNumberError = require('./insertNumberError');

var insertNumberError = _interopRequireWildcard(_insertNumberError);

var _insertStringAlert = require('./insertStringAlert');

var insertStringAlert = _interopRequireWildcard(_insertStringAlert);

var _insertStringError = require('./insertStringError');

var insertStringError = _interopRequireWildcard(_insertStringError);

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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
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
      "description": "An introduction to programming with JavaScript",
      "lesson": [{
        "mode": "overlay",
        "title": "Introduction to Programming",
        "content": "Welcome to your first lesson on basic computer programming!\n\nAs you work through this lesson you will be asked to complete certain tasks before you can move onto the next step.\n"
      }, {
        "content": "Computer programming is a way of giving computers instructions. These instructions are typically known as _\"code\"_.\n\n[image code-intro.jpg frame]\n\nYou'll also sometimes hear people refer to the task of programming as _\"coding\"_. For the most part the two activities are one in the same.\n"
      }, {
        "content": "When you write code, you're writing instructions that tell a computer what it's supposed to do. A computer isn't able to think on its own, so you have to be very specific.\n\nCode in itself is a series of **[define code_condition conditions]** and **[define code_action actions]** that solve a problem.\n"
      }, {
        "content": "A **[define code_condition]** checks information and decides what a computer program should do next.\n\nFor example, a program that makes sure a username and password is correct is checking for a **[define code_condition]**. The result of that condition can lead to different actions depending on _if the password is correct or not_.\n"
      }, {
        "content": "An **[define code_action]** is the work that a computer program does. As with the previous example, if the user's password was incorrect, the **[define code_action action]** would be to show an error message.\n\nIf the user's password was correct, then the **action** would be to allow them access to the system.\n"
      }, {
        "content": "Let's look at a simple example written in a \"human readable\" format."
      }, {
        "content": "[snippet conditions_simple]\n\nYou can probably figure out what these instructions are trying to accomplish by just reading through the steps in the order they are shown.\n"
      }, {
        "content": "[snippet conditions_code]\n\nProgramming is very similar, but instead of using natural language, you use a programming language with special rules.\n"
      }, {
        "content": "In this example, the **[define code_condition condition]** that is being checked is if the `birthday` is the same as `today`. The result of this condition decides which of the **[define code_action actions]** should be performed.\n\n[snippet conditions_code highlight:4,18]\n"
      }, {
        "content": "If the **condition** is _true_, meaning `birthday` is the same as `today`, then the program would perform the first of the two **actions** and say the message \"Happy birthday!\".\n\n[snippet conditions_code highlight:27,23]\n"
      }, {
        "content": "If `birthday` did not match `today`, the **[define code_condition condition]** would be _false_ and the program would use the alternate **action** and say the message \"Good morning!\" instead.\n\n[snippet conditions_code highlight:61,21]\n"
      }, {
        "content": "In this series we're going to be learning how to use [define javascript].\n\n[define javascript] is a popular programming language that's used in a very large variety of applications, games, websites, and more.\n"
      }, {
        "content": "[define javascript] has rules about the spelling, grammar, and symbols used when writing code.\n\nThis is also known as the [define syntax], or basically the arrangement of words and symbols to create code that can be understood by the computer.\n\n[snippet conditions_code highlight:3,1|13,3|22,1|24,1|30,2|47,3|51,1|58,1|64,2|79,3|83,1]\n"
      }, {
        "content": "Another notable rule in [define javascript] is [define case_sensitive Case Sensitivity]. Being [define case_sensitive case sensitive] means that if letters do not match in their uppercase or lowercase forms, then they are not considered the same.\n\nFor example, the uppercase letter `A` is not the same as the lowercase letter `a`. \n\nThis is very important to remember when you write code since having the wrong case can cause big errors.\n"
      }, {
        "mode": "popup",
        "content": "There's a lot to learn when it comes to programming, so in this lesson we're going to focus on using the [define codelab_editor] to display some messages, and then fix a simple code error.\n"
      }, {
        "mode": "popup",
        "content": "Alright! Let's jump into writing some code and see what happens!\n"
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
        "content": "This is an example of using a programming feature called a _\"function\"_.\n\nWe'll learn more about how to use _functions_ later. For now, let's use it so we can display messages.\n"
      }, {
        "controller": "customLogMessage",
        "content": "Why don't you try changing the message that's displayed on the screen.\n\nReplace the current numbers with a different set of numbers and then press the **Run Code** button to see the results.\n"
      }, {
        "content": "Now, let's try it again, but this time you'll write the entire example on your own.\n"
      }, {
        "controller": "freeConsoleMessage",
        "content": "Write another alert message with any number you'd like. Use the example below to help remind you the correct [define syntax l] to use\n\n[snippet console_message_example]\n"
      }, {
        "content": "Practice makes perfect! Let's write another alert message!\n"
      }, {
        "controller": "repeatConsoleMessage",
        "content": "Write another alert message with any numbers you'd like, but this time put it at the top of the file so it runs first.\n\nIf you're stuck, look at the other two `alert` examples for guidance.\n"
      }, {
        "mode": "overlay",
        "content": "So far we've shown several alert messages that display numbers. Let's try something a little different and display a message that uses words instead.\n"
      }, {
        "content": "This time, instead of using a [define javascript_number], we're going to use some text. In [define javascript] this is known as a [define javascript_string].\n\n[snippet string_example]\n\nA [define javascript_string] is a series of characters. [define javascript_string s] are useful when you're working with data that uses letters and numbers, such as names, descriptions, or other blocks of text.\n"
      }, {
        "content": "You'll notice that the [define javascript_string] example below is written a little differently than the [define javascript_number p] we were using in the examples before.\n\n[snippet string_example highlight:0,1|18,1]\n\nThe example above has [define javascript_single_quote s] that surround all of the letters. This is very important when you're writing strings.\n"
      }, {
        "mode": "popup",
        "content": "You'll learn a lot more about [define javascript_string s] in later lessons, but for now let's create a few messages that use [define javascript_string s].\n"
      }, {
        "controller": "insertStringAlert",
        "content": "Follow along with the example and write a new `alert` message, but using a [define javascript_string] instead.\n\n[snippet insert_string_example]\n"
      }, {
        "controller": "freeStringAlert",
        "content": "Let's try that one more time, but this time enter any message you'd like!\n\nFollow along with the instructions or use the previous example as a guide on how to add another `alert` message.\n"
      }, {
        "content": "So far all of the code we've written has run without any issues, but sometimes you may type something incorrectly which could cause an error.\n"
      }, {
        "controller": "insertNumberError",
        "content": "I just added some code to the top of the file that has an error in it. Press the **Run Code** button so we can see what happens when code isn't formatted correctly.\n"
      }, {
        "content": "In this case, we have an example of a [define syntax_error]. A Syntax Error means that the code can't be understood by the engine running it.\n"
      }, {
        "controller": "fixNumberError",
        "content": "Try and fix this code error and then press **Run Code** when you're finished.\n"
      }, {
        "controller": "insertStringError",
        "content": "Let's try this one more time, but this time we're going to use a [define javascript_string]. I've just added a new error to the top of the file.\n"
      }, {
        "controller": "fixStringError",
        "content": "Try and fix this code error and then press **Run Code** when you're finished.\n\nI'm not going to show any hints right away, but if you get stuck I'll jump in and help you.\n"
      }, {
        "mode": "overlay",
        "content": "Great work! There's still a lot to learn, but let's end this lesson by reviewing what we've covered so far.\n"
      }, {
        "show": 4,
        "title": "What does Syntax mean for a programming language?",
        "explain": "[define syntax] defines the arrangement of words and symbols that helps a computer understand instructions written in a programming language.\n",
        "choices": ["The rules for the arrangement of words and symbols", "The taxed money for creating computer code", "The popularity of a computer language", "The maximum number of lines of code in a file"]
      }, {
        "show": 4,
        "title": "What does Case Sensitivity mean for a programming language?",
        "explain": "[define case_sensitive Case Sensitivity] means that an uppercase form of a letter is not the same as the lowercase form of a letter.\n",
        "choices": ["The uppercase form of a letter is **NOT** the same as the lowercase form", "The code file has too many curly braces in it", "There are too many numbers in a code file", "The **condition** for some code has a \"just in case\" action"]
      }, {
        "show": 4,
        "title": "What is the name of the programming language we're learning in this lesson?",
        "explain": "[define javascript] is a very popular language that's used for programming everything from websites, mobile, apps, games and more.\n",
        "choices": ["JavaScript", "Visual Basic", "QBasic", "SQL"]
      }, {
        "show": 4,
        "title": "What is an Exception Message?",
        "explain": "In most cases, when a program encounters an error that cannot be recovered from then it will display an [define exception_message] with details about the error. \n",
        "choices": ["A message about an error a program cannot recover from", "A message with remaining memory for a computer", "A message to warn about a disconnected keyboard", "A warning message before deleting files on your computer"]
      }, {
        "show": 4,
        "title": "What is a Syntax Error?",
        "explain": "A [define syntax_error] is an error when the code cannot be understood by the program. This is normally from code that has been input incorrectly or is missing required commands.\n",
        "choices": ["An error when code can't be understood by the computer", "An error when the computer is powered off", "An error connecting to the Internet", "An error when a computer runs out of memory"]
      }, {
        "mode": "popup",
        "content": "Way to go! You've finished this lesson!\n"
      }, {
        "content": "At this point all files are now unlocked and you're free to make changes to anything in this project. You can play with the [define javascript] you've learned, or just try out new things.\n"
      }, {
        "content": "If you'd like to try this lesson again, you can start over by using the \"Reset Lesson\" button from the home page of this site.\n\n[image reset-lesson.jpg]\n"
      }, {
        "content": "If you'd like to share what you've created with others, you can use the **Share** button and send them a link so they can try it out for themselves.\n\n[image share-project.jpg]\n\n[silent] _This button will appear after the lesson as been completed._\n"
      }, {
        "controller": "aboutSaving",
        "content": "The changes you've made so far haven't been saved yet. Make sure to press the \"Save Changes\" button before you end this lesson.\n\nIf you forget to save your files and try and close a project, the website will display a message and give you a chance to save your work.\n"
      }, {
        "emote": "happy",
        "content": "Great work, and I'll see you again for **Lesson 2**\n"
      }],
      "snippets": {
        "base_example": {
          "content": "if (birthday === today) {\n\talert('Happy birthday!');\n}\nelse {\n\talert('Good morning!');\n}",
          "type": "javascript"
        },
        "conditions_code": {
          "content": "if (birthday === today) {\n\tsay('Happy birthday!');\n}\nelse {\n\tsay('Good morning!');\n}",
          "type": "javascript"
        },
        "conditions_simple": {
          "content": "if  birthday is  today\n\tsay  Happy birthday!\n\nelse\n\tsay  Good morning!\n",
          "type": "txt"
        },
        "console_message_example": {
          "content": "alert(12345);",
          "type": "javascript"
        },
        "insert_string_example": {
          "content": "alert('JavaScript is fun!');",
          "type": "javascript"
        },
        "repeat_message_example": {
          "content": "alert(98765);",
          "type": "javascript"
        },
        "string_example": {
          "content": "'JavaScript is fun'",
          "type": "javascript"
        }
      },
      "resources": [{
        "height": 513,
        "width": 1340,
        "type": "jpg",
        "path": "code-intro.jpg"
      }, {
        "height": 458,
        "width": 838,
        "type": "jpg",
        "path": "reset-lesson.jpg"
      }, {
        "height": 170,
        "width": 555,
        "type": "jpg",
        "path": "share-project.jpg"
      }],
      "definitions": {
        "syntax_error": {
          "id": "syntax_error",
          "name": "Syntax Error",
          "define": "Code that doesn't follow the rules of the language and cannot be understood by the engine running it."
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
        "javascript_string": {
          "id": "javascript_string",
          "name": "String",
          "plural": "Strings",
          "define": "Series of characters\n"
        },
        "exception_message": {
          "id": "exception_message",
          "name": "Exception Message",
          "define": "An unrecoverable error\n"
        },
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
        "code_condition": {
          "id": "code_condition",
          "name": "Condition",
          "define": "Something code is testing\n"
        },
        "code_action": {
          "id": "code_action",
          "name": "Action",
          "define": "Something code is doing\n"
        },
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
        },
        "syntax": {
          "id": "syntax",
          "name": "Syntax",
          "plural": "Syntaxes",
          "define": "The arrangement of words and symbols to create well-formed code that can be understood by the computer.\n"
        },
        "case_sensitive": {
          "id": "case_sensitive",
          "name": "Case Sensitive",
          "define": "Meaning that the uppercase form of a letter is not considered to be the same as the lowercase form of a letter.\nSimply put, `A` is not the same as `a` when checking for case sensitivity."
        },
        "codelab_editor": {
          "id": "codelab_editor",
          "name": "Code Editor",
          "define": "The CodeLab editing area\n"
        },
        "javascript_number": {
          "id": "javascript_number",
          "name": "Number",
          "plural": "Numbers",
          "define": "Number value\n"
        },
        "javascript_single_quote": {
          "id": "javascript_single_quote",
          "name": "Single Quote",
          "plural": "Single Quotes",
          "define": "True/false value\n"
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
      aboutSaving: aboutSaving, codeEditorIntro: codeEditorIntro, codeOutputIntro: codeOutputIntro, customLogMessage: customLogMessage, fixNumberError: fixNumberError, fixStringError: fixStringError, freeConsoleMessage: freeConsoleMessage, freeStringAlert: freeStringAlert, highlightFileBrowser: highlightFileBrowser, insertNumberError: insertNumberError, insertStringAlert: insertStringAlert, insertStringError: insertStringError, repeatConsoleMessage: repeatConsoleMessage, runCodeButton: runCodeButton, validation: validation, waitForMainJs: waitForMainJs
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) {
        _this.controllers[key] = ref;

        // handle resets
        if (ref.onActivateLesson) ref.onActivateLesson.call(ref, _this);
      }
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(console1Lesson, [{
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

      if (controller.invoke) return (_controller$invoke = controller.invoke).call.apply(_controller$invoke, [this, action].concat(args));

      return controller[action].apply(this, args);
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

  return console1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('console_1', console1Lesson);

},{"./aboutSaving":1,"./codeEditorIntro":2,"./codeOutputIntro":3,"./controllers/waitForFile":4,"./controllers/waitForTab":5,"./customLogMessage":6,"./fixNumberError":7,"./fixStringError":8,"./freeConsoleMessage":9,"./freeStringAlert":10,"./highlightFileBrowser":11,"./insertNumberError":13,"./insertStringAlert":14,"./insertStringError":15,"./lib":16,"./repeatConsoleMessage":17,"./runCodeButton":18,"./validation":20,"./waitForMainJs":21}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onReady = onReady;
exports.onRunCodeError = onRunCodeError;
exports.onRunCode = onRunCode;
var controller = exports.controller = true;

function onEnter() {
	this.progress.block();

	var current = this.file.content({ path: '/main.js' });
	this.file.readOnly({ path: '/main.js' });

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: '\n\nalert(12345\n\n' + current

	});
}

function onReady() {
	this.editor.cursor({ path: '/main.js', index: 13 });
}

function onRunCodeError() {
	this.progress.allow();
	this.assistant.say({
		message: 'This is an [define exception_message]. This means that the code encountered a problem it couldn\'t recover from!'
	});
}

function onRunCode() {
	return true;
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onRunCodeAlert = onRunCodeAlert;
exports.onInit = onInit;
exports.onReady = onReady;
exports.onBeforeContentChange = onBeforeContentChange;
exports.onContentChange = onContentChange;
exports.onExit = onExit;
exports.onRunCode = onRunCode;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $isValid = void 0;

function validate(instance) {
	var content = instance.editor.area.get({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(content, _validation.validate_insert_string_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	$isValid = instance.progress.check({
		result: result,
		allow: function allow() {
			instance.assistant.say({
				message: 'Perfect! Press the **Run Code** button to see what happens!'
			});
		},

		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onActivateLesson() {
	$isValid = false;
}

function onEnter() {
	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/main.js' });

	// adjust the file
	var content = this.file.content({ path: '/main.js' });
	var lines = _lib._.compact(_lib._.trim(content).split(/\n/));
	var last = _lib._.last(lines);

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: '\n\n\n' + last + '\n\n'
	});
}

function onRunCodeAlert(context, message) {

	this.progress.allow();
	this.assistant.say({
		message: 'That\'s it! You just displayed a new alert message, but this time it uses text instead of numbers!',
		emote: 'happy'
	});
}

function onInit() {
	this.editor.area({ path: '/main.js', start: 0, end: 2 });
}

function onReady() {
	validate(this);
}

function onBeforeContentChange(change) {
	if (change.hasNewLine) return false;
	return true;
}

function onContentChange(file) {
	validate(this);

	if ($isValid) return;
	this.progress.block();
	this.assistant.revert();
}

function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

function onRunCode() {
	if (!$isValid) {
		this.assistant.revert();
		return false;
	}

	return true;
}

},{"./lib":16,"./validation":20}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onEnter = onEnter;
exports.onReady = onReady;

var _lib = require('./lib');

var controller = exports.controller = true;

function onEnter() {

	var current = this.file.content({ path: '/main.js' });
	this.file.readOnly({ path: '/main.js' });

	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: '\n\nalert(\'fix me!\n\n\n' + _lib._.trimStart(current)

	});
}

function onReady() {
	this.editor.cursor({ path: '/main.js', index: 16 });
}

},{"./lib":16}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onReset = onReset;
exports.onEnter = onEnter;
exports.onInit = onInit;
exports.onReady = onReady;
exports.onContentChange = onContentChange;
exports.onRunCodeAlert = onRunCodeAlert;
exports.onRunCodeEnd = onRunCodeEnd;
exports.onRunCode = onRunCode;
exports.onExit = onExit;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

var $endIndex = void 0;
var $hasShownFirstAlert = void 0;
var $allowRunCode = void 0;

function validate(instance) {

	// check the working area first
	var workingArea = instance.editor.area.get({ path: '/main.js' });
	var result = _lib.CodeValidator.validate(workingArea, _validation.validate_repeat_alert);

	// update validation
	instance.editor.hint.validate({ path: '/main.js', result: result });

	// update progress
	$allowRunCode = false;
	instance.progress.check({
		result: result,
		allow: function allow() {
			$allowRunCode = true;
			instance.assistant.say({
				message: 'Looks good! Press the **Run Code** button and then click **OK** for each of the alert messages!'
			});
		},
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onActivateLesson() {
	$endIndex = undefined;
	$hasShownFirstAlert = undefined;
	$allowRunCode = undefined;
}

function onReset() {
	this.progress.block();
	this.assistant.revert();
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
	this.editor.area({ path: '/main.js', start: 0, end: $endIndex });
}

function onReady() {
	validate(this);
}

function onContentChange(file) {
	this.progress.block();
	validate(this);
}

function onRunCodeAlert() {
	if (!$hasShownFirstAlert) {
		$hasShownFirstAlert = true;
		this.assistant.say({
			message: 'There\'s the first alert message! Continue pressing **OK** to finish running this code to the end of the file.',
			emote: 'happy'
		});
	}
}

function onRunCodeEnd() {
	this.progress.allow();
	this.assistant.say({
		message: 'Wonderful! You can see that each line of code was run in the order that it was added to the file.',
		emote: 'happy'
	});
}

function onRunCode() {
	$hasShownFirstAlert = false;
	return !!$allowRunCode;
}

function onExit() {
	this.file.readOnly({ path: '/main.js' });
}

},{"./lib":16,"./validation":20}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.findBoundary = findBoundary;
exports.simplify = simplify;
exports.stringRange = stringRange;
exports.oxfordize = oxfordize;
exports.pluralize = pluralize;
exports.similarity = similarity;

var _lib = require('./lib');

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

},{"./lib":16}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validate_complete_fix_string_alert = exports.validate_complete_fix_number_alert = exports.validate_free_string_alert = exports.validate_insert_string_alert = exports.validate_complete_repeat_alert = exports.validate_free_alert = exports.validate_repeat_alert = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var as_number = function as_number(test) {
	return test.literal(/^[0-9]+/, 'Expected a number', function (match) {

		// make sure it doesn't start with a zero
		if (/^0[0-9]+/.test(match)) return 'Don\'t use a number that starts with a zero';

		// check the number count
		var count = _lib._.size(match);
		var error = (0, _utils.stringRange)(count, 5, 10, 'number', 'numbers');
		if (error) return error;

		return error;
	});
};

var validate_number_alert = function validate_number_alert(test) {
	return test.func('alert').symbol('(').merge(as_number).symbol(')').symbol(';');
};

var validate_coding_alert = function validate_coding_alert(test) {
	return test.func('alert').symbol('(').merge(as_number).symbol(')').symbol(';');
};

var validate_insert_string = function validate_insert_string(test) {
	return test.func('alert').symbol('(').string('JavaScript is fun').symbol(')').symbol(';');
};

var validate_free_string = function validate_free_string(test) {
	return test.func('alert').symbol('(').string(5, 25).symbol(')').symbol(';');
};

var validate_fix_number = function validate_fix_number(test) {
	return test.func('alert').symbol('(').number(12345).symbol(')').symbol(';');
};

var validate_fix_string = function validate_fix_string(test) {
	return test.func('alert').symbol('(').string('fix me!').symbol(')').symbol(';');
};

var validate_repeat_alert = exports.validate_repeat_alert = function validate_repeat_alert(test) {
	return test.__w$.merge(validate_number_alert)._n.__w$.eof();
};

var validate_free_alert = exports.validate_free_alert = function validate_free_alert(test) {
	return test.__w$.merge(validate_number_alert)._n.__w$.merge(validate_coding_alert).__w$.eof();
};

var validate_complete_repeat_alert = exports.validate_complete_repeat_alert = function validate_complete_repeat_alert(test) {
	return test.__w$.merge(validate_number_alert)._n.__w$.merge(validate_coding_alert)._n.__w$.merge(validate_number_alert).__w$.eof();
};

var validate_insert_string_alert = exports.validate_insert_string_alert = function validate_insert_string_alert(test) {
	return test.__w$.merge(validate_insert_string)._n.__w$.eof();
};

var validate_free_string_alert = exports.validate_free_string_alert = function validate_free_string_alert(test) {
	return test.__w$.merge(validate_free_string)._n.__w$.eof();
};

var validate_complete_fix_number_alert = exports.validate_complete_fix_number_alert = function validate_complete_fix_number_alert(test) {
	return test.__w$.merge(validate_fix_number)._n.__w$.eof();
};

var validate_complete_fix_string_alert = exports.validate_complete_fix_string_alert = function validate_complete_fix_string_alert(test) {
	return test.__w$.merge(validate_fix_string)._n.__w$.eof();
};

},{"./lib":16,"./utils":19}],21:[function(require,module,exports){
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

},{}]},{},[12]);
