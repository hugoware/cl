(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;

var $color = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		test.lines(2);
		(0, _validation.declare_number)(test);
		test.lines(2);
		(0, _validation.declare_string)(test);
		test.lines(2);
		(0, _validation.alert_messages)(test);
		test.lines(2);

		this.state.selectedColor = test.pull('color');
		this.state.selectedAge = test.pull('num');
	},
	onValid: function onValid() {
		this.progress.next();
	}
});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":14,"./validation":15}],2:[function(require,module,exports){
"use strict";

},{}],3:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],4:[function(require,module,exports){
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

},{"../lib":12}],5:[function(require,module,exports){
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

},{"../lib":12}],6:[function(require,module,exports){
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

},{"../lib":12}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = waitForValidation;

var _lib = require('../lib');

function waitForValidation(obj, config) {
	var state = {};
	var validation = {};

	// standard validaton function
	function validate(instance) {
		var content = 'area' in config ? instance.editor.area.get({ path: config.file }) : instance.file.content({ path: config.file });

		// get the correct validator
		var validator = void 0;

		// check for a named validator
		if (config.validator === 'code' || /\.js$/.test(config.file)) validator = _lib.CodeValidator;else if (config.validator === 'html' || /\.html?$/.test(config.file)) validator = _lib.HtmlValidator;else if (config.validator === 'css' || /\.css$/.test(config.file)) validator = _lib.CssValidator;

		// perform the validaton
		var func = function func(test) {
			config.validation.call(instance, test, content);
			return test;
		};

		// perform the validation
		var args = [content].concat(func);
		var result = validator.validate.apply(null, args);

		// update the result
		_lib._.assign(validation, result);

		// update validation
		instance.editor.hint.validate({ path: config.file, result: result });

		// update progress
		var wasValid = state.isValid;
		state.isValid = instance.progress.check({
			result: result,
			deny: instance.assistant.revert,
			always: config.silent ? _lib._.noop : instance.sound.notify

			// when allowing the next step
			// allow: () => {


			// 	// config.onValid();
			// 	// instance.assistant.say({
			// 		// message: successMessage `Perfect! Press the **Run Code** button to see what happens!`
			// 		// message: config.successMessage // `Perfect! Press the **Run Code** button to see what happens!`
			// 	// });
			// }
		});

		// switched to invalid
		if (wasValid && !state.isValid && config.onInvalid) config.onInvalid.call(instance);

		// switched to valid
		if (!wasValid && state.isValid && config.onValid) config.onValid.call(instance);
	}

	// setup the controller
	_lib._.assign(obj, {
		controller: true,
		state: state,
		validation: validation,

		onEnter: function onEnter() {
			this.editor.focus();
			this.progress.block();
			this.file.allowEdit({ path: config.file });

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (config.onEnter) config.onEnter.apply(this, args);
		},
		onInit: function onInit() {
			var _this = this;

			if (!!config.disableHint || !!config.disableHints) this.editor.hint.disable();

			if ('area' in config) this.editor.area({ path: config.file, start: config.area.start, end: config.area.end });

			if ('cursor' in config) {
				this.editor.focus();
				setTimeout(function () {
					_this.editor.cursor({ path: config.file, index: config.cursor });
				}, 10);
			}

			validate(this);
		},
		onActivate: function onActivate() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (config.onActivate) return config.onActivate.apply(this, args);
		},
		onRunCode: function onRunCode() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			if (config.onRunCode) return config.onRunCode.apply(this, args);
		},
		onRunCodeEnd: function onRunCodeEnd() {
			for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				args[_key4] = arguments[_key4];
			}

			if (config.onRunCodeEnd) return config.onRunCodeEnd.apply(this, args);
		},
		onReset: function onReset() {
			validate(this);

			if (state.isValid) return;
			this.progress.block();
			this.assistant.revert();
		},
		onContentChange: function onContentChange(file) {
			validate(this);

			if (state.isValid) return;
			this.progress.block();
			this.assistant.revert();
		},
		onExit: function onExit() {
			this.file.readOnly({ path: config.file });
			this.editor.hint.enable();

			for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				args[_key5] = arguments[_key5];
			}

			if (config.onExit) config.onExit.apply(this, args);
		}
	}, config.extend);

	// extra logic as required
	if (config.init) config.init.call(obj, obj);
}

},{"../lib":12}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;

var $value = void 0;

(0, _waitForValidation2.default)(module.exports, {

	cursor: 3,

	file: '/main.js',

	validation: function validation(test, code) {

		test.lines(2);
		(0, _validation.declare_number)(test);
		test.lines(2);

		$value = test.pull('num', 0);
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That\'s correct! You just created a [define code_variable l] called `age` that has the value of `' + $value + '`!',
			emote: 'happy'
		});
	}
});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":14,"./validation":15}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;

var $color = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		test.lines(2);
		(0, _validation.declare_number)(test);
		test.lines(2);
		(0, _validation.declare_string)(test);
		test.lines(2);

		$color = test.pull('color');
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Fantastic! Now you\'ve created a [define code_variable l] called `color`. This [define code_variable l] is a [define javascript_string l] with the value `"' + $color + '"`!',
			emote: 'happy'
		});
	}
});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":14,"./validation":15}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivate = onActivate;
exports.onEnter = onEnter;
exports.onRunCode = onRunCode;
exports.onRunCodeAlert = onRunCodeAlert;

var _lib = require('./lib');

var controller = exports.controller = true;

var $success = void 0;

function onActivate() {
	$success = false;
}

function onEnter() {
	this.progress.block();
}

function onRunCode() {
	$success = false;
	this.progress.block();
	return true;
}

function onRunCodeAlert(runner) {

	var expects = [_lib._.toString(this.state.selectedAge), _lib._.toString(this.state.selectedColor)];

	var remains = _lib._.difference(expects, runner.alerts);
	$success = remains.length === 0;

	if ($success) {
		this.progress.allow();
		this.assistant.say({
			message: 'That did it! Each of the messages were displayed as you expected, but it used the data found inside of each [define code_variable l].',
			emote: 'happy'
		});
	}
}

},{"./lib":12}],11:[function(require,module,exports){
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

var _alertMessages = require('./alertMessages');

var alertMessages = _interopRequireWildcard(_alertMessages);

var _alertNumber = require('./alertNumber');

var alertNumber = _interopRequireWildcard(_alertNumber);

var _assignExisting = require('./assignExisting');

var assignExisting = _interopRequireWildcard(_assignExisting);

var _declareNumber = require('./declareNumber');

var declareNumber = _interopRequireWildcard(_declareNumber);

var _declareString = require('./declareString');

var declareString = _interopRequireWildcard(_declareString);

var _displayAlerts = require('./displayAlerts');

var displayAlerts = _interopRequireWildcard(_displayAlerts);

var _updateAlerts = require('./updateAlerts');

var updateAlerts = _interopRequireWildcard(_updateAlerts);

var _validation = require('./validation');

var validation = _interopRequireWildcard(_validation);

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
var codeVariablesBasicsLesson = function () {

  // setup the lesson
  function codeVariablesBasicsLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, codeVariablesBasicsLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Using Variables",
      "type": "code",
      "description": "An introduction to using variables in JavaScript",
      "lesson": [{
        "mode": "overlay",
        "title": "Using Variables",
        "content": "In this lesson we're going to start learning about a concept found in programming languages called [define code_variable ls].\n"
      }, {
        "content": "[define code_variable s] allow you to store information in the programs you create. You can also access the information stored in [define code_variable sl] and use it in a variety of ways.\n"
      }, {
        "content": "[define code_variable s] can be a little difficult to understand at first, so let's walk through a scenario that might help it make sense.\n"
      }, {
        "content": "[image unlabeled-boxes.png]\n\nA [define code_variable l] is like a box. You can put something inside of a box and it'll be stored inside.\n\nIf you open up the box later, whatever you put inside the box will still be there.\n"
      }, {
        "content": "[image labeled-boxes.png]\n\nHowever, having several boxes that all look the same is difficult to organize. That's why it's a good idea to label each box with a meaningful name.\n\nThe label might not represent *exactly* what's in a box, but it does give you a general idea of what might be inside.\n"
      }, {
        "content": "[image open-boxes.png]\n\nEach [define code_variable l] you create in [define javascript] is given a name. This is much like a label on a box.\n\nHaving a good name will make it easier to understand what's inside of a [define code_variable l] while you write code.\n"
      }, {
        "content": "[image changed-boxes.png]\n\nJust like with a box, you can change what's been placed inside.\n\nKeep in mind that it's best to make sure that whatever is inside of a box matches the label that is used.\n"
      }, {
        "content": "[image weird-box.png]\n\nImagine how confusing it would be if you opened a box labeled _\"fruit\"_ only to have a cat sitting inside.\n\nThis is also true for [define code_variable ls] in [define javascript]. Having good names that represent what's inside of a [define code_variable l] will make understanding code much easier.\n"
      }, {
        "content": "When you create a new [define code_variable l] in [define javascript] it's typically referred to as \"declaring a variable\".\n\nThat said, let's look at an example of declaring a [define code_variable l] in [define javascript]\n"
      }, {
        "content": "At the start of this code is the [define javascript_keyword l] `let`. This identifies that the following code will be declaring a new variable.\n\n[snippet declare_variable highlight:0,3]\n\n[note] You might see the [define javascript_keyword ls] `const` or `var` in code.  Each of these [define javascript_keyword ls] have their own purposes, but for the sake of simplicity CodeLab lessons will always use the `let` [define javascript_keyword l].\n"
      }, {
        "content": "Next is the [define code_variable l] name. As mentioned before, it's important that the name you use makes sense for the contents that go inside.\n\n[snippet declare_variable highlight:4,6]\n\nIn this example, the [define code_variable l] name is `animal` since we're expecting to hold the phrase *\"dog\"*.\n"
      }, {
        "content": "After the [define code_variable l] name is an `=`. This marks where the \"value\" of the [define code_variable l] will begin.\n\n[snippet declare_variable highlight:11,1]\n"
      }, {
        "content": "The code to the right of the `=` is the \"value\". It's what is stored inside of the [define code_variable l]. In this case, it's the [define javascript_string l] of characters *\"dog\"*.\n\n[snippet declare_variable highlight:13,5]\n\nIf this were a box from the earlier example, the \"value\" is what is being placed inside of the box.\n"
      }, {
        "content": "Finally, there is a `;`. This ends the code statement.\n\n[snippet declare_variable highlight:18,1]\n\nYou'll see the `;` used in many different places in [define javascript].\n"
      }, {
        "mode": "popup",
        "content": "Now that we understand some of the basics for declaring variables, let's give it a try and see what happens.\n"
      }, {
        "waitForFile": "/main.js",
        "content": "Open the file named `main.js` by [define double_click double-clicking] on the file in the [define file_browser].\n"
      }, {
        "controller": "declareNumber",
        "content": "Follow along with the instructions to declare an number variable named `age`.\n\n[snippet declare_number]\n"
      }, {
        "controller": "declareString",
        "content": "Let's try that again, but this time create a [define javascript_string l] variable named `color`.\n\n[snippet declare_string]\n"
      }, {
        "mode": "overlay",
        "content": "As mentioned earlier in the lesson, [define code_variable ls] are used to track data in a program. \n\nYou're able to create new [define code_variable ls] and give them values, but you're also able to access [define code_variable ls] to get the data they hold.\n"
      }, {
        "content": "If you think back to the box example, this would be similar to opening a box and checking what's inside.\n"
      }, {
        "content": "In the previous lesson you used the `alert` [define javascript_function l] to display messages on the screen.\n\n[snippet using_alert]\n"
      }, {
        "content": "In this example, the `alert` [define javascript_function l] will use the [define javascript_string l] `\"hello, world\"` as the message to display on the screen.\n\n[snippet using_alert highlight:6,15]\n\nThe `alert` [define javascript_function l] needs to know which message to display in order to work, but it's possible to use a [define code_variable l] instead.\n"
      }, {
        "content": "In this case, the message is now being declared as a [define code_variable l] and then being given to the `alert` [define javascript_function l].\n\n[snippet using_variable]\n\nThe outcome will be the same with the message `\"hello, world\"` being displayed in the `alert` message box.\n"
      }, {
        "mode": "popup",
        "controller": "alertMessages",
        "content": "Let's try this out by creating an `alert` message with each of the variables you've already declared.\n\n[snippet alert_messages]\n"
      }, {
        "controller": "displayAlerts",
        "content": "Great! Now use the *Run Code* button to execute this code. You should see an `alert` message for each of the [define code_variable l] values.\n\nDon't forget that you'll need to press *OK* on each `alert` message to continue executing the code.\n"
      }, {
        "content": "The `alert` [define javascript_function l] will display the message box and show whatever is passed into it.\n"
      }, {
        "content": "This means if you were to change the values of [define code_variable ls] `color` and `age`, the message displayed by the `alert` [define javascript_function l] would change.\n"
      }, {
        "controller": "updateAlerts",
        "content": "Let's try that again! Replace the values for `age` and `color` to something different.\n\nWhen you're finished, press *Run Code* and confirm each of the `alert` messages show the new values.\n"
      }, {
        "content": "There's still a lot to cover when it comes to using [define code_variable ls], but you've made some good progress so far. \n\nFor now, let's review what you've learned in this lesson!\n"
      }, {
        "mode": "overlay",
        "title": "Variables are used to track information in a program?",
        "choices": ["True", "False"],
        "explain": "[define code_variable s] are used to keep track of data in a program. You can create new variables, change existing variables, or access variables to use the data they contain.\n"
      }, {
        "title": "What value would make the most sense in a [define code_variable l] called `||emailAddress|email address||`?",
        "choices": ["`\"student@codelabschool.com\"`", "`\"purple\"`", "`true`", "`7350`"],
        "explain": "Values assigned to a [define code_variable l] should represent the [define code_variable l] name used. This makes it easier to understand the contents of a [define code_variable l] while reading code.\n"
      }, {
        "title": "Which [define code_variable l] name would be best for the value `\"bear\"`?",
        "choices": ["`animal`", "`totalEmails`", "`currentMonth`", "`isChild`"],
        "explain": "Ideally, the name of a [define code_variable l] should represent what's inside. The [define code_variable l] name and value shouldn't match exactly, but instead help you identify what it might contain while reading code. \n"
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to this file before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {
        "alert_messages": {
          "content": "alert(age);\nalert(color);",
          "type": "javascript"
        },
        "bad_example": {
          "content": "",
          "type": "javascript"
        },
        "declare_number": {
          "content": "let age = 12;",
          "type": "javascript"
        },
        "declare_string": {
          "content": "let color = 'green';",
          "type": "javascript"
        },
        "declare_variable": {
          "content": "let animal = 'dog';",
          "type": "javascript"
        },
        "using_alert": {
          "content": "alert('hello, world!');",
          "type": "javascript"
        },
        "using_variable": {
          "content": "let greeting = 'hello, world';\n\nalert(greeting);",
          "type": "javascript"
        }
      },
      "resources": [{
        "width": 1260,
        "height": 457,
        "type": "png",
        "path": "changed-boxes.png"
      }, {
        "width": 1260,
        "height": 425,
        "type": "png",
        "path": "labeled-boxes.png"
      }, {
        "width": 1260,
        "height": 457,
        "type": "png",
        "path": "open-boxes.png"
      }, {
        "width": 1260,
        "height": 425,
        "type": "png",
        "path": "unlabeled-boxes.png"
      }, {
        "width": 1260,
        "height": 425,
        "type": "png",
        "path": "weird-box.png"
      }],
      "definitions": {
        "code_variable": {
          "id": "code_variable",
          "name": "Variable",
          "define": "A programming method of storing and accessing data \n"
        },
        "javascript_string": {
          "id": "javascript_string",
          "name": "String",
          "plural": "Strings",
          "define": "Strings are useful for holding data that can be represented in text form. Some of the most-used operations on strings are to check their length, to build and concatenate them using the `+` and `+=` string operators, checking for the existence or location of substrings with the `indexOf() method`, or extracting substrings with the `substring()` method.\n"
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
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "JavaScript, often abbreviated as JS, is a high-level, interpreted scripting language that conforms to the ECMAScript specification. JavaScript has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.\n\nAlongside HTML and CSS, JavaScript is one of the core technologies of the World Wide Web.[9] JavaScript enables interactive web pages and is an essential part of web applications. The vast majority of websites use it, and major web browsers have a dedicated JavaScript engine to execute it.\n"
        },
        "javascript_keyword": {
          "id": "javascript_keyword",
          "name": "Keyword",
          "define": "Keywords are tokens that have special meaning in JavaScript: break , case , catch , continue , debugger , default , delete , do , else , finally , for , function , if , in , instanceof , new , return , switch , this , throw , try , typeof , var , void , while , and with \n"
        },
        "javascript_function": {
          "id": "javascript_function",
          "name": "Function",
          "define": "A JavaScript function is a block of code designed to perform a particular task and is executed when \"something\" invokes it (calls it).\n"
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
      alertMessages: alertMessages, alertNumber: alertNumber, assignExisting: assignExisting, declareNumber: declareNumber, declareString: declareString, displayAlerts: displayAlerts, updateAlerts: updateAlerts, validation: validation
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


  _createClass(codeVariablesBasicsLesson, [{
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

  return codeVariablesBasicsLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('code_variables_basics', codeVariablesBasicsLesson);

},{"./alertMessages":1,"./alertNumber":2,"./assignExisting":3,"./controllers/waitForFile":4,"./controllers/waitForObjectivesList":5,"./controllers/waitForTab":6,"./declareNumber":8,"./declareString":9,"./displayAlerts":10,"./lib":12,"./updateAlerts":13,"./validation":15}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;

var $valid = void 0;
var $color = void 0;
var $age = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		var color = this.state.selectedColor;
		var age = this.state.selectedAge;

		test.lines(2);
		(0, _validation.declare_number)(test, age);
		test.lines(2);
		(0, _validation.declare_string)(test, color);
		test.lines(2);
		(0, _validation.alert_messages)(test);
		test.lines(2);

		// capture the new colors
		$color = test.pull('color');
		$age = _lib._.toString(test.pull('num'));
	},
	onValid: function onValid() {
		$valid = true;
		this.assistant.say({
			message: "That looks good so far, press **Run Code** and let's see if the `alert` messages display the new values."
		});
	},
	onEnter: function onEnter() {
		$valid = false;
	},

	extend: {
		onRunCode: function onRunCode() {
			return $valid;
		},
		onRunCodeAlert: function onRunCodeAlert(runner) {

			if (runner.alerts[1] === $color) {
				this.progress.allow();
				this.assistant.say({
					message: 'Great work! There\'s the `color` value displaying `"' + $color + '"` as expected!',
					emote: 'happy'
				});
			} else if (runner.alerts[0] === $age) {
				this.assistant.say({
					message: 'There\'s the `age` value and it\'s now showing `' + $age + '` instead of it\'s previous value!'
				});
			}
		}
	}

});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":14,"./validation":15}],14:[function(require,module,exports){
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

},{"./lib":12}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.alert_messages = exports.declare_string = exports.declare_number = undefined;

var _lib = require('./lib');

var declare_number = exports.declare_number = function declare_number(test, except) {
	test.keyword('let')._s.id('age')._s.symbol('=')._s.number(function (match, num) {
		if (match === _lib._.toString(except)) return 'Expected a different a number than ' + except;

		test.append({ num: num });
		return (!_lib._.some(match) || num < 10 || num > 99) && 'Expected a number between 10 and 99';
	}).symbol(';')._n;
};

var declare_string = exports.declare_string = function declare_string(test, except) {
	var _test$keyword$_s$id$_;

	var allow = [];
	if (except !== 'red') allow.push('red');
	if (except !== 'green') allow.push('green');
	if (except !== 'blue') allow.push('blue');

	(_test$keyword$_s$id$_ = test.keyword('let')._s.id('color')._s.symbol('=')._s).string.apply(_test$keyword$_s$id$_, allow.concat([function (color) {
		test.append({ color: color });
	}])).symbol(';')._n;
};

var alert_messages = exports.alert_messages = function alert_messages(test) {

	var requires = void 0;

	test.func('alert').symbol('(').id('age', 'color', function (used) {
		requires = used === 'color' ? 'age' : 'color';
	}).symbol(')').symbol(';')._n.__b;

	test.func('alert').symbol('(').id(requires).symbol(')').symbol(';')._n.__b;
};

},{"./lib":12}]},{},[11]);
