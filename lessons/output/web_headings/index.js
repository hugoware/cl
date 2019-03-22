(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../lib":9}],2:[function(require,module,exports){
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
		if (config.validator === 'code' || /\.js$/.test(config.file)) validator = _lib.CodeValidator;else if (config.validator === 'html' || /\.html?$/.test(config.file)) validator = _lib.HtmlValidator;
		// else if (config.validator === 'css' || /\.css$/.test(config.file))
		// 	validator = CssValidator;

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
			if ('area' in config) this.editor.area({ path: config.file, start: config.area.start, end: config.area.end });

			if ('cursor' in config) this.editor.cursor({ path: config.file, index: config.cursor });

			validate(this);
		},
		onContentChange: function onContentChange(file) {
			validate(this);

			if (state.isValid) return;
			this.progress.block();
			this.assistant.revert();
		},
		onExit: function onExit() {
			this.file.readOnly({ path: config.file });
		}
	});

	// extra logic as required
	if (config.init) config.init.call(obj, obj);
}

},{"../lib":9}],3:[function(require,module,exports){
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

var _insertAllHeadings = require('./insertAllHeadings');

var insertAllHeadings = _interopRequireWildcard(_insertAllHeadings);

var _insertH = require('./insertH1');

var insertH1 = _interopRequireWildcard(_insertH);

var _insertLineBreak = require('./insertLineBreak');

var insertLineBreak = _interopRequireWildcard(_insertLineBreak);

var _insertMultilineParagraph = require('./insertMultilineParagraph');

var insertMultilineParagraph = _interopRequireWildcard(_insertMultilineParagraph);

var _insertParagraph = require('./insertParagraph');

var insertParagraph = _interopRequireWildcard(_insertParagraph);

var _replaceLineBreak = require('./replaceLineBreak');

var replaceLineBreak = _interopRequireWildcard(_replaceLineBreak);

var _validation = require('./validation');

var validation = _interopRequireWildcard(_validation);

var _waitForIndex = require('./waitForIndex');

var waitForIndex = _interopRequireWildcard(_waitForIndex);

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
var webHeadingsLesson = function () {

  // setup the lesson
  function webHeadingsLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, webHeadingsLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Headings, Paragraphs, and Breaks",
      "type": "web",
      "description": "Learn about various ways to control text using HTML",
      "lesson": [{
        "mode": "overlay",
        "title": "Headings and Paragraphs",
        "content": "In this lesson we're going to start working with different types of [define html_element Elements] used for formatting text in [define html].\n\nThere are many [define html_element Elements] you can use to display text in [define html], but in this lesson we will be focusing on the **heading** and **paragraph** [define html_element Elements].\n"
      }, {
        "content": "The **heading** [define html_element Elements] are used when starting new sections of content on a page. By default, headings are displayed in a large and bold font.\n\n[snippet heading_example]\n"
      }, {
        "content": "Paragraphs are used to display sections of text. [define web_browser s] will generally display **paragraphs** with additional spacing around them.\n\nIn most cases, you'll have more **paragraphs** than **headings** on a page.\n"
      }, {
        "content": "Headings are also used by screen readers to help blind people identify sections of your web page, as well as help [define search_engine s] understand the structure of the content.\n\nYou should not use **headings** as a means to change the size or boldness of a font. In later lessons we will learn the correct way to change the style of text on your web page.\n"
      }, {
        "mode": "popup",
        "controller": "waitForIndex",
        "content": "Let's get started adding some headings to a page.\n\nOpen the file named `index.html` in the [define file_browser] on the left side of the screen.\n"
      }, {
        "controller": "insertH1",
        "content": "At this point you're already familiar with writing [define html_element s]. Let's start by adding a `h1` [define html_element element] to this page.\n\n[snippet heading_example]\n"
      }, {
        "controller": "insertAllHeadings",
        "content": "Okay, let's do that again for the remaining heading [define html_element elements].\n\nThere are six in total heading elements in [define html]. Add the remaining five heading elements to this page.\n"
      }, {
        "title": "Using Paragraphs",
        "mode": "overlay",
        "content": "Paragraphs are another way to add text to your webpage, but these aren't intended to mark new sections on the page.\n\nInstead, paragraphs are typically used for large passages of text.\n"
      }, {
        "mode": "popup",
        "controller": "insertParagraph",
        "content": "Add a new paragraph to this page by using the `p` tag.\n\n[snippet paragraph_example]\n"
      }, {
        "content": "In each of the examples we've done so far all of the text has been on one line. However, HTML allows you to put text on multiple lines.\n"
      }, {
        "mode": "popup",
        "controller": "insertMultilineParagraph",
        "content": "Let's try that again, but this time we're going to add a new line in the `p` [define html_element Element]\n\n[snippet paragraph_multiline]\n"
      }, {
        "content": "You'll notice that even though the text is on multiple lines, the [define codelab_html_preview] displays all of the text on a single line.\n\nIn HTML, new lines are displayed as a single space between characters.\n"
      }, {
        "content": "This creates a problem when we're trying to add a new line to a web page. However, like with most things in HTML, we can use an [define html_element] to solve this problem.\n"
      }, {
        "title": "Using Line Breaks",
        "mode": "overlay",
        "content": "The `br` tag is used to create line breaks, meaning that a new line is displayed wherever the [define html_element] is placed in the code.\n\n[snippet linebreak]\n"
      }, {
        "content": "You probably noticed that this [define html_element] looks different than the other tags you've written so far.\n\n[snippet linebreak highlight:4,2]\n\nUnlike the other HTML elements you've added, this [define html_element Element] does not have a separate closing tag.\n"
      }, {
        "content": "This is called a [define void_element], meaning that it does not have any content.\n\nYou'll also hear these referred to as _self-closing_ tags or _empty tags_.\n"
      }, {
        "mode": "popup",
        "content": "There are many other [define html_element s] that are also [define void_element s]. You'll learn more about these and later lessons.\n"
      }, {
        "controller": "insertLineBreak",
        "content": "Let's add a `br` [define html_element element] between the two lines from the previous example.\n\n[snippet insert_linebreak]\n"
      }, {
        "content": "It's important to learn what different [define html_element Elements] can do in [define html], but it's also important to learn which [define html_element s] to avoid.\n\nFor example, the `br` [define html_element Element] is **not the recommended** way to insert new lines in an [define html] file.\n"
      }, {
        "content": "In fact, the recommended way is to use multiple paragraphs. It might seem like we're adding extra code, but this actually becomes immensely useful when we start using [define css] to apply visual styles to web pages.\n"
      }, {
        "controller": "replaceLineBreak",
        "content": "Let's go back and replace the `br` [define html_element Element] by using two separate `p` [define html_element Elements].\n\n[snippet replace_linebreak]\n"
      }, {
        "content": "Although it doesn't seem like much of a change, it's recommended to use `p` [define html_element Elements] instead of a `br` [define html_element Element].\n\nThis'll all make much more sense when we introduce [define css] in later lessons!\n"
      }, {
        "mode": "overlay",
        "content": "Great work! let's review what we've learned in this lesson!\n"
      }, {
        "title": "New lines in [define html] are displayed...",
        "explain": "Adding a new line to a webpage will display as a single space. Also, interestingly, multiple spaces in HTML are also displayed has a single space.\n",
        "choices": ["... as a space", "... as a tab", "... as a normal new line", "... as a semi-colon"]
      }, {
        "title": "The `br` [define html_element Element] is known as a...",
        "content": "[snippet linebreak]\n",
        "explain": "A `br` [define html_element Element] is known as a [define void_element], meaning it does not have content. A [define void_element] also does not have a separate closing tag.\n",
        "choices": ["Void Element", "Zero Element", "Terminator Element", "Bytecode Element"]
      }, {
        "title": "Using the `h1` [define html_element Element] is a great way to make large and bold text",
        "explain": "By default, the heading elements are displayed using bold letters. However, there are much better ways to apply visual styles to your web page.\n",
        "choices": ["False", "True"]
      }, {
        "title": "The `br` [define html_element Element] is the recommended way to separate lines of text",
        "explain": "Using the `br` [define html_element Element] will separate text onto multple lines, but it's actually recommended to use `p` [define html_element Elements] instead.\n",
        "choices": ["False", "True"]
      }, {
        "mode": "popup",
        "content": "As you can see, HTML has multiple [define html_element Elements] you can use to add content to your webpages.\n"
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {
        "heading_example": {
          "content": "<h1>Hello, world!</h1>",
          "type": "html"
        },
        "insert_linebreak": {
          "content": "<p>\n\tline number 1\n\t<br />\n\tline number 2\n</p>",
          "type": "html"
        },
        "linebreak": {
          "content": "<br />",
          "type": "html"
        },
        "multiline": {
          "content": "<p>\n\tParagraphs can be\n\ton multiple lines\n</p>",
          "type": "html"
        },
        "paragraph_example": {
          "content": "<p>This is a paragraph</p>",
          "type": "html"
        },
        "paragraph_multiline": {
          "content": "<p>\n\tline number 1\n\tline number 2\n</p>",
          "type": "html"
        },
        "replace_linebreak": {
          "content": "<p>line number 1</p>\n<p>line number 2</p>",
          "type": "html"
        }
      },
      "resources": [],
      "definitions": {
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements\n"
        },
        "preview_area": {
          "id": "preview_area",
          "name": "Preview Area",
          "define": "The right side of the screen that shows the current output of the project being worked on"
        },
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full definition value"
        },
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
        "search_engine": {
          "id": "search_engine",
          "name": "Search Engine",
          "define": "Search Engines will index web pages to make them easier to find by using **robots**. This includes reading the HTML on a web page to better understand the page content.\n"
        },
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
        },
        "codelab_html_preview": {
          "id": "codelab_html_preview",
          "name": "Preview Area",
          "define": "You can see your HTML as you type\n"
        },
        "void_element": {
          "id": "void_element",
          "name": "Void Element",
          "define": "An HTML Element that does not have a separate closing tag. Also does not contain content.    \n"
        },
        "css": {
          "id": "css",
          "name": "CSS",
          "aka": "Cascading Style Sheets",
          "define": "Special rules for styling\n"
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
      insertAllHeadings: insertAllHeadings, insertH1: insertH1, insertLineBreak: insertLineBreak, insertMultilineParagraph: insertMultilineParagraph, insertParagraph: insertParagraph, replaceLineBreak: replaceLineBreak, validation: validation, waitForIndex: waitForIndex
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webHeadingsLesson, [{
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
    }

    // // leaves a slide
    // deactivateSlide(slide) {

    // }

    // executes an action if available

  }, {
    key: 'invoke',
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

  return webHeadingsLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_headings', webHeadingsLesson);

},{"./controllers/waitForFile":1,"./insertAllHeadings":4,"./insertH1":5,"./insertLineBreak":6,"./insertMultilineParagraph":7,"./insertParagraph":8,"./lib":9,"./replaceLineBreak":10,"./validation":11,"./waitForIndex":12}],4:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _validation = require('./validation');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.merge(_validation.validate_all_headings).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That\'s a lot of heading [define html_element Elements]! Each one is displayed using a different size than the others.'
		});
	},
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines || change.hasNewlines && !controller.validation.inTag;
		};
	}
});

},{"./controllers/waitForValidation":2,"./lib":9,"./validation":11}],5:[function(require,module,exports){
'use strict';

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.__w$.tag('h1').append({ inTag: true }).rejectNewLineInContent.content(5, 15).close('h1').append({ inTag: false })._n.__w$.eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That looks good! The [define preview_area] now shows the heading you just added.'
		});
	},

	// setup any custom stuff
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines || change.hasNewlines && !controller.validation.inTag;
		};
	}
});

},{"./controllers/waitForValidation":2}],6:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.merge(_validation.validate_all_headings).merge(_validation.validate_single_line_paragraph).merge(_validation.validate_multi_line_paragraph_with_break).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That did it! Each phrase is now displayed on a separate line in the [define preview_area].'
		});
	},
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines || change.hasNewlines && !controller.validation.inTag;
		};
	}
});

},{"./controllers/waitForValidation":2,"./lib":9,"./validation":11}],7:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.merge(_validation.validate_all_headings).merge(_validation.validate_single_line_paragraph).merge(_validation.validate_multi_line_paragraph).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'surprised',
			message: 'Great! It may seem odd, but even though both phrases are on the same line **that\'s the expected result**!'
		});
	},
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines || change.hasNewlines && !controller.validation.inTag;
		};
	}
});

},{"./controllers/waitForValidation":2,"./lib":9,"./validation":11}],8:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var $inTag = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.merge(_validation.validate_all_headings).merge(_validation.validate_single_line_paragraph).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Very good! The `p` [define html_element Element] created a new block of text in the [define preview_area].'
		});
	},
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines || change.hasNewlines && !controller.validation.inTag;
		};
	}
});

},{"./controllers/waitForValidation":2,"./lib":9,"./validation":11}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.merge(_validation.validate_all_headings).merge(_validation.validate_single_line_paragraph).merge(_validation.validate_multiple_paragraphs).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Much better! Now each phrase is on a seprate line and inside of its own [define html_element].'
		});
	},
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines || change.hasNewlines && !controller.validation.inTag;
		};
	}
});

},{"./controllers/waitForValidation":2,"./lib":9,"./validation":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}return arr2;
	} else {
		return Array.from(arr);
	}
}

var validate_all_headings = exports.validate_all_headings = function validate_all_headings(test) {
	var headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

	// capture each heading
	var heading = function heading(sub) {
		var _sub$__w$;

		// the heading in this test
		var current = void 0;

		// captures and validates the heading used
		var capture = function capture(tag) {
			current = tag;

			// remove the allowed tag
			var index = headings.indexOf(tag);
			headings.splice(index, 1);
		};

		// check the tag
		(_sub$__w$ = sub.__w$).tag.apply(_sub$__w$, _toConsumableArray(headings.concat(capture))).append({ inTag: true }).singleLine.content(5, 20).close(current).append({ inTag: false })._n.__w$;
	};

	// check each heading
	return test.merge(heading).merge(heading).merge(heading).merge(heading).merge(heading).merge(heading);
};

var validate_single_line_paragraph = exports.validate_single_line_paragraph = function validate_single_line_paragraph(test) {
	return test.tag('p').append({ inTag: true }).singleLine.content(5, 25).close('p').append({ inTag: false })._n.__w$;
};

var validate_multi_line_paragraph = exports.validate_multi_line_paragraph = function validate_multi_line_paragraph(test) {
	return test.tag('p')._n._t.singleLine.content('line number 1')._n._t.singleLine.content('line number 2')._n.close('p')._n.__w$;
};

var validate_multi_line_paragraph_with_break = exports.validate_multi_line_paragraph_with_break = function validate_multi_line_paragraph_with_break(test) {
	return test.tag('p')._n._t.singleLine.content('line number 1')._n._t.open('br')._s$.close('/>')._n._t.singleLine.content('line number 2')._n.close('p')._n.__w$;
};

var validate_multiple_paragraphs = exports.validate_multiple_paragraphs = function validate_multiple_paragraphs(test) {
	return test.tag('p').append({ inTag: true }).singleLine.content('line number 1').close('p').append({ inTag: false })._n.tag('p').append({ inTag: true }).singleLine.content('line number 2').close('p').append({ inTag: false })._n.__w$;
};

},{}],12:[function(require,module,exports){
'use strict';

var _waitForFile = require('./controllers/waitForFile');

var _waitForFile2 = _interopRequireDefault(_waitForFile);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForFile2.default)(module.exports, {
	file: '/index.html'
});

},{"./controllers/waitForFile":1}]},{},[3]);
