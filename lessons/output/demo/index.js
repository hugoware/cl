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

},{"./controllers/waitForValidation":6,"./lib":11,"./utils":12,"./validation":13}],2:[function(require,module,exports){
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

},{"./controllers/waitForValidation":6,"./lib":11,"./utils":12,"./validation":13}],3:[function(require,module,exports){
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

},{"./controllers/waitForValidation":6,"./lib":11,"./utils":12,"./validation":13}],4:[function(require,module,exports){
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

},{"../lib":11}],5:[function(require,module,exports){
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

},{"../lib":11}],6:[function(require,module,exports){
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

			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (config.onExit) config.onExit.apply(this, args);
		}
	}, config.extend);

	// extra logic as required
	if (config.init) config.init.call(obj, obj);
}

},{"../lib":11}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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
        "title": "Using CodeLab",
        "content": "Welcome to the CodeLab Learning system demo!\n\nCodeLab uses self-paced, interactive tutorials that are a mix of explanations, coding exercises, and review questions.\n"
      }, {
        "content": "This demo tutorial will give you a brief introduction to using [define html] to create web pages.\n\n**However, the primary purpose of this demo is to experience a CodeLab lesson from start to finish.**\n"
      }, {
        "content": "Lessons typically begin by introducing a new concept by examining code examples and highlighting relevant blocks.\n\n[snippet base_example]\n\nIn this case, we're looking at a code example of an [define html_element], the most basic building block when creating a webpage.\n"
      }, {
        "content": "[define html] code is written using [define html_element s]. Many websites have hundreds, or even thousands, of individual [define html_element Elements]\n\n[snippet base_example highlight:0,4|17,5]\n\nMany [define html_element Elements] are made up of a starting and ending [define html_tag tag] which are used to mark where an [define html_element] begins and ends.\n"
      }, {
        "content": "Anything between the starting and ending [define html_tag tags] is the content.\n\n[snippet base_example highlight:4,13 preview:45%]\n\nThis particular [define html_element] would display the phrase _\"Hello, World!\"_ in a large and bold font.\n"
      }, {
        "mode": "popup",
        "content": "After learning a new concept, students are immediately given a chance to try out what they've learned.\n"
      }, {
        "content": "CodeLab lessons are built directly into a [define code_editor] that closely resembles what professional developers use on a regular basis.\n"
      }, {
        "controller": "highlightFileBrowser",
        "content": "Files for a project are found in the [define file_browser] located on the left side of the screen.\n"
      }, {
        "waitForFile": "/index.html",
        "content": "Open the file named `index.html` by [define double_click double clicking] on the file in the [define file_browser].\n"
      }, {
        "controller": "highlightEditor",
        "content": "The left side of the screen is the [define code_editor]. This has many of the same features as modern code editors.\n"
      }, {
        "controller": "highlightPreviewArea",
        "content": "The right side of the screen is the [define preview_area]. Students are able to see the results of the code as they work.\n"
      }, {
        "controller": "addHeading",
        "content": "Let's have you try writing some HTML for yourself. Follow along with the instructions to add a heading to the page.\n\n[snippet base_example]\n"
      }, {
        "content": "Lessons will have multiple coding exercises that guide a student through writing code.\n"
      }, {
        "controller": "addImage",
        "content": "Let's write some more HTML, but this time let's add an image to the page.\n\nThis example is a little more complicated, but if you follow along with the instructions then you shouldn't have a problem!\n\n[snippet void_example]\n"
      }, {
        "content": "So far you've used [define html] to create a new heading and image. Maybe we need to use some [define css] to improve the visual appearance of the page!\n"
      }, {
        "content": "In later web development lessons we'll begin teaching students how to apply visual styles to their web pages using [define css].\n"
      }, {
        "controller": "addStylesheet",
        "content": "Let's see what kind of difference a little bit of [define css] can make to a web page.\n\nFollow the instructions in include a [define css] [define css_stylesheet stylesheet].\n\n[snippet css_stylesheet]\n"
      }, {
        "title": "About CodeLab",
        "mode": "overlay",
        "content": "CodeLab works entirely from this website, so students can write code and share creations without having to install software on their own computers.\n"
      }, {
        "content": "CodeLab focuses on teaching languages that are actively used by professionals today, such as [define html], [define css], and [define javascript].\n\nCodeLab offers courses in both basic computer programming and web development.\n"
      }, {
        "emote": "happy",
        "content": "Students have **access to their completed lessons from home** so they can continue to work on programming even when they aren't in class.\n\nAdditionally, students can create their own projects and websites and then **share them with friends and family**! \n"
      }, {
        "emote": "happy",
        "content": "If you have any questions about CodeLab, or if you're interested in reserving a space, use either of the links below to get started!\n\n[silent] <a class=\"assistant-button\" target=\"__ask_question\" href=\"https://docs.google.com/forms/d/e/1FAIpQLSeYOBUeymVmQXG654BhiQF7_97_3Okn7vxrSNozqkXy23cZjg/viewform\" >Ask a Question</a> <a class=\"assistant-button\" href=\"https://docs.google.com/forms/d/e/1FAIpQLSe7lZoyLEOu2EQZ0P1_vWJHh017SmCbPHsvmdP5OCEPm9fHcQ/viewform\" target=\"__reserve_space\" >Reserve a Space</a>\n"
      }, {
        "mode": "popup",
        "content": "I hope you enjoyed trying out CodeLab! You're free to continue experimenting with these files to see what kind of neat things you can make!\n\n**Create! Learn! And have fun writing code!**\n"
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
          "define": "This is the full definition value"
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
        "code_editor": {
          "id": "code_editor",
          "name": "Code Editor",
          "aka": "IDE",
          "define": "A program that is designed to make it easier to modify code files by including features such as syntax highlighting, auto-complete, and code validation.\n"
        },
        "preview_area": {
          "id": "preview_area",
          "name": "Preview Area",
          "define": "The right side of the screen that shows the current output of the project being worked on"
        },
        "css_stylesheet": {
          "id": "css_stylesheet",
          "name": "Stylesheet",
          "define": "The name of a file with CSS rules"
        },
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
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

},{"./addHeading":1,"./addImage":2,"./addStylesheet":3,"./controllers/waitForFile":4,"./controllers/waitForTab":5,"./highlightEditor":7,"./highlightFileBrowser":8,"./highlightPreviewArea":9,"./lib":11,"./validation":13}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{"./lib":11}],13:[function(require,module,exports){
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

},{}]},{},[10]);
