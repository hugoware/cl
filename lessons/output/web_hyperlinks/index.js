(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

	file: '/animals.html',

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '<a href="/index.html"',
			trimToLine: true
		});

		var allowed = ['fox', 'bear', 'cat'];

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.animals_start)._n._t$._t$._n;

		// include animal facts
		(0, _validation.animal_fact)(test, allowed);
		(0, _validation.animal_fact)(test, allowed);
		(0, _validation.animal_fact)(test, allowed);

		// resume testing
		test.clearBounds()._t$._t$._n.merge(_validation.return_home_link)._n._t$._t$._n.merge(_validation.animals_end).eof();
	},
	onValid: function onValid() {
		var animal = this.selectedAnimal;
		this.progress.allow();
		this.assistant.say({
			message: 'Great! Click on the picture of the ' + animal + ' to navigate to the `' + animal + '.html` page!'
		});
	}
});

},{"./controllers/waitForValidation":4,"./lib":8,"./utils":9,"./validation":10}],2:[function(require,module,exports){
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

	file: '/animals.html',

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '<a href="/index.html"',
			trimToLine: true
		});

		var allowed = ['fox', 'bear', 'cat'];

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.animals_start)._n._t$._t$._n;

		// include animal facts
		this.selectedAnimal = (0, _validation.animal_fact)(test, allowed);

		// resume testing
		test.clearBounds()._t$._t$._n.merge(_validation.return_home_link)._n._t$._t$._n.merge(_validation.animals_end).eof();
	},
	onValid: function onValid() {
		var animal = this.selectedAnimal;
		this.progress.allow();
		this.assistant.say({
			message: 'Great! Click on the picture of the ' + animal + ' to navigate to the `' + animal + '.html` page!'
		});
	}
});

},{"./controllers/waitForValidation":4,"./lib":8,"./utils":9,"./validation":10}],3:[function(require,module,exports){
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

},{"../lib":8}],4:[function(require,module,exports){
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
	if (config.init) config.init(obj);
}

},{"../lib":8}],5:[function(require,module,exports){
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
			expression: '</body>',
			trimToLine: true
		});

		// set the testing bounds
		test.merge(_validation.index_start)._n._t$._t$._n._t._t.open('a')._s.attrs([['href', '/animals.html']])._s$.close('>')._n._t._t._t.text('See the animals')._n._t._t.close('a')._n._t$._t$._n.merge(_validation.index_end).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That\'s correct! Unlike the `title` [define html_element Element] we can see this content displayed in the [define preview_area]'
		});
	}
});

},{"./controllers/waitForValidation":4,"./lib":8,"./utils":9,"./validation":10}],6:[function(require,module,exports){
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

	file: '/animals.html',

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '</body>',
			trimToLine: true
		});

		// set the testing bounds
		test.merge(_validation.animals_start)._n._t$._t$._n.merge(_validation.return_home_link)._n._t$._t$._n.merge(_validation.animals_end).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That\'s correct! Unlike the `title` [define html_element Element] we can see this content displayed in the [define preview_area]'
		});
	}
});

},{"./controllers/waitForValidation":4,"./lib":8,"./utils":9,"./validation":10}],7:[function(require,module,exports){
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

var _addAllImageLinks = require('./addAllImageLinks');

var addAllImageLinks = _interopRequireWildcard(_addAllImageLinks);

var _addSingleImageLink = require('./addSingleImageLink');

var addSingleImageLink = _interopRequireWildcard(_addSingleImageLink);

var _hrefToAnimals = require('./hrefToAnimals');

var hrefToAnimals = _interopRequireWildcard(_hrefToAnimals);

var _hrefToIndex = require('./hrefToIndex');

var hrefToIndex = _interopRequireWildcard(_hrefToIndex);

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
var webHyperlinksLesson = function () {

  // setup the lesson
  function webHyperlinksLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, webHyperlinksLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Using Hyperlinks",
      "type": "web",
      "description": "Learn how to link your pages together using hyperlinks!",
      "lesson": [{
        "mode": "overlay",
        "title": "Using Hyperlinks",
        "content": "In this lesson we're going to discuss using [define hyperlink s] to connect web pages together.\n\n[define hyperlink s] are more commonly known as simply *links*. These are the clickable areas on a web page that are used to navigate from one location to another on the [define internet].\n"
      }, {
        "content": "This is an example of a [define hyperlink]. Despite the fact that it's typically called a \"hyperlink\", the correct [define html_element] to use is the `a` [define html_element Element].\n\n[snippet base_link]\n\nThis can be confusing for new developers since there's also a `link` [define html_element Element] that does something completely different.\n"
      }, {
        "content": "For now, just remember that a [define hyperlink] is created using the `a` [define html_element Element].\n\n[snippet base_link]\n"
      }, {
        "content": "Something worth noting is that an `a` [define html_element Element] allows for content, which means that whatever is inside of this [define html_element Element] is the clickable area for the [define hyperlink link].\n\n[snippet base_link highlight:27,13]\n\nIn this case, the content is the text _\"Go to website\"_. By default, a web browser would display this using blue text that is underlined.\n"
      }, {
        "content": "Other [define html_element s] can also be used inside of a [define hyperlink]. Another common [define html_element] used is the `img` [define html_element Element].\n\n[snippet img_link highlight:27,22]\n\nUsing an `img` [define html_element] would create a clickable image on the web page.\n"
      }, {
        "content": "The next thing to look at is the [define html_attribute Attribute] used with a [define hyperlink]. The `href` [define html_attribute Attribute] is the _hypertext reference_. \n\n[snippet base_link highlight:3,20]\n\nThis decides the location of where the browser should navigate to when the [define hyperlink] is clicked. In this example, the location the browser will navigate to is the file `website.html`\n"
      }, {
        "content": "The value inside of the `href` [define html_attribute Attribute] is called a [define url]. This stands for *Uniform Resource Locator*, which is a very technical way of saying _a location of a file or website on the [define internet]_.\n\n[snippet base_link highlight:3,20]\n\nIn later lessons we will learn a lot more about [define url s] and how they work. For now, just remember that it's essentially an address for something on the [define internet]\n"
      }, {
        "mode": "popup",
        "content": "Let's try connecting a few web pages together using the `a` [define html_element Element].\n"
      }, {
        "waitForFile": "/index.html",
        "content": "There are a few different pages already added to this project. Let's start by making changes to `index.html`\n\nOpen the `index.html` file by [define double_click double clicking] on it.\n"
      }, {
        "content": "The hyperlink isn't clickable yet\n"
      }, {
        "controller": "hrefToAnimals",
        "content": "This page already has an `a` [define html_element Element]. Let's update it to include a `href` [define html_attribute Attribute] that will navigate to `||/animals.html|animals.html||`.\n"
      }, {
        "content": "Now we can navigate to the page, but we can't navigate back. Let's create a back button\n"
      }, {
        "waitForFile": "/animals.html",
        "content": "Open the `animals.html` file to edit\n"
      }, {
        "controller": "hrefToIndex",
        "content": "Now we can navigate to the page, but we can't navigate back. Let's create a [define hyperlink] to return to the starting page.\n"
      }, {
        "content": "Navigate to the index and back to the animals to make sure the links work as expected\n"
      }, {
        "content": "You'll notice the url in the preview area is updating\n"
      }, {
        "content": "Let's add some more hyperlinks - Click on the `animals.html` tab so we can \n"
      }, {
        "flags": "+OPEN_FILE",
        "start": true,
        "controller": "addSingleImageLink",
        "content": "Let's add an image link this time. Follow along with the instructions to add a link to one of the animal facts\n"
      }, {
        "content": "Navigate to each page\n"
      }, {
        "flags": "+OPEN_FILE",
        "start": true,
        "controller": "addAllImageLinks",
        "content": "Let's add an image link this time. Follow along with the instructions to add a link to one of the animal facts\n"
      }, {
        "content": "This page already has an `a` \n"
      }],
      "snippets": {
        "base_link": {
          "content": "<a href=\"/website.html\" >\n\tGo to website\n</a>",
          "type": "html"
        },
        "img_link": {
          "content": "<a href=\"/website.html\" >\n\t<img src=\"/cat.png\" />\n</a>",
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
        "hyperlink": {
          "id": "hyperlink",
          "name": "Hyperlink",
          "aka": "Link",
          "define": "An HTML Element that's used to link from one page to another resource using a URL.\n"
        },
        "internet": {
          "id": "internet",
          "name": "Internet",
          "define": "A world wide network of computers\n"
        },
        "html_attribute": {
          "id": "html_attribute",
          "name": "HTML Attribute",
          "define": "Something different for html stuff\n\n`<img src=\"something\" />`\n"
        },
        "url": {
          "id": "url",
          "name": "URL",
          "aka": "Universal Resource Locator",
          "define": "A location of a resource, such as a webpage or a file, somewhere on the Internet\n"
        },
        "double_click": {
          "id": "double_click",
          "name": "Double Click",
          "define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."
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
      addAllImageLinks: addAllImageLinks, addSingleImageLink: addSingleImageLink, hrefToAnimals: hrefToAnimals, hrefToIndex: hrefToIndex, validation: validation
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webHyperlinksLesson, [{
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

  return webHyperlinksLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_hyperlinks', webHyperlinksLesson);

},{"./addAllImageLinks":1,"./addSingleImageLink":2,"./controllers/waitForFile":3,"./hrefToAnimals":5,"./hrefToIndex":6,"./lib":8,"./validation":10}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.findBoundary = findBoundary;
exports.simplify = simplify;
exports.stringRange = stringRange;
exports.oxford = oxford;
exports.plural = plural;
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
function oxford(items, conjunction) {
	var total = items.length;

	// determine the best
	if (total === 1) return items.join('');else if (total == 2) return items.join(' ' + conjunction + ' ');

	// return the result
	else {
			var last = items.pop();
			return items.join(', ') + ', ' + conjunction + ' ' + last;
		}
}

// pluralizes a word
function plural(count, single, plural, none) {
	var delimeter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '@';

	var value = Math.abs(count);
	var message = value === 1 ? single : value > 1 ? plural ? plural : single + 's' : none || plural;
	return message.replace(delimeter, count);
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

},{"./lib":8}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.animal_fact = exports.animals_end = exports.return_home_link = exports.animals_start = exports.index_end = exports.index_start = undefined;

var _lib = require('./lib');

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
			arr2[i] = arr[i];
		}return arr2;
	} else {
		return Array.from(arr);
	}
}

var index_start = exports.index_start = function index_start(test) {
	return test.doctype('html')._n.tag('html')._n._t.tag('head')._n._t._t.tag('title').text('Animal Facts').close('title')._n._t.close('head')._n._t.tag('body')._n._t$._t$._n._t._t.tag('h1').text('Animal Facts').close('h1')._n._t._t.tag('p').text('The best place to learn animal facts!').close('p');
};

var index_end = exports.index_end = function index_end(test) {
	return test._t.close('body')._n.close('html');
};

var animals_start = exports.animals_start = function animals_start(test) {
	return test.doctype('html')._n.tag('html')._n._t.tag('head')._n._t._t.tag('title').text('Animal List').close('title')._n._t.close('head')._n._t.tag('body')._n._t$._t$._n._t._t.tag('h1').text('Animal List').close('h1')._n._t._t.tag('p').text('Click on an animal to learn more!').close('p');
};

var return_home_link = exports.return_home_link = function return_home_link(test) {
	return test._t._t.open('a')._s.attrs([['href', '/index.html']])._s$.close('>')._n._t._t._t.text('Go to home')._n._t._t.close('a');
};

var animals_end = exports.animals_end = function animals_end(test) {
	return test._t.close('body')._n.close('html');
};

// start checking the name
var animal_fact = exports.animal_fact = function animal_fact(test, allowed) {
	var selected = void 0;

	var links = ['href'].concat(_toConsumableArray(_lib._.map(allowed, function (key) {
		return '/' + key + '.html';
	})), [function (match) {
		selected = match.substr(0, match.length - 5).substr(1);
	}]);

	// create the opening link
	test._t._t.open('a')._s.attrs([links])._s$.close('>')._n;

	// create the correct url for the image
	test._t._t._t.open('img')._s.attrs([['src', '/' + selected + '.png']])._s$.close('/>')._n

	// then the closing link
	._t._t.close('a')._n;

	// remove the image from the list
	var index = allowed.indexOf(selected);
	allowed.splice(index, 1);

	return selected;
};

},{"./lib":8}]},{},[7]);
