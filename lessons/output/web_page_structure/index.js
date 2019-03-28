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

	file: '/index.html',

	validation: function validation(test, code) {

		var limitTo = (0, _utils.findBoundary)(code, {
			expression: '</html>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.start_of_doc)._n.merge(_validation.validate_empty_head)._n._t$._n.merge(_validation.validate_empty_body).clearBounds()._n.merge(_validation.end_of_doc).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Perfect! Now that we have a basic page structure we can start adding [define html_element Elements] to the `head` and `body`.'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./utils":15,"./validation":16}],2:[function(require,module,exports){
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
		test.setBounds(limitTo).merge(_validation.start_of_doc)._n._t.tag('head')._n._t._t.tag('title').singleLine.content(5, 20).close('title')._n._t.close('head')._n.__t$._n._t.tag('body')._n._t._t.tag('h1').singleLine.content(5, 25).close('h1')._n._t._t.tag('p').singleLine.content(5, 25).close('p').clearBounds()._n._t.close('body')._n.merge(_validation.end_of_doc).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That\'s correct! Unlike the `title` [define html_element Element] we can see this content displayed in the [define preview_area]'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./utils":15,"./validation":16}],3:[function(require,module,exports){
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
		return test.merge(_validation.validate_doctype).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That looks good! In the past the `doctype` had more complexities you had to be aware of, but fortunately it\'s been greatly simplified in modern web development.'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./validation":16}],4:[function(require,module,exports){
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
			expression: '</html>',
			trimToLine: true
		});

		// set the testing bounds
		test.setBounds(limitTo).merge(_validation.start_of_doc)._n.merge(_validation.validate_empty_head).clearBounds()._n._t$._n._t$.merge(_validation.end_of_doc).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That looks correct! We\'ll come back to this [define html_element Element] later, but for now let\'s continue creating the page structure.'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./utils":15,"./validation":16}],5:[function(require,module,exports){
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
		return test.merge(_validation.validate_html).eof();
	},

	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Perfect! This [define html_element Element] ensures that the web browser knows that it\'s dealing with an [define html] document.'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./validation":16}],6:[function(require,module,exports){
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
		test.setBounds(limitTo).merge(_validation.start_of_doc)._n._t.tag('head')._n._t._t.tag('title').singleLine.content(5, 20).close('title')._n._t._t.open('meta')._s.matchAttributeSequence.attrs([['name', 'author'], ['value', /^[^"']{1,20}/, 'Expected an author name']])._s$.close('/>')._n._t._t.open('link')._s.matchAttributeSequence.attrs([['rel', 'stylesheet'], ['href', '/style.css']])._s$.close('/>').clearBounds()._n._t.close('head')._n.__t$._n._t.tag('body')._n._t._t.tag('h1').singleLine.content(5, 25).close('h1')._n._t._t.tag('p').singleLine.content(5, 25).close('p')._n._t.close('body')._n.merge(_validation.end_of_doc).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Wow! What a difference [define css] can make in what a web page looks like! We\'re going to have a lot of fun when we get to that lesson!'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./utils":15,"./validation":16}],7:[function(require,module,exports){
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
		test.setBounds(limitTo).merge(_validation.start_of_doc)._n._t.tag('head')._n._t._t.tag('title').singleLine.content(5, 20).close('title')._n._t._t.open('meta')._s.matchAttributeSequence.attrs([['name', 'author'], ['value', /^[^"']{1,20}/, 'Expected an author name']])._s$.close('/>').clearBounds()._n._t.close('head')._n.__t$._n._t.tag('body')._n._t._t.tag('h1').singleLine.content(5, 25).close('h1')._n._t._t.tag('p').singleLine.content(5, 25).close('p')._n._t.close('body')._n.merge(_validation.end_of_doc).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'That\'s correct! The `meta` [define html_element Element] won\'t appear on the page, but now [define search_engine s] will know the author of the page!'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./utils":15,"./validation":16}],8:[function(require,module,exports){
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
		test.setBounds(limitTo).merge(_validation.start_of_doc)._n._t.tag('head')._n._t._t.tag('title').singleLine.content(5, 20).close('title').clearBounds()._n._t.close('head')._n.__t$._n.merge(_validation.validate_empty_body).__t$._n.merge(_validation.end_of_doc).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Great! If you were to open this page in a new window you\'d see the title you just added in the browser tab!'
		});
	}
});

},{"./controllers/waitForValidation":11,"./lib":13,"./utils":15,"./validation":16}],9:[function(require,module,exports){
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

},{"../lib":13}],10:[function(require,module,exports){
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

},{"../lib":13}],11:[function(require,module,exports){
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

			console.log('vv', config);
			if ('area' in config) this.editor.area({ path: config.file, start: config.area.start, end: config.area.end });

			if ('cursor' in config) {
				this.editor.focus();
				setTimeout(function () {
					_this.editor.cursor({ path: config.file, index: config.cursor });
				}, 10);
			}

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

			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (config.onExit) config.onExit.apply(this, args);
		}
	}, config.extend);

	// extra logic as required
	if (config.init) config.init.call(obj, obj);
}

},{"../lib":13}],12:[function(require,module,exports){
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

var _addBody = require('./addBody');

var addBody = _interopRequireWildcard(_addBody);

var _addContent = require('./addContent');

var addContent = _interopRequireWildcard(_addContent);

var _addDoctype = require('./addDoctype');

var addDoctype = _interopRequireWildcard(_addDoctype);

var _addHead = require('./addHead');

var addHead = _interopRequireWildcard(_addHead);

var _addHtml = require('./addHtml');

var addHtml = _interopRequireWildcard(_addHtml);

var _addLink = require('./addLink');

var addLink = _interopRequireWildcard(_addLink);

var _addMeta = require('./addMeta');

var addMeta = _interopRequireWildcard(_addMeta);

var _addTitle = require('./addTitle');

var addTitle = _interopRequireWildcard(_addTitle);

var _showCurrentTitle = require('./showCurrentTitle');

var showCurrentTitle = _interopRequireWildcard(_showCurrentTitle);

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
var webPageStructureLesson = function () {

  // setup the lesson
  function webPageStructureLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, webPageStructureLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Page Structure",
      "type": "web",
      "description": "Understanding the core structure of a web page",
      "lesson": [{
        "mode": "overlay",
        "title": "Understanding Page Structure",
        "content": "In this lesson we're going to talk about the proper way to create a new [define web_page l]. We will be learning about specific [define html_element s] that are used as the foundation for a typical [define web_page l].\n"
      }, {
        "content": "So far we've used [define html] to create headings and paragraphs by adding [define html_element s] to a page.\n\nEven though we could see what we typed in the [define codelab_html_preview], the code was not written properly according to [define html] rules.\n"
      }, {
        "content": "For the most part, [define web_browser s] are very forgiving when displaying [define html]. Most [define web_browser s] will attempt to show a result for the [define html] even if there are errors in the code.\n\nHowever, as smart as [define web_browser s] might be, it's always a good idea to write your code in a way that it makes it easier for the browser to understand the intent of your [define web_page l].\n"
      }, {
        "content": "In this lesson, we will be creating a default web page structure so we can understand the purpose of each [define html_element].\n\nIf you don't remember everything, don't worry. Most modern [define code_editor s] will automatically create the required [define html] page structure when you create a new file.\n"
      }, {
        "clearTitle": true,
        "content": "This is an example of a basic [define html] page. There are additional [define html_element Elements] here you haven't seen before.\n\n[snippet base_empty]\n"
      }, {
        "content": "The `doctype` [define html_element Element] is used to decide the version of [define html] being used. In modern web development, this is normally set to `html`.\n\n[snippet base_empty highlight:0,15]\n"
      }, {
        "content": "The `head` [define html_element Element] acts as a container for other [define html_element s]. For the most part, [define html_element Elements] inside of the `head` [define html_element Element] are used to update page information that's not visible to the user.\n\n[snippet base_empty highlight:23,17,line]\n"
      }, {
        "content": "By contrast, the `body` [define html_element Element] is where most [define html_element s] that are displayed to the user are added.\n\nFor example, the [define html_element s] you have already learned about, such as headings, paragraphs, and images, should be added to the `body` [define html_element Element].\n\n[snippet base_empty highlight:41,17,line]\n"
      }, {
        "content": "The `html` [define html_element Element] is used to tell the web browser that the contents of this file are an [define html] document. Both the `head` and `body` [define html_element Elements] should always be placed within the `html` [define html_element Element].\n\n[snippet base_empty highlight:16,50,line]\n"
      }, {
        "content": "Let's look at an example of an [define html] document that has some content.\n\n[snippet base_empty]\n"
      }, {
        "content": "The `head` [define html_element Element] contains several [define html_element s] that are not visible to the user. This includes information like the page title, author name, and links to external resources.\n\n[snippet base highlight:24,134,line size:small]\n"
      }, {
        "content": "The `body` [define html_element Element] contains the [define html] that's displayed to the user. If you were to look at this page in a web browser, you'd see the heading and image file displayed, but not anything from inside the `head` [define html_element Element]\n\n[snippet base highlight:160,58,line size:small]\n"
      }, {
        "mode": "popup",
        "content": "Now that we've covered the basic structure of an [define html] page, let's try to write one for ourselves.\n"
      }, {
        "waitForFile": "/index.html",
        "content": "Open the file named `index.html` in the [define file_browser]\n"
      }, {
        "content": "Since we're going to be creating an entire page structure from scratch, this file is completely blank.\n"
      }, {
        "content": "The first [define html_element Element] that should appear in an [define html] document is the `doctype`. The `doctype` is used to identify the version of HTML being used.\n\nFor modern web development, this is fairly simple as there's only one type you need to use.\n"
      }, {
        "controller": "addDoctype",
        "content": "Follow along with the instructions to add the correct `doctype` to the page.\n"
      }, {
        "content": "The next [define html_element] that we need to create is the `html` [define html_element Element]. This is used to wrap the entire [define html] document.\n\nBasically, any [define html_element s] between the opening and closing `html` tag are considered to be part of the document.\n"
      }, {
        "controller": "addHtml",
        "content": "Follow along with the instructions to add the opening and closing `html` tags.\n"
      }, {
        "content": "The next [define html_element] we are going to add is the `head` Element.\n\nThe `head` [define html_element Element] has quite a few varied purposes.\n"
      }, {
        "content": "For one, it is used to hold information about the page that is not visually displayed. This include data like descriptions, author names, copyright dates, supported languages and more. \n\nThis information is read by search engines to identify what is on your page.\n"
      }, {
        "content": "The `head` Element is also where you define the page title. The page title is the text that appears on the tab in the browser.\n"
      }, {
        "content": "Finally, the `head` is used to include external resources, for example [define css] styles. We haven't talked about [define css] just yet but will cover it and a few lessons from now.\n"
      }, {
        "controller": "addHead",
        "content": "Follow along with the instructions to add the `head` Element and some information about this page.\n"
      }, {
        "content": "Finally, the `body` Element is used to wrap all visual content for a page. This includes text, images, videos, forms, and more.\n\nEssentially, if it should be visible to the visitor of the page, it probably should be in the `body` Element.\n"
      }, {
        "controller": "addBody",
        "content": "Follow along with the instructions to add the `body` Element to your page.\n"
      }, {
        "controller": "showCurrentTitle",
        "content": "Let's start by adding a title to this page. The `title` [define html_element Element] will change the name of the page as it appears in a browser tab.\n\nYou can see in the [define preview_area] that the current title is _\"Untitled Page\"_\n"
      }, {
        "controller": "addTitle",
        "content": "Use the `title` [define html_element Element] to add a title to your page.\n\nDon't forget that the `title` [define html_element Element] should be placed inside of the `head` [define html_element Element].\n"
      }, {
        "content": "You probably noticed that even though you added an [define html_element Element] to the page it did not show up in the [define preview_area]. Instead, the title of the page was changed.\n\nThe `title` is a special [define html_element] that is not displayed visually as content.\n"
      }, {
        "content": "Now that there's a title for this page why not try adding some content.\n"
      }, {
        "controller": "addContent",
        "content": "Add a `h1` and `p` [define html_element Element] to this page.\n\nDon't forget that content like the `h1` and `p` [define html_element Elements] should be placed inside of the `body` [define html_element Element].\n"
      }, {
        "content": "Let's add some more [define html_element s] to the `head` [define html_element Element] on the page.\n"
      }, {
        "content": "A `meta` [define html_element Element] is sometimes used by [define search_engine s] to collect extra information about your page. There are many `meta` [define html_element Elements] that you can use to describe the content of your page.\n"
      }, {
        "controller": "addMeta",
        "content": "Let's add a `meta` [define html_element Element] that describes the author of the page. Follow along with that example to create a new `meta` [define html_element Element].\n"
      }, {
        "content": "There are other purposes for `meta` [define html_element Elements], but we will cover those in later lessons.\n"
      }, {
        "content": "The `head` [define html_element Element] also acts as a container for external resources. One of the most common examples of an external resource is a [define css] [define css_stylesheet].\n"
      }, {
        "content": "Similar to using the `img` element, a [define css] [define css_stylesheet] is a file that must be included in a web page using a special [define html_element].\n"
      }, {
        "content": "We haven't learned much about [define css] just yet, but to summarize [define css] is a list of rules used to change things like colors, fonts, layout, and more. \n\nWhen a [define css] [define css_stylesheet] is linked to a web page the rules in the file are used to change what the page looks like.\n"
      }, {
        "content": "This project already has a premade [define css] [define css_stylesheet] called `style.css`. The rules in the file will change the background color of the page, as well as the font type and font color.\n"
      }, {
        "controller": "addLink",
        "content": "Follow the instructions to add a `link` [define html_element Element] to the `style.css` file.\n\nDon't forget that this [define html_element Element] should be placed inside of the `head` [define html_element Element].\n"
      }, {
        "emote": "happy",
        "content": "Great work! By using a `doctype`, and the `html`, `head`, and `body` [define html_element Elements], we've now created a correctly structured web page!\n\nFollowing best practices and writing good code is a great way become a better developer.\n"
      }, {
        "mode": "overlay",
        "title": "What is the purpose of the `doctype` Element?",
        "explain": "The `doctype` is used to identify which version of [define html] your page is using. However, in modern web development this is typically going to be set to simply `\"html\"`.\n",
        "choices": ["Identifies the version of HTML the page is using", "Enables spellcheck for the page content", "Disables images and video files", "Changes the background color of the web page"]
      }, {
        "title": "What is NOT a purpose of the `head` Element?",
        "explain": "The head element has many purposes, such as holding meta-information, the page title, and references for external resources.\n",
        "choices": ["Showing a photo of the current web page visitor", "Container for meta-information like description and author", "Holds the `title` Element for the page", "Container for references to external resources"]
      }, {
        "title": "What should go inside of the `body` Element?",
        "explain": "Generally speaking, the `body` Element contains the content that should be seen by the webpage visitor such as text, images, videos, and more.\n",
        "choices": ["Content that should be seen by the visitor", "The `title` Element for the page", "The `doctype` Element for the page", "Meta-information like a page description or author name"]
      }, {
        "mode": "popup",
        "emote": "happy",
        "content": "We will be learning more about [define css] in later lessons, but for now you're free to open the `style.css` file and make changes to it.\n\nIf you do, make sure to try changing color names and sizes to see what happens!\n"
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {
        "base": {
          "content": "<!DOCTYPE html>\n<html>\n\t<head>\t\t\n\t\t<title>Hello, World!</title>\n\t\t<meta name=\"author\" name=\"CodeLab\" />\n\t\t<link rel=\"stylesheet\" href=\"/style.css\" />\n\t</head>\n\t<body>\n\t\t<h1>Hello!</h1>\n\t\t<img src=\"/cat.png\" />\n\t</body>\n</html>",
          "type": "html"
        },
        "base_empty": {
          "content": "<!DOCTYPE html>\n<html>\n\t<head>\n\n\t</head>\n\t<body>\n\n\t</body>\n</html>",
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
        "css": {
          "id": "css",
          "name": "CSS",
          "aka": "Cascading Style Sheets",
          "define": "Special rules for styling\n"
        },
        "search_engine": {
          "id": "search_engine",
          "name": "Search Engine",
          "define": "Search Engines will index web pages to make them easier to find by using **robots**. This includes reading the HTML on a web page to better understand the page content.\n"
        },
        "web_page": {
          "id": "web_page",
          "name": "Web Page",
          "define": "An individual view of a web site.\n"
        },
        "codelab_html_preview": {
          "id": "codelab_html_preview",
          "name": "Preview Area",
          "define": "You can see your HTML as you type\n"
        },
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
        "code_editor": {
          "id": "code_editor",
          "name": "Code Editor",
          "aka": "IDE",
          "define": "A program that is designed to make it easier to modify code files by including features such as syntax highlighting, auto-complete, and code validation.\n"
        },
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
        },
        "css_stylesheet": {
          "id": "css_stylesheet",
          "name": "Stylesheet",
          "define": "The name of a file with CSS rules"
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
      addBody: addBody, addContent: addContent, addDoctype: addDoctype, addHead: addHead, addHtml: addHtml, addLink: addLink, addMeta: addMeta, addTitle: addTitle, showCurrentTitle: showCurrentTitle, validation: validation
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webPageStructureLesson, [{
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

  return webPageStructureLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_page_structure', webPageStructureLesson);

},{"./addBody":1,"./addContent":2,"./addDoctype":3,"./addHead":4,"./addHtml":5,"./addLink":6,"./addMeta":7,"./addTitle":8,"./controllers/waitForFile":9,"./controllers/waitForTab":10,"./lib":13,"./showCurrentTitle":14,"./validation":16}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight('#preview .title', { x: -15, expandX: 10 });
}

function onExit() {
	this.screen.highlight.clear();
}

},{}],15:[function(require,module,exports){
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

},{"./lib":13}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var validate_doctype = exports.validate_doctype = function validate_doctype(test) {
	return test.__w$.doctype('html')._n;
};

var validate_html = exports.validate_html = function validate_html(test) {
	return test.merge(validate_doctype).tag('html')._n._n.close('html');
};

var start_of_doc = exports.start_of_doc = function start_of_doc(test) {
	return test.merge(validate_doctype).tag('html');
};

var end_of_doc = exports.end_of_doc = function end_of_doc(test) {
	return test.close('html');
};

var validate_empty_head = exports.validate_empty_head = function validate_empty_head(test) {
	return test._t.tag('head')._n._t$._t$._n._t.close('head');
};

var validate_empty_body = exports.validate_empty_body = function validate_empty_body(test) {
	return test._t.tag('body')._n._t$._t$._n._t.close('body');
};

var validate_title = exports.validate_title = function validate_title(test) {
	return test._t.tag('title').content(5, 25).close('title')._n;
};

},{}]},{},[12]);
