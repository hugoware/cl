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

},{"../lib":4}],2:[function(require,module,exports){
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

},{"../lib":4}],3:[function(require,module,exports){
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

var _linkIndex = require('./linkIndex');

var linkIndex = _interopRequireWildcard(_linkIndex);

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
var webIntroCssLesson = function () {

  // setup the lesson
  function webIntroCssLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, webIntroCssLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Introduction to CSS",
      "type": "web",
      "description": "Taking your first steps into using CSS!",
      "lesson": [{
        "mode": "overlay",
        "title": "Introduction to CSS",
        "content": "Welcome to your first lesson about how to use [define css].\n\n[define css] is very different than the [define html] you have been learning so far.\n"
      }, {
        "content": "[define css] stands for Cascading Style Sheet and is used to apply visual styles to an [define html] page.\n\nIn a sense, [define html] decides what a web page says, whereas [define css] decides what a web page looks like.\n"
      }, {
        "start": true,
        "content": "Before [define css] was introduced styles, such as fonts and colors, were applied to a page using even more [define html_element s].\n\n[snippet old_way]\n\nThis might seem like a straightforward approach, however it quickly became very difficult for developers to manage.\n"
      }, {
        "content": "For example, if you wanted to change the color you would simply update the [define html] attribute.\n\n[snippet old_way]\n\nThis might not seem like a lot for a single [define html_element], but if you had a website that had hundreds of instances of the same color you'd have to find and update each one.\n"
      }, {
        "content": "Additionally, if you were to make a mistake you could potentially cause the page to display incorrectly.\n\n[snippet old_way]\n\nNeedless to say, the old way was very time-consuming and prone to errors.\n"
      }, {
        "content": "Fortunately, [define css] was created to eliminate this problem and make it easier to control the visual style of an entire web site using just one single file.\n"
      }, {
        "content": "You may remember from an earlier lesson that we used the `link` [define html_element Element] to attach a file named `style.css` to a web page. That file was an example of a [define css_stylesheet].\n\nAfter the [define css_stylesheet] was linked the appearance of the web page changed dramatically.\n"
      }, {
        "content": "Let's take a look at a simple example of [define css]. We'll start by breaking down what each part is responsible for.\n\n[snippet basic_example]\n"
      }, {
        "content": "A [define css] [define css_stylesheet] is made up of many individual style rules called [define css_declaration_block s]. You will normally find many of these indvidual blocks in a single [define css_stylesheet]\n\n[snippet basic_example highlight:0,19,line]\n"
      }, {
        "start": true,
        "content": "The first part of a [define css_declaration_block l] is the [define css_selector]. You'll notice that this is the same name as an [define html_element] that you have used in earlier lessons.\n\n[snippet basic_example highlight:0,2]\n"
      }, {
        "content": "A [define css_selector] is responsible for _\"selecting\"_ the [define html_element Element] that should have the visual style applied to it.\n\n[snippet basic_example highlight:0,2]\n\nIn this example, the [define web_browser] would _\"select\"_ any `h1` [define html_element Elements] it found on the page and then apply the style to it.\n"
      }, {
        "content": "After the [define css_selector] is a `{`. This starts the [define css] [define css_declaration_block].\n\n[snippet basic_example highlight:3,1|18,1]\n\nEverything that's between the starting and ending curly braces are visual styles that will be applied to the [define html_element Element] that the [define css_selector] matched.\n"
      }, {
        "start": true,
        "content": "Each visual style inside of a [define css] [define css_declaration_block l] is called a [define css_declaration l].\n\n[snippet basic_example highlight:6,11]\n"
      }, {
        "content": "The first part of a [define css_declaration l] is the [define css_property l]. This identifies what should be changed on the [define html_element Element], such as colors, font types, and more.\n\n[snippet basic_example highlight:6,5]\n\nIn this example, the [define css_property l] is `color`, meaning that the text color of the selected `h1` [define html_element Elements] will be changed.\n"
      }, {
        "content": "After each [define css_property l] you must use a `:` before writing the next part of the [define css_declaration l].\n\n[snippet basic_example highlight:11,1]\n"
      }, {
        "content": "Next, the following [define css_value l] will be applied to the [define css_property l] of the selected [define html_element Elements].\n\n[snippet basic_example highlight:13,3]\n\nIn this example, all selected `h1` [define html_element Elements] would have their text color changed to the color _\"red\"_.\n"
      }, {
        "content": "Finally, you must end each [define css_declaration l] with a `;`. [define css] allows for [define css_declaration l] [define css_value ls] to go across multiple lines.\n\n[snippet basic_example highlight:16,1]\n\nWithout the `;`, the [define css] [define css_declaration l] would not know where to end.\n"
      }, {
        "content": "After you have finished writing all of the [define css_declaration ls] you plan to use it's important to use a `}` to end the [define css_declaration_block l].\n\n[snippet basic_example highlight:18,1]\n\nForgetting a `}` will most likely cause a [define css] [define css_stylesheet] to have errors and not display correctly.\n"
      }, {
        "content": "Here's an example of a somewhat more realistic [define css] file.\n\n[snippet multiple_props]\n\nYou'll notice each [define css_selector] has multiple [define css_declaration ls] that change the visual style of a variety of properties for each _\"selected\"_ [define html_element]\n"
      }, {
        "content": "There's a lot to learn when it comes to using [define css].\n\nIn later lessons we'll learn more about different types of [define css_selector s] you can use. We will also discuss good practices for organizing your [define css] files.\n"
      }, {
        "start": true,
        "mode": "popup",
        "emote": "happy",
        "content": "As usual, the best way to learn something new is to try it out for yourself!\n"
      }, {
        "waitForFile": "/index.html",
        "content": "Let's get started!\n\nOpen the file named `index.html` by [define double_click double-clicking] on it!\n"
      }, {
        "content": "You can see in the [define preview_area] that we have a basic web page that has no styles applied to it. The background is white and the font is a standard serif style black font.\n"
      }, {
        "controller": "linkIndex",
        "content": "Let's include the `||/style.css|style.css||` file by using a `link` [define html_element Element].\n\n_If you're having a hard time remembering how to add a `link` [define html_element Element] then use the *\"Show Hints\"* button for help._\n"
      }, {
        "waitForFile": "/style.css",
        "content": "Open the `style.css` file so we can take a look at the [define css_declaration ls]\n"
      }, {
        "content": "read the current data\n"
      }, {
        "content": "point out it needs to be linked\n"
      }, {
        "waitForFile": "/index.html",
        "content": "open html file\n"
      }, {
        "content": "edit html file to include `link`\n"
      }, {
        "content": "css is now updated\n"
      }, {
        "content": "switch back to CSS file\n"
      }, {
        "content": "edit the color for the background\n"
      }, {
        "content": "write a new rule for styling the header\n"
      }, {
        "content": "write another rule to style the paragraph\n"
      }, {
        "content": "as mentioned before, you can target more than one element with a comma\n"
      }, {
        "content": "write a rule for both the heading and paragraph to make the font sans-serif\n"
      }, {
        "content": "Looks good\n"
      }, {
        "content": "advantage of CSS is you can write it in one place and use it on many pages\n"
      }, {
        "content": "open other.html\n"
      }, {
        "content": "add the link to the css file (no hint)\n"
      }, {
        "content": "css is very flexible and works \n"
      }, {
        "mode": "popup",
        "content": "let's review what we've learned\n"
      }, {
        "title": "what does CSS stand for",
        "explain": "After the question is finished hint\n",
        "choices": ["Cascading Style Sheets", "Central Style System", "Cover Stenci and Slice", "Creative Syntax for Styles"]
      }, {
        "title": "What is the highlighted part called?",
        "content": "selector",
        "explain": "After the question is finished hint\n",
        "choices": ["A selector", "A segmenter", "A property", "A value"]
      }, {
        "title": "What is the highlighted part called?",
        "content": "declaration",
        "explain": "After the question is finished hint\n",
        "choices": ["A declaration", "A selector", "A linker", "A bytecode"]
      }, {
        "title": "CSS can be linked on multiple pages",
        "explain": "After the question is finished hint\n",
        "choices": ["True", "False"]
      }],
      "snippets": {
        "basic_example": {
          "content": "h1 {\n\tcolor: red;\n}",
          "type": "css"
        },
        "multiple_props": {
          "content": "h1 {\n\tcolor: red;\n\tfont-weight: bold;\n\tfont-size: 32px;\n}\n\np {\n\tcolor: purple;\n\tfont-style: italic;\n}",
          "type": "css"
        },
        "old_way": {
          "content": "<font size=\"5\" color=\"red\">\n\t<b>\n\t\t<u>\n\t\t\tHello, Old Way!\n\t\t</u>\n\t</b>\n</font>",
          "type": "html"
        }
      },
      "resources": [],
      "definitions": {
        "css": {
          "id": "css",
          "name": "CSS",
          "aka": "Cascading Style Sheets",
          "define": "Special rules for styling\n"
        },
        "css_declaration": {
          "id": "css_declaration",
          "name": "Declaration",
          "define": "A property and value pair"
        },
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full definition value"
        },
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements\n"
        },
        "css_stylesheet": {
          "id": "css_stylesheet",
          "name": "Stylesheet",
          "define": "The name of a file with CSS rules"
        },
        "css_declaration_block": {
          "id": "css_declaration_block",
          "name": "Declaration Block",
          "define": "A complete CSS definition including the Selector and Declarations"
        },
        "css_selector": {
          "id": "css_selector",
          "name": "Selector",
          "define": "Selection note"
        },
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
        "css_property": {
          "id": "css_property",
          "name": "Property",
          "define": "The target for a CSS declaration, such as color, background, font, and more"
        },
        "css_value": {
          "id": "css_value",
          "name": "Value",
          "define": "The value to use with the leading Property"
        },
        "double_click": {
          "id": "double_click",
          "name": "Double Click",
          "define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."
        },
        "preview_area": {
          "id": "preview_area",
          "name": "Preview Area",
          "define": "The right side of the screen that shows the current output of the project being worked on"
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
      linkIndex: linkIndex, validation: validation
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webIntroCssLesson, [{
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

  return webIntroCssLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_intro_css', webIntroCssLesson);

},{"./controllers/waitForFile":1,"./lib":4,"./linkIndex":5,"./validation":7}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '</head>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.start_link_index).clearBounds()._n.__b.merge(_validation.finish_link_index).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			emote: 'happy',
			message: 'Great! It appears that this [define css] file already has some [define css_declaration ls] in it!'
		});
	},
	onEnter: function onEnter() {
		this.editor.hint.disable();
	}
});

},{"./controllers/waitForValidation":2,"./lib":4,"./utils":6,"./validation":7}],6:[function(require,module,exports){
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

},{"./lib":4}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var start_link_index = exports.start_link_index = function start_link_index(test) {
	return test.__w$.doctype('html')._n.tag('html')._n._t.tag('head')._n._t._t.tag('title').content(5, 25).close('title')._n.__b._t._t.open('link')._s.attrs([['rel', 'stylesheet'], ['href', '/style.css']])._s$.close('/>');
};

var finish_link_index = exports.finish_link_index = function finish_link_index(test) {
	return test._t.close('head')._n.__b._t.tag('body')._n.__b._t._t.tag('h1').content(5, 50).close('h1')._n.__b._t._t.tag('p').content(5, 50).close('p')._n.__b._t._t.open('a')._s.attrs([['href', '/about.html']])._s$.close('>').content(5, 25).close('a')._n.__b._t.close('body').__b.close('html').__w$.eof();
};

},{}]},{},[3]);
