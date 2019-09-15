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

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',
	cursor: 92,

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '</body',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.validate_start).lines(3).merge(_validation.validate_mid).lines(1).merge(_validation.validate_heading).clearBounds().lines(3).merge(_validation.validate_end);
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Way to go! You just wrote some [define html] code!',
			emote: 'happy'
		});
	}
});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":13,"./validation":14}],2:[function(require,module,exports){
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

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '</body',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.validate_start).lines(3).merge(_validation.validate_mid).lines(1).merge(_validation.validate_heading).lines(1).merge(_validation.validate_image).clearBounds()._n.lines(3).merge(_validation.validate_end);
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Well done! Is that your favorite emoji?',
			emote: 'happy'
		});
	}
});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":13,"./validation":14}],3:[function(require,module,exports){
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

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',
	cursor: 66,

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '</head',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.validate_start).lines(1).merge(_validation.validate_stylesheet).clearBounds().lines(1).merge(_validation.validate_mid).lines(1).merge(_validation.validate_heading).lines(1).merge(_validation.validate_image)._n.lines(3).merge(_validation.validate_end);
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Wow! [define css] can definitely make a web page look a lot better!',
			emote: 'happy'
		});
	}
});

},{"./controllers/waitForValidation":7,"./lib":12,"./utils":13,"./validation":14}],4:[function(require,module,exports){
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
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight.codeEditor();
}

function onExit() {
	this.screen.clear();
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight.fileBrowser();
}

function onExit() {
	this.screen.clear();
}

},{}],10:[function(require,module,exports){
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
	this.screen.clear();
}

},{}],11:[function(require,module,exports){
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

var _addHeading = require('./addHeading');

var addHeading = _interopRequireWildcard(_addHeading);

var _addImage = require('./addImage');

var addImage = _interopRequireWildcard(_addImage);

var _addStylesheet = require('./addStylesheet');

var addStylesheet = _interopRequireWildcard(_addStylesheet);

var _highlightEditor = require('./highlightEditor');

var highlightEditor = _interopRequireWildcard(_highlightEditor);

var _highlightFileBrowser = require('./highlightFileBrowser');

var highlightFileBrowser = _interopRequireWildcard(_highlightFileBrowser);

var _highlightPreviewArea = require('./highlightPreviewArea');

var highlightPreviewArea = _interopRequireWildcard(_highlightPreviewArea);

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
var demoLesson = function () {

  // setup the lesson
  function demoLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, demoLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "CodeLab Demo",
      "type": "web",
      "description": "An Introduction to the CodeLab Learning System",
      "lesson": [{
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "Welcome to your first lesson on creating web pages!\n\nAs you work through this lesson you will be asked to complete certain tasks before you can move onto the next step.\n"
      }, {
        "content": "In this tutorial we're going to start learning the basics of creating web pages.\n\nHowever, before we start learning how to write code, it's best to take a little bit of time and learn how web pages work _behind the scenes_.\n"
      }, {
        "controller": "browserType"
      }, {
        "content": "Generally speaking, web pages viewed in the browser are created using three different core technologies. These are [define html], [define css], and [define javascript].\n\n[image tech.png]\n\nIn fact, it's entirely possible that every single website you've ever visited has used all three of these technologies at the same time!\n"
      }, {
        "content": "[define html] is the foundation for all [define web_page web pages]. [define html] is a language that determines the words and content that are displayed in the web browser.\n\n[image html-focus.png]\n\nIn a sense, [define html] is what your web page _says_.\n"
      }, {
        "content": "[define css] is a language that's used to determine the visual appearance of a web page. The colors, font sizes, layout, and other design properties of your web page are defined by the rules in [define css]\n\n[image css-focus.png]\n\nSimply put, [define css] decides what your web page _looks like_.\n"
      }, {
        "content": "Finally, [define javascript] is a programming language that can be used to create logic and behaviors on a web page. Many modern websites use [define javascript] to create complicated applications that run entirely in the [define web_browser browser]\n\n[image javascript-focus.png]\n\nGenerally speaking, [define javascript] decides what your web page _will do_.\n"
      }, {
        "content": "Each time you visit a [define website website], code files like [define html], [define css], and [define javascript] are sent to your computer. The [define web_browser] uses the instructions in each of these files to create the [define web_page web page] you see on the screen.\n\n[image build.jpg frame]\n"
      }, {
        "content": "There's a lot to learn when it comes to creating web pages, but with practice and time, you'll be building entire websites before you know it.\n\n[image html-focus.png]\n\nAt the start of this tutorial series, we're going to focus on learning [define html] and then introduce [define css] and [define javascript] at a later time.\n"
      }, {
        "emotion": "happy",
        "content": "Great, let's get started learning some [define html]!"
      }, {
        "title": "What is HTML?",
        "content": "[define html] is a language that's used to describe the information found on a web page. It's written using instructions called [define html_element Elements]. An [define html_element] is made up of several parts called [define html_tag tags].\n\nBelow is an example of a simple [define html_element].\n\n[snippet html_tag_example]\n\nLet's go over what each part of this code example ||does|duz||. \n"
      }, {
        "content": "The first part of an [define html_element] is the **Opening** [define html_tag tag]. It's written using a `<` sign, followed by the name of the tag, and then a `>` sign.\n\n[snippet html_tag_example highlight:0,4]\n\nThis tells the [define web_browser] what rules to follow for everything that comes after the opening tag.\n"
      }, {
        "content": "The `<` and `>` signs are special characters that are used in [define html] to mark where [define html_tag tags] begin and end.\n\n[snippet html_tag_example highlight:0,1|3,1]\n\nYou'll sometimes hear these characters referred to as _\"angle brackets\"_ by other developers.\n"
      }, {
        "content": "The word between the opening and closing tags is the name of the [define html_element Element]. Each [define html_element] has a different purpose in the web browser.\n\n[snippet html_tag_example highlight:1,2]\n\nFor example, this `h1` Element is how you display a large heading.\n"
      }, {
        "content": "At the end of an [define html_element] is the closing [define html_tag tag]. It's written much like the opening tag, but there's also a `/` character after the first `<` sign.\n\n[snippet html_tag_example highlight:17,5]\n\nThe closing [define html_tag] is very important because it marks where an [define html_element] stops.\n"
      }, {
        "content": "Everything between the opening and closing [define html_tag tags] is the content. This [define html_element Element] is a _heading_. If you were to look at this in a browser it would show up as the phrase \"Hello, World!\" in a large and bold font.\n\n[snippet html_tag_example highlight:4,13 preview:45%]\n"
      }, {
        "mode": "popup",
        "content": "We've talked a lot about how [define html] works, so let's jump into writing some code and see what happens.\n"
      }, {
        "controller": "highlightFileBrowser",
        "content": "On the left side of the screen is the [define file_browser]. This is a list of all files in your project.\n"
      }, {
        "controller": "waitForIndexHtml",
        "content": "Open the file named `index.html` by [define double_click double clicking] on it in the [define file_browser].\n"
      }, {
        "controller": "codeEditorIntro",
        "content": "The code file you just opened is now in the [define codelab_editor] area. This is where you can make changes to code.\n\nAt the top, you'll see there's a new tab added for the file you just opened.\n"
      }, {
        "controller": "previewAreaIntro",
        "content": "On the right side of the screen you can see the [define codelab_html_preview]. This shows what the [define html] for this file looks like when viewed in a [define web_browser browser].\n\nThis area will update automatically as you make changes.\n"
      }, {
        "content": "Like with the previous example, this is a heading [define html_element Element]. You can see that it uses opening and closing [define html_tag tags] to surround the content.\n"
      }, {
        "controller": "changeHeadingContent",
        "content": "Let's start by changing the content of the [define html_element Element]. Replace the words \"Hello, World!\" with something different.\n"
      }, {
        "content": "Now, let's try to type in an entirely new [define html_element]. This time we're going to create both the opening and closing [define html_tag tags] as well as the content inside.\n"
      }, {
        "controller": "freeHeadingInsert",
        "content": "Create the following [define html_element]\n\n[snippet free_heading_insert]\n"
      }, {
        "content": "Practice makes perfect! Let's try that again with another [define html_element].\n"
      }, {
        "controller": "freeButtonInsert",
        "content": "Create the following [define html_element]\n\n[snippet free_button_insert]\n"
      }, {
        "mode": "overlay",
        "content": "So far you've written a few simple [define html_element HTML Elements] that had some words inside.\n\nEach [define html_element] you created had a different effect on the contents.\n"
      }, {
        "content": "For example, the `h1` [define html_element Element] made the font large and bold.\n\nThe `button` [define html_element Element] created a clickable button.\n\nBasically, the type of [define html_element] used will have a different effect on the contents.\n"
      }, {
        "content": "This is where [define html] starts getting exciting!\nText isn't the only thing that you can put inside of an [define html_element]!"
      }, {
        "content": "Many [define html_element HTML Elements] allow for you to put even more Elements inside of them.\n\n[snippet list_example]\n\nIn fact, most websites you visit on the [define internet] are made up of hundreds, or even thousands, of individual [define html_element HTML Elements]!\n"
      }, {
        "content": "Let's review the [define html] code sample below.\n\n[snippet list_example highlight:0,4|48,5]\n\nLike with the previous examples, there are still opening and closing [define html_tag tags].\n"
      }, {
        "content": "Between the opening and closing [define html_tag tags] are more [define html_element HTML Elements].\n\n[snippet list_example highlight:6,12|20,12|34,13]\n\nOften times you'll hear these called [define html_child_elements] or \"nested\" Elements.\n"
      }, {
        "content": "These two [define html_element Element] types work together to create a list of numbers in the [define web_browser].\n\n[snippet list_example preview:45%]\n\nThe `ol` Element tells the [define web_browser] that each of the child `li` Elements should be displayed as a new **list item**.\n"
      }, {
        "mode": "popup",
        "content": "This might seem a little confusing at first, but it'll make much more sense once you try it out for yourself.\n"
      }, {
        "controller": "addListItems",
        "content": "Create the list in the example below.\n\n[snippet list_example]\n"
      }, {
        "mode": "overlay",
        "content": "Great work! There's still a lot to learn, but let's end this lesson by reviewing what we've covered so far.\n"
      }, {
        "show": 4,
        "title": "What is the name of the `highlighted` code?",
        "content": "[snippet html_tag_example highlight:0,4]\n",
        "hint": "The individual parts of an [define html_element] are called tags.\n",
        "explain": "Each time you create a new [define html_element] you must start with an opening tag.\n",
        "choices": ["The opening tag", "The leading byte", "The execute command", "The block maker"]
      }, {
        "show": 4,
        "title": "What is the name of the `highlighted` code?",
        "content": "[snippet html_tag_example highlight:17,5]\n",
        "hint": "The individual parts of an [define html_element] are called tags.\n",
        "explain": "Each time you create a new [define html_element] you must use a closing tag to end it. You'll learn about more types in later lessons!\n",
        "choices": ["The closing tag", "The ending byte", "The terminator command", "The block breaker"]
      }, {
        "show": 4,
        "title": "What is the name of the `highlighted` code?",
        "content": "[snippet html_tag_example highlight:4,13]\n",
        "explain": "The content is whatever has been added between the opening and closing [define html_tag tags] of an [define html_element]. It could be text, or even other [define html_element Elements].\n",
        "choices": ["The content", "The encoded matrix", "The bytecode input", "The binary block"]
      }, {
        "show": 4,
        "title": "What is the name of a complete [define html] instruction?",
        "content": "This includes the opening and closing tags as well as the content inside.\n\n[snippet html_tag_example highlight:0,22]\n",
        "explain": "Basic commands in [define html] are called [define html_element HTML Elements]. Websites use hundreds, or even thousands of them, to create the content in the [define web_browser]\n",
        "choices": ["An HTML Element", "An encoded terminator", "A binary block", "A bytecode command"]
      }, {
        "show": 4,
        "title": "What is another name for the `<` and `>` signs in [define html]?",
        "explain": "The `<` and `>` signs are special characters used by [define html] to identify where [define html_tag tags] begin and end.\n",
        "choices": ["Angle brackets", "Pointy blocks", "Arrow bytecodes", "Sharp codes"]
      }, {
        "mode": "popup",
        "content": "Way to go! You've finished this lesson!\n"
      }, {
        "content": "At this point all files are now unlocked and you're free to make changes to anything in this project. You can play with the [define html] you've learned, or just try out new things.\n"
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
          "content": "<h1>Hello, World!</h1>",
          "type": "html"
        },
        "css_stylesheet": {
          "content": "<link rel=\"stylesheet\" href=\"/style.css\" />",
          "type": "html"
        },
        "void_example": {
          "content": "<img src=\"/happy.png\" />",
          "type": "html"
        }
      },
      "resources": [],
      "definitions": {
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "Hypertext Markup Language, a standardized system for tagging text files to achieve font, color, graphic, and hyperlink effects on World Wide Web pages."
        },
        "css": {
          "id": "css",
          "name": "CSS",
          "aka": "Cascading Style Sheets",
          "define": "Special rules for styling\n"
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
          "define": "Programming language\n"
        },
        "web_page": {
          "id": "web_page",
          "name": "Web Page",
          "define": "An individual view of a web site.\n"
        },
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
        "website": {
          "id": "website",
          "name": "Website",
          "define": "A point on the Internet that serves web pages"
        },
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements\n"
        },
        "html_tag": {
          "id": "html_tag",
          "name": "HTML Tag",
          "define": "This is about HTML elements - this is `<` or `>`\n"
        },
        "codelab_editor": {
          "id": "codelab_editor",
          "name": "Code Editor",
          "define": "The CodeLab editing area\n"
        },
        "codelab_html_preview": {
          "id": "codelab_html_preview",
          "name": "Preview Area",
          "define": "You can see your HTML as you type\n"
        },
        "internet": {
          "id": "internet",
          "name": "Internet",
          "define": "A world wide network of computers\n"
        },
        "html_child_elements": {
          "id": "html_child_elements",
          "name": "Child Elements",
          "define": "HTML Elements that are contained inside of other HTML Elements. Also commonly referred to as **nested Elements**.\n"
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
      addHeading: addHeading, addImage: addImage, addStylesheet: addStylesheet, highlightEditor: highlightEditor, highlightFileBrowser: highlightFileBrowser, highlightPreviewArea: highlightPreviewArea, validation: validation
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


  _createClass(demoLesson, [{
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

  return demoLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('demo', demoLesson);

},{"./addHeading":1,"./addImage":2,"./addStylesheet":3,"./controllers/waitForFile":4,"./controllers/waitForObjectivesList":5,"./controllers/waitForTab":6,"./highlightEditor":8,"./highlightFileBrowser":9,"./highlightPreviewArea":10,"./lib":12,"./validation":14}],12:[function(require,module,exports){
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

},{"./lib":12}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var validate_start = exports.validate_start = function validate_start(test) {
	return test.__b.doctype('html')._n.tag('html')._n._t.tag('head')._n._t._t.tag('title').content('CodeLab Demo').close('title')._n;
};

var validate_mid = exports.validate_mid = function validate_mid(test) {
	return test._t.close('head')._n._t.tag('body')._n;
};

var validate_end = exports.validate_end = function validate_end(test) {
	return test._t.close('body')._n.close('html');
};

var validate_heading = exports.validate_heading = function validate_heading(test) {
	return test._t._t.tag('h1').singleLine.content(5, 40).close('h1')._n;
};

var validate_image = exports.validate_image = function validate_image(test) {
	return test._t._t.open('img')._s.attrs([['src', '/happy.png', '/love.png', '/sleep.png', '/meh.png']])._s$.close('/>')._n;
};

var validate_stylesheet = exports.validate_stylesheet = function validate_stylesheet(test) {
	return test._t._t.open('link')._s.attrs([['rel', 'stylesheet'], ['href', '/style.css']])._s$.close('/>')._n;
};

},{}]},{},[11]);
