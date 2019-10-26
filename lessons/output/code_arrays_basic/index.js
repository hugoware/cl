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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {
		this.screen.highlight.clear();

		var boundary = (0, _utils.findBoundary)(code, {
			expression: 'console.log(list);'
		});

		test.setBounds(boundary);
		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 0, 'cheese');
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 2, 'cookies');
		test.gap();

		(0, _validation.validate_add_item)(test);
		test.clearBounds();
		test.gap();

		(0, _validation.validate_console_log_list)(test);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 0);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 2);
		test.lines(0, 2).eof();
	},
	onEnter: function onEnter() {},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'That\'s correct! Try pressing **Run Code** so we can see the result!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(1);
		this.progress.allow();
		this.assistant.say({
			message: 'Very good! You\'ll notice that there\'s a new value for `milk` inside of the [define code_array l]!'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],2:[function(require,module,exports){
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

},{"../lib":8}],3:[function(require,module,exports){
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

},{"../lib":8}],4:[function(require,module,exports){
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

},{"../lib":8}],5:[function(require,module,exports){
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

},{"../lib":8}],6:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();
		(0, _validation.validate_console_log_list)(test);
		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'That looks correct! Now press **Run Code** so we can see the results!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.progress.allow();
		this.assistant.say({
			message: 'Great! The **Output Area** is showing the contents of the [define code_array l].'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],7:[function(require,module,exports){
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

var _addItem = require('./addItem');

var addItem = _interopRequireWildcard(_addItem);

var _createArray = require('./createArray');

var createArray = _interopRequireWildcard(_createArray);

var _logFirstIndex = require('./logFirstIndex');

var logFirstIndex = _interopRequireWildcard(_logFirstIndex);

var _logLastIndex = require('./logLastIndex');

var logLastIndex = _interopRequireWildcard(_logLastIndex);

var _logLength = require('./logLength');

var logLength = _interopRequireWildcard(_logLength);

var _replaceFirst = require('./replaceFirst');

var replaceFirst = _interopRequireWildcard(_replaceFirst);

var _replaceLast = require('./replaceLast');

var replaceLast = _interopRequireWildcard(_replaceLast);

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
var codeArraysBasicLesson = function () {

  // setup the lesson
  function codeArraysBasicLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, codeArraysBasicLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Using Arrays",
      "type": "code",
      "description": "Understanding how to use arrays to track collections of data",
      "lesson": [{
        "mode": "overlay",
        "title": "Using Arrays",
        "content": "In this lesson we're going to start learning about [define code_array s].\n\n[define code_array s] can be described as a way to collect many pieces of information into a single variable.\n"
      }, {
        "content": "[define code_array s] can be used for many things, but one of the most common uses is to create lists, or collections, of data.\n"
      }, {
        "content": "For example, if you were to write down a list of the types of **pets** people have, it might look something like this.\n\n[snippet text_list_base]\n\nThis list would contain several individual types of **pets**. You could then give this list to someone else and all of the information would stay together.\n"
      }, {
        "content": "If you were to think of another type of pet, you could easily add it to the end of the list.\n\n[snippet text_list_add highlight:18,6]\n\n[define code_array s] allow you to add, remove, sort, and many other functions that are useful to manage a list of data.\n"
      }, {
        "content": "Creating an [define code_array l] in [define javascript] is pretty easy to do.\n\n[snippet code_list]\n\nThis example contains the same data as the previous **pet** list, but written using [define javascript].\n"
      }, {
        "content": "To start, [define code_array ls] are declared the same as any other [define code_variable l].\n\n[snippet code_list highlight:0,3]\n\n[note] Remember, for simplicity sake, CodeLab only uses `let` for [define code_variable l] declarations, but you'll often see the [define javascript_keyword ls] `const` and `var` in other code examples outside of this site.\n"
      }, {
        "content": "Next is the name of the [define code_variable l]. This follows the same rules as any other [define code_variable l] name that you've seen before.\n\n[snippet code_list highlight:4,4]\n"
      }, {
        "content": "Like with other [define code_variable l] declarations, you must use an `=` sign to identify the starting value for the [define code_variable l].\n\n[snippet code_list highlight:9,1]\n"
      }, {
        "content": "Next, the `[` and `]` are used to identify the start and end of the [define code_array l].\n\n[snippet code_list highlight:11,1|57,1]\n\nLike with most things in code, you must remember to close your [define code_array ls] with a `]`, otherwise the code will probably fail to run.\n"
      }, {
        "content": "Each item in the [define code_array l] must be separated with a comma.\n\n[snippet code_list highlight:19,1|27,1|36,1|45,1]\n"
      }, {
        "content": "\nThe previous examples showed each value placed on a separate line, but you're also able to keep everything on the same line.\n\n[snippet same_line]\n"
      }, {
        "content": "If you don't want an [define code_array l] to start with any values in it, you can always create an empty [define code_array l].\n\n[snippet empty_array]\n"
      }, {
        "content": "[define code_array s] are not limited to holding only [define javascript_string sl] either.\n\n[snippet complex_list]\n\nYou can store [define javascript_number ls], [define javascript_boolean ls], other [define code_array ls], and more.\n"
      }, {
        "content": "In most cases, each type of value inside of an [define code_array l] will be the same as one another.\n\n[snippet grade_list]\n\nThis example is an [define code_array l] of **grades**, so you'd expect it to contain [define javascript_number ls]. As we learned before, the name of a [define code_variable l] should help identify the data inside.\n"
      }, {
        "mode": "popup",
        "content": "Great! Let's take a look at a few examples of using [define code_array ls].\n"
      }, {
        "waitForFile": "/main.js"
      }, {
        "content": "Let's use an [define code_array l] to create a shopping list.\n"
      }, {
        "controller": "createArray",
        "content": "Start by declaring a new [define code_array l] named `list` and then using `console.log` to display it on the screen.\n\nMake sure the [define code_array l] starts with the following items `bread`, `eggs`, then `apples`.\n"
      }, {
        "content": "Using `console.log` with the `list` [define code_variable l] displayed all items in the [define code_array l].\n"
      }, {
        "content": "However, in many cases we will need to be able to work with individual items in the [define code_array l].\n"
      }, {
        "title": "Working with Individual Array Values",
        "mode": "overlay",
        "content": "Accessing specific items in an [define code_array l] uses a new [define syntax l] that you might not be familiar with yet.\n\n[snippet access_array_value]\n"
      }, {
        "content": "In order to access a specific position in an [define code_array l], you'll need to use the `[` and `]`.\n\n[snippet access_array_value highlight:19,1|21,1]\n\nThese are placed after the [define code_variable l] and are used to surround a [define javascript_number l].\n"
      }, {
        "content": "The number is the position in the [define code_array l] that we want to access.\n\n[snippet access_array_value highlight:20,1]\n\nTypically, the [define javascript_number numeric] position in an [define code_array l] is called the **[define code_array_index l]**.\n"
      }, {
        "content": "An interesting thing about [define javascript] [define code_array ls] are that the [define code_array_index l] [define javascript_number ls] begin at zero.\n\n[snippet access_array_value highlight:20,1]\n\nThis means that the **first value** in the [define code_array l] is accessed using the [define javascript_number l] **zero**!\n"
      }, {
        "content": "This might seem a little weird, but it's actually fairly common in many programming languages for [define code_array l] [define code_array_index sl] to begin at zero.\n\n[snippet access_array_value highlight:20,1]\n\nMake sure to keep this in mind while you're writing code!\n"
      }, {
        "content": "Replacing a value inside of an [define code_array l] uses a very similar approach. \n\n[snippet replace_array_value highlight:8,1]\n\nAlong with the `[`, `]`, and [define code_array_index l] [define javascript_number l], you must also use an `||=|equal sign||` to assign the new value to a specific [define code_array_index l].\n"
      }, {
        "content": "Do not use the [define code_variable l] declaration [define javascript_keyword ls] when replacing a value inside of an [define code_array l].\n\n[snippet replace_incorrect]\n\nTo replace a value in an [define code_array ls], simply use the `||=|equal sign||` to assign a new value.\n"
      }, {
        "mode": "popup",
        "content": "Let's try working with specific [define code_array l] values.\n"
      }, {
        "controller": "logFirstIndex",
        "content": "Follow along with the instructions and use `console.log` to display a single item from the [define code_array l].\n"
      }, {
        "controller": "logLastIndex",
        "content": "Let's try that again, but this time use `console.log` at the end of the code file to display the **last** value in the [define code_array].\n\n&&DISABLED_HINTS&&\n"
      }, {
        "content": "Now, let's try to replace some values in the [define code_array l].\n"
      }, {
        "controller": "replaceFirst",
        "content": "Follow along with the instructions and replace the first item in the [define code_array l] with the word `cheese`.\n"
      }, {
        "controller": "replaceLast",
        "content": "Let's try that one more time! Replace the item in the array for `apples` with the word `cookies`.\n\n&&DISABLED_HINTS&&\n"
      }, {
        "content": "Let's go over one more interesting thing about [define code_array ls].\n"
      }, {
        "mode": "overlay",
        "content": "In [define javascript], [define code_array ls] are also [define javascript_object ls]. You've been working with [define javascript_object ls] each time you use `console.log`.\n\n[snippet console_log_example]\n"
      }, {
        "content": "The [define javascript_object l] in this case is `console`. An [define javascript_object l] is a collection of [define javascript_property ls] such [define javascript_number sl], [define javascript_string ls], [define javascript_function ls], and other types of data.\n\n[snippet console_log_example highlight:0,7]\n"
      }, {
        "content": "Each [define javascript_property l] on an object is represented by a name. In the `console.log` example, the name of the property is `log`.\n\n[snippet console_log_example highlight:0,7]\n\nThere's a few ways to work with [define javascript_property ls], but typically [define javascript_property ls] are accessed using a `||.|dot||` followed by the [define javascript_property l] name.\n"
      }, {
        "content": "The `console` [define javascript_object l] has a [define javascript_property l] that's a [define javascript_function l] called `log`.\n\n[snippet console_log_example highlight:8,3]\n\nAs you've seen already, the `log` [define javascript_function l] is used to print messages in the **Output Area**.\n"
      }, {
        "content": "[define code_array s] in [define javascript] are also [define javascript_object ls], meaning there are [define javascript_property ls] that you can access.\n\n[snippet array_props_example]\n"
      }, {
        "content": "The [define javascript_property l] `push` is a [define javascript_function l] that will add a new item to the end of a [define code_array l].\n\n[snippet array_props_example highlight:51,19]\n"
      }, {
        "content": "The [define javascript_property l] `length` is a [define javascript_number l] that will tell you how many items are currently in the [define code_array l].\n\n[snippet array_props_example highlight:108,12]\n"
      }, {
        "content": "We'll learn more about [define javascript_object ls] in later lessons, but for now let's try working with these [define code_array l] [define javascript_property ls].\n"
      }, {
        "mode": "popup",
        "controller": "addItem",
        "content": "Let's start by adding a value to the `list` [define code_array l].\n\nUse the `push` [define javascript_function l] to add the word `milk` to the shopping list.\n"
      }, {
        "controller": "logLength",
        "content": "Now let's try working with the `length` [define javascript_property] for the `list` [define code_array l].\n\nUse `console.log` to display the current length of the shopping list.\n"
      }, {
        "content": "Great work! We've learned a lot about [define code_array ls] so let's take some time to review!\n"
      }, {
        "mode": "overlay",
        "title": "What are Arrays useful for?",
        "explain": "[define code_array s] can be used for many things, but they're especially great for managing lists of data.\n",
        "choices": ["Keeping track of many items of data", "Checking for an internet connection", "Convering strings to uppercase", "Checking for syntax errors in code"]
      }, {
        "title": "What message would be printed using `console.log`?",
        "content": "[snippet question_1 size:xs]\n",
        "explain": "The item at the **first** [define code_array_index l] is actually the **second** item in the [define code_array l]. Don't forget that the [define code_array_index ls] in [define code_array ls] begin at **zero**!\n",
        "choices": ["`cat`", "`mouse`", "`dog`", "Nothing, this code has an error!"]
      }, {
        "title": "What is the [define javascript_function l] that **adds** an item to the end of an [define code_array l]?",
        "inline": true,
        "explain": "There are many other [define javascript_property ls] that are part of a [define code_array l]. The `push` [define javascript_function l] is used to add another item to the end of an [define code_array l].\n",
        "choices": ["`push`", "`add`", "`shift`", "`pop`"]
      }, {
        "title": "What is the [define javascript_property l] that has the total number of items in an [define code_array l]?",
        "inline": true,
        "explain": "The `length` [define javascript_property l] will return the current count of items inside of an [define code_array l]. Adding and removing items from an [define code_array l] will cause this number to change!\n",
        "choices": ["`length`", "`size`", "`total`", "`count`"]
      }, {
        "mode": "popup",
        "content": "&&FINISH_LESSON&&\n"
      }],
      "snippets": {
        "access_array_value": {
          "content": "const value = items[0];\n\nconsole.log(value);",
          "type": "javascript"
        },
        "array_props_example": {
          "content": "let items = [ 'dog', 'cat' ];\n\n// using a function\nitems.push('mouse');\n\n// checking a property\nlet total = items.length;\nconsole.log(total); // prints 3!",
          "type": "javascript"
        },
        "code_list": {
          "content": "let pets = [\n\t'dog',\n\t'cat',\n\t'bird',\n\t'fish',\n\t'lizard'\n];",
          "type": "javascript"
        },
        "complex_list": {
          "content": "let complex = [\n\n\t// common data\n\t10,\n\tfalse,\n\t'just a string',\n\n\t// another array\n\t[ 300, 200, 100 ]\n];",
          "type": "javascript"
        },
        "console_log_example": {
          "content": "console.log('hello!');",
          "type": "javascript"
        },
        "empty_array": {
          "content": "let empty = [ ];",
          "type": "javascript"
        },
        "grade_list": {
          "content": "let grades = [ \n\t90,\n\t100,\n\t95,\n\t92\n\t100\n];",
          "type": "javascript"
        },
        "normal_list": {
          "content": "1. first\n2. second\n3. third",
          "type": "javascript"
        },
        "question_1": {
          "content": "let pets = [\n\t'dog',\n\t'cat',\n\t'mouse'\n];\n\nconsole.log(pets[1]);",
          "type": "javascript"
        },
        "replace_array_value": {
          "content": "list[0] = 'new value';",
          "type": "javascript"
        },
        "replace_incorrect": {
          "content": "// works\nlist[0] = 'correct';\n\n// also works\nlet replace = 'also correct';\nlist[0] = replace;\n\n// does not work!\nlet list[0] = 'wrong!';",
          "type": "javascript"
        },
        "same_line": {
          "content": "let colors = [ 'red', 'green', 'blue' ];",
          "type": "javascript"
        },
        "text_list_add": {
          "content": "dog\ncat\nbird\nfish\nlizard",
          "type": "txt"
        },
        "text_list_base": {
          "content": "dog\ncat\nbird\nfish",
          "type": "txt"
        },
        "text_list_remove": {
          "content": "dog\ncat\nfish\nlizard",
          "type": "txt"
        },
        "text_list_sort": {
          "content": "bird\ncat\ndog\nfish\nlizard",
          "type": "txt"
        },
        "zero_list": {
          "content": "0. first\n1. second\n2. third",
          "type": "javascript"
        }
      },
      "definitions": {
        "code_array": {
          "id": "code_array",
          "name": "Array",
          "define": "A list of data\n"
        },
        "code_array_index": {
          "id": "code_array_index",
          "plural": "Indexes",
          "name": "Index",
          "define": "A numeric position within an array\n"
        },
        "javascript_property": {
          "id": "javascript_property",
          "name": "Property",
          "plural": "Properties",
          "define": "A key/value pair of an JavaScript Object\n"
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
        "code_variable": {
          "id": "code_variable",
          "name": "Variable",
          "define": "A programming method of storing and accessing data \n"
        },
        "javascript_keyword": {
          "id": "javascript_keyword",
          "name": "Keyword",
          "define": "Keywords are tokens that have special meaning in JavaScript: break , case , catch , continue , debugger , default , delete , do , else , finally , for , function , if , in , instanceof , new , return , switch , this , throw , try , typeof , var , void , while , and with \n"
        },
        "javascript_string": {
          "id": "javascript_string",
          "name": "String",
          "plural": "Strings",
          "define": "Strings are useful for holding data that can be represented in text form. Some of the most-used operations on strings are to check their length, to build and concatenate them using the `+` and `+=` string operators, checking for the existence or location of substrings with the `indexOf() method`, or extracting substrings with the `substring()` method.\n"
        },
        "javascript_number": {
          "id": "javascript_number",
          "name": "Number",
          "plural": "Numbers",
          "define": "JavaScript has a single type for all numbers: it treats all of them as floating-point numbers.\n"
        },
        "javascript_boolean": {
          "id": "javascript_boolean",
          "name": "Boolean",
          "plural": "Booleans",
          "define": "The Boolean object represents two values, either \"true\" or \"false\". If value parameter is omitted or is 0, -0, null, false, NaN, undefined, or the empty string (\"\"), the object has an initial value of false.\n"
        },
        "syntax": {
          "id": "syntax",
          "name": "Syntax",
          "plural": "Syntaxes",
          "define": "The arrangement of words and symbols to create well-formed code that can be understood by the computer.\n"
        },
        "javascript_object": {
          "id": "javascript_object",
          "name": "Object",
          "define": "A complex type that allows properties\n"
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
      addItem: addItem, createArray: createArray, logFirstIndex: logFirstIndex, logLastIndex: logLastIndex, logLength: logLength, replaceFirst: replaceFirst, replaceLast: replaceLast, validation: validation
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


  _createClass(codeArraysBasicLesson, [{
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

  return codeArraysBasicLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('code_arrays_basic', codeArraysBasicLesson);

},{"./addItem":1,"./controllers/waitForFile":2,"./controllers/waitForObjectivesList":3,"./controllers/waitForTab":4,"./createArray":6,"./lib":8,"./logFirstIndex":9,"./logLastIndex":10,"./logLength":11,"./replaceFirst":12,"./replaceLast":13,"./validation":15}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {
		this.screen.highlight.clear();

		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();
		(0, _validation.validate_console_log_list)(test);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 0);
		test.gap().eof();
	},
	onEnter: function onEnter() {},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'That looks correct! Now press **Run Code** to display the item in the [define code_array l] at position number `0`!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(2);
		this.progress.allow();
		this.assistant.say({
			message: 'That worked as expected! Zero is the first **index** in the [define code_array] so the value displayed was `bread`'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],10:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	disableHints: true,

	validation: function validation(test, code) {
		this.screen.highlight.clear();

		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();
		(0, _validation.validate_console_log_list)(test);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 0);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 2);
		test.lines(0, 2).eof();
	},
	onEnter: function onEnter() {},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'That\'s it! Try pressing **Run Code** so we can see the result!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(3);
		this.progress.allow();
		this.assistant.say({
			message: 'Very good! The last item in the [define code_array l] is `apples`. It might take a little time, but you\'ll get used to the way [define code_array_index ls] work with [define code_array ls]!'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],11:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	disableHints: true,

	validation: function validation(test, code) {
		this.screen.highlight.clear();

		var boundary = (0, _utils.findBoundary)(code, {
			expression: 'console.log(list);'
		});

		test.setBounds(boundary);
		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 0, 'cheese');
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 2, 'cookies');
		test.gap();

		(0, _validation.validate_add_item)(test);
		test.gap();

		(0, _validation.validate_log_length)(test);
		test.clearBounds();
		test.gap();

		(0, _validation.validate_console_log_list)(test);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 0);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 2);
		test.lines(0, 2).eof();
	},
	onEnter: function onEnter() {},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'Perfect! Try pressing **Run Code** so we can see the result!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(1);
		this.progress.allow();
		this.assistant.say({
			message: 'Wonderful! Using `console.log` with the `length` [define javascript_property l] shows that there are now **4** items in the [define code_array l]!'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],12:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {
		this.screen.highlight.clear();

		var boundary = (0, _utils.findBoundary)(code, {
			expression: 'console.log(list);'
		});

		test.setBounds(boundary);
		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 0, 'cheese');
		test.clearBounds();
		test.gap();

		(0, _validation.validate_console_log_list)(test);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 0);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 2);
		test.lines(0, 2).eof();
	},
	onEnter: function onEnter() {

		var content = this.file.content({ path: '/main.js' });
		var index = content.indexOf('console.log(list);');
		content = content.replace('console.log(list);', '\n\nconsole.log(list);');

		// set the new starting position
		this.file.content({ path: '/main.js', replaceRestore: true, content: content });
		this.editor.cursor({ path: '/main.js', index: index });
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'That should do it! Try pressing **Run Code** so we can see the result!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(2);
		this.progress.allow();
		this.assistant.say({
			message: 'Great! When the [define code_array l] was created, the first item was the word `bread`, but now it has been replaced with the word `cheese`!'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],13:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	disableHints: true,

	validation: function validation(test, code) {
		this.screen.highlight.clear();

		var boundary = (0, _utils.findBoundary)(code, {
			expression: 'console.log(list);'
		});

		test.setBounds(boundary);
		test.lines(0, 2);

		(0, _validation.validate_default_array)(test);
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 0, 'cheese');
		test.gap();

		(0, _validation.validate_array_assign_index)(test, 2, 'cookies');
		test.clearBounds();
		test.gap();

		(0, _validation.validate_console_log_list)(test);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 0);
		test.gap();
		(0, _validation.validate_console_log_list_index)(test, 2);
		test.lines(0, 2).eof();
	},
	onEnter: function onEnter() {},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'Looks good! Try pressing **Run Code** so we can see the result!'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(3);
		this.progress.allow();
		this.assistant.say({
			message: 'Fantastic! Replacing values inside of an [define code_array l] is as easy as that!'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":8,"./utils":14,"./validation":15}],14:[function(require,module,exports){
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

},{"./lib":8}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var validate_default_array = exports.validate_default_array = function validate_default_array(test) {
	return test.declare('let')._s.id('list')._s.symbol('=')._s.symbol('[')._n._t.string('bread').symbol(',')._n._t.string('eggs').symbol(',')._n._t.string('apples')._n.symbol(']').symbol(';');
};

var validate_console_log_list = exports.validate_console_log_list = function validate_console_log_list(test) {
	return test.id('console').symbol('.').func('log').symbol('(').id('list').symbol(')').symbol(';');
};

var validate_console_log_list_index = exports.validate_console_log_list_index = function validate_console_log_list_index(test, index) {
	return test.id('console').symbol('.').func('log').symbol('(').id('list').symbol('[').number(index).symbol(']').symbol(')').symbol(';');
};

var validate_array_assign_index = exports.validate_array_assign_index = function validate_array_assign_index(test, index, value) {
	return test.id('list').symbol('[').number(index).symbol(']')._s.symbol('=')._s.string(value).symbol(';');
};

var validate_add_item = exports.validate_add_item = function validate_add_item(test) {
	return test.id('list').symbol('.').func('push').symbol('(').string('milk').symbol(')').symbol(';');
};

var validate_log_length = exports.validate_log_length = function validate_log_length(test) {
	return test.id('console').symbol('.').func('log').symbol('(').id('list').symbol('.').prop('length').symbol(')').symbol(';');
};

},{}]},{},[7]);
