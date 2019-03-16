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
		var args = [content].concat(config.validation);
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
	if (config.init) config.init(obj);
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

var _multipleAttributes = require('./multipleAttributes');

var multipleAttributes = _interopRequireWildcard(_multipleAttributes);

var _multipleImages = require('./multipleImages');

var multipleImages = _interopRequireWildcard(_multipleImages);

var _srcExample = require('./srcExample');

var srcExample = _interopRequireWildcard(_srcExample);

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// lesson controller
var webAttributesLesson = function () {

  // setup the lesson
  function webAttributesLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, webAttributesLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Using Attributes",
      "type": "web",
      "description": "Using HTML Attributes to extend HTML Elements",
      "lesson": [{
        "mode": "overlay",
        "title": "Using HTML Elements",
        "content": "In this lesson we're going to look at how to use [define html_attribute s].\n\n[define html_attribute s] are a way to provide additional information about the behavior of an [define html_element].\n"
      }, {
        "content": "To help explain the concept of an [define html_attribute], let's walk through a simple scenario. \n\nLet's say we wanted to add an image to a web page. The correct [define html_element] to use in this case is the `img` Element.\n\n[snippet img_no_attr]\n"
      }, {
        "content": "However, what's interesting about the `img` [define html_element Element] is that it's a [define void_element], meaning it can't have any content.\n\nAll of the [define html_element s] you have written so far have only allowed you to use text. In this case, we want to display an image file.\n\n[snippet img_no_attr]\n"
      }, {
        "content": "This is where you can use an [define html_attribute] to provide additional information so our `img` [define html_element Element] knows what to do.\n\n[snippet img_with_attr]\n\nLet's walk through each of the parts that make up an [define html_attribute].\n"
      }, {
        "content": "To start, an [define html_attribute] needs a name. This name will change depending on the purpose, much like the name of an [define html_element] changes its behavior in the [define web_browser].\n\n[snippet img_with_attr highlight:5,3]\n\nIn this case, the `img` [define html_element Element] uses the `src` [define html_attribute Attribute] to tell the [define web_browser] where to find the image file to display.\n"
      }, {
        "content": "The next character that is shown is an `||=|equal sign||`.\n\n[snippet img_with_attr highlight:8,1]\n\nA good way to remember this is that the name is equal to the value, which comes at the end of the [define html_attribute].\n"
      }, {
        "content": "The value of the [define html_attribute] is placed between two _double quotes_, one at the beginning of the value and the other at the end. \n\n[snippet img_with_attr highlight:9,1|18,1]\n\nYou're also allowed to use _single quotes_, however most developers only use _double quotes_ when writing [define html].\n"
      }, {
        "content": "Everything between the two _double quotes_ is the value. In this case, the value tells the `img` [define html_element Element] the location of the image file to display.\n\n[snippet img_with_attr highlight:10,8]\n\n_The \"value\" everything between the in this example is called a [define url]. We haven't discussed how [define url s] work just yet, but we'll be covering them very soon._\n"
      }, {
        "mode": "popup",
        "content": "Trying something out on our own is a much better way to understand a new concept. Let's give this a try so you can see it in action.\n"
      }, {
        "controller": "waitForIndex",
        "content": "Open the `index.html` file in the [define file_browser]\n"
      }, {
        "controller": "srcExample",
        "content": "Follow along with the instructions to add an image to this page. Use the `src` [define html_attribute Attribute] to tell the `img` [define html_element Element] where to find the image file to display.\n"
      }, {
        "start": true,
        "flags": "+OPEN_FILE",
        "content": "When the web page was read by the [define web_browser] it found the `img` [define html_element Element] and ||read|red|| the `src` [define html_attribute Attribute]. This gave the [define web_browser] the location of the file to display on the page.\n"
      }, {
        "controller": "multipleImages",
        "content": "Let's try that again! Choose any two images that you like and then add them to the page. Use an `img` [define html_element Element] as you did with the previous example.\n\nLook at the [define file_browser] for a list of images that are available in this project.\n"
      }, {
        "content": "Great! You can see that an [define html_attribute] allows us to provide additional instructions for [define html_element Elements] to change its behavior.\n"
      }, {
        "mode": "overlay",
        "content": "HTML elements are not limited to just one single attribute. You're actually able to use many HTML attributes at a time.\n"
      }, {
        "content": "You can see in the example below, it's possible to add more than one [define html_attribute] to an [define html_element Element] so long as there's a space placed between each one.\n\n[snippet multiple_attrs]\n"
      }, {
        "content": "In fact, it's not at all uncommon to have an [define html_element] that has multiple [define html_attribute Attributes].\n\n[snippet multiple_attrs]\n"
      }, {
        "mode": "popup",
        "content": "Let's try adding more [define html_attribute Attributes] to the images that you just added to the page.\n"
      }, {
        "start": true,
        "controller": "multipleAttributes",
        "content": "Try adding a `width` and `height` [define html_attribute Attribute] to each of the images on the page.\n\nUse the code example below as a reference if you are unsure on what to type. Trying something out\n\n[snippet width_height]\n"
      }, {
        "content": "Let's try out a few more examples that use attributes.\n"
      }, {
        "slide": "overlay",
        "content": "Great work! Let's review what we've learned in this lesson.\n"
      }, {
        "title": "What is the name the the `highlighted` section of code?",
        "content": "[snippet anchor_example highlight:3,20]\n",
        "explain": "And [define html_attribute] is an additional instruction that can be added to an [define html_element] to change its behavior. An [define html_attribute] is placed within and [define html_element Elements] opening tag.\n",
        "choices": ["HTML Attribute", "HTML Navigator", "Void Element", "Natural Delimiter"]
      }, {
        "title": "What is the preferred type of quote to use with [define html_attribute]?",
        "explain": "In HTML you can use both _single quotes_ and _double quotes_ for [define html_attribute], but double quotes are preferred.\n",
        "choices": ["Double quotes `\"`", "Single quotes `'`"]
      }, {
        "title": "What is the highlighted part of this [define html_attribute]?",
        "content": "[snippet anchor_example highlight:3,4]\n",
        "explain": "An [define html_attribute] always starts with its name. The **name** decides the behavior of the [define html_attribute].\n",
        "choices": ["Name", "Terminator", "Encoder", "Byte"]
      }, {
        "title": "What is the highlighted part of this [define html_attribute]?",
        "content": "[snippet anchor_example highlight:9,13]\n",
        "explain": "The characters between the _double quotes_ are the value of the [define html_attribute]. The **value** of an [define html_attribute] can greatly change the behavior of an [define html_element].\n",
        "choices": ["Value", "Proxy", "Extender", "Namespace"]
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {
        "anchor_example": {
          "content": "<a href=\"http://google.com\" >\n\tBrowse to Google\n</a>",
          "type": "html"
        },
        "img_no_attr": {
          "content": "<img />",
          "type": "html"
        },
        "img_with_attr": {
          "content": "<img src=\"/dog.jpg\" />",
          "type": "html"
        },
        "multiple_attrs": {
          "content": "<img src=\"/dog.png\" width=\"100\" height=\"400\" />",
          "type": "html"
        },
        "other_page": {
          "content": "<a href=\"/example.html\" >\n\tShow example page\n</a>",
          "type": "html"
        },
        "width_height": {
          "content": "<img src=\"/...\" width=\"100\" height=\"50\" />",
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
        "html_attribute": {
          "id": "html_attribute",
          "name": "HTML Attribute",
          "define": "Something different for html stuff\n\n`<img src=\"something\" />`\n"
        },
        "void_element": {
          "id": "void_element",
          "name": "Void Element",
          "define": "An HTML Element that does not have a separate closing tag. Also does not contain content.    \n"
        },
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full definition value"
        },
        "url": {
          "id": "url",
          "name": "URL",
          "aka": "Universal Resource Locator",
          "define": "A location of a resource, such as a webpage or a file, somewhere on the Internet\n"
        },
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
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
      multipleAttributes: multipleAttributes, multipleImages: multipleImages, srcExample: srcExample, validation: validation, waitForIndex: waitForIndex
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webAttributesLesson, [{
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

  return webAttributesLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_attributes', webAttributesLesson);

},{"./lib":4,"./multipleAttributes":5,"./multipleImages":6,"./srcExample":7,"./validation":8,"./waitForIndex":9}],4:[function(require,module,exports){
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

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

(0, _waitForValidation2.default)(module.exports, {

	file: '/index.html',

	validation: function validation(test) {
		return test.merge(_validation.multiple_images_with_sizes).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Check it out! The `img` [define html_element Element] is now displayed as an actual image in the [define preview_area].'
		});
	}
});

},{"./controllers/waitForValidation":2,"./lib":4,"./validation":8}],6:[function(require,module,exports){
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
		return test.merge(_validation.multiple_images).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Check it out! The `img` [define html_element Element] is now displayed as an actual image in the [define preview_area].'
		});
	}
});

},{"./controllers/waitForValidation":2,"./lib":4,"./validation":8}],7:[function(require,module,exports){
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
	cursor: 6,

	validation: function validation(test) {
		return test.merge(_validation.first_src).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Check it out! The `img` [define html_element Element] is now displayed as an actual image in the [define preview_area].'
		});
	},
	init: function init(controller) {

		controller.onBeforeContentChange = function (file, change) {
			return !change.hasNewlines;
		};
	}
});

},{"./controllers/waitForValidation":2,"./lib":4,"./validation":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var first_src = exports.first_src = function first_src(test) {
	return test.__w$.open('img')._s.attr({ src: '/cat.png' })._s$.close('/>')._n.__w$;
};

var multiple_images = exports.multiple_images = function multiple_images(test) {

	// add the cat image
	test.merge(first_src);

	// validators per collection
	var validate = function validate(match) {
		var index = allowed.indexOf(match);
		allowed.splice(index, 1);
	};

	// check for the remaining two
	var allowed = ['/bear.png', '/bunny.png', '/fox.png', '/owl.png'];

	// only allow two matches
	for (var i = 0; i < 2; i++) {
		var _test$open$_s;

		(_test$open$_s = test.open('img')._s).attrs.apply(_test$open$_s, ['src'].concat(allowed, [validate]))._s$.close('/>')._n.__w$;
	}

	// don't allow anymore
	test.eof();
};

var multiple_images_with_sizes = exports.multiple_images_with_sizes = function multiple_images_with_sizes(test) {

	// validators per collection
	var validate = function validate(match) {
		var index = allowed.indexOf(match);
		allowed.splice(index, 1);
	};

	// check for the remaining two
	var allowed = ['/cat.png', '/bear.png', '/bunny.png', '/fox.png', '/owl.png'];

	test.__w$;

	// only allow two matches
	for (var i = 0; i < 3; i++) {
		test.open('img')._s.attrs([['height', /^[0-9]{3,4}/, 'Expected number'], ['width', /^[0-9]{3,4}/, 'Expected number'], ['src', '/cat.jpg', 'dog.jpg']])._s$.close('/>')._n.__w$;
	}

	// don't allow anymore
	test.eof();
};

},{}],9:[function(require,module,exports){
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
