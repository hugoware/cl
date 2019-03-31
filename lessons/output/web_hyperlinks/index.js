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
		test.setBounds(limitTo).merge(_validation.animals_start).lines(1, 3);

		// include animal facts
		(0, _validation.animal_fact)(test, allowed);
		test.lines(1, 3);

		(0, _validation.animal_fact)(test, allowed);
		test.lines(1, 3);

		(0, _validation.animal_fact)(test, allowed);

		// resume testing
		test.clearBounds().lines(1, 3).merge(_validation.return_home_link).lines(1, 3).merge(_validation.animals_end).eof();
	},
	onValid: function onValid() {
		var animal = this.selectedAnimal;
		this.progress.allow();
		this.assistant.say({
			message: 'Fantastic! That looks like you got all of them!'
		});
	},
	onEnter: function onEnter() {
		this.editor.hint.disable();
	}
});

},{"./controllers/waitForValidation":5,"./lib":9,"./utils":16,"./validation":17}],2:[function(require,module,exports){
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
		this.state.animalType = (0, _validation.animal_fact)(test, allowed);

		// resume testing
		test.clearBounds()._t$._t$._n.merge(_validation.return_home_link)._n._t$._t$._n.merge(_validation.animals_end).eof();
	},
	onValid: function onValid() {
		this.progress.allow();
		this.assistant.say({
			message: 'Great! Now we have an `img` [define html_element Element] that\'s also a [define hyperlink link] to another page!'
		});
	}
});

},{"./controllers/waitForValidation":5,"./lib":9,"./utils":16,"./validation":17}],3:[function(require,module,exports){
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

},{"../lib":9}],4:[function(require,module,exports){
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

},{"../lib":9}],5:[function(require,module,exports){
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

},{"../lib":9}],6:[function(require,module,exports){
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
			message: 'Looks good! The [define hyperlink link] even changed colors to blue which means it\'s now able to be used.'
		});
	},
	init: function init() {

		this.onBeforePreviewAreaNavigate = function () {
			return false;
		};
	}
});

},{"./controllers/waitForValidation":5,"./lib":9,"./utils":16,"./validation":17}],7:[function(require,module,exports){
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
			emote: 'happy',
			message: 'Perfect! Now we have two [define hyperlink links] that connect the `index.html` and `animals.html` pages together!'
		});
	},
	init: function init() {

		this.onBeforeNavigatePreviewArea = function () {
			return false;
		};
	}
});

},{"./controllers/waitForValidation":5,"./lib":9,"./utils":16,"./validation":17}],8:[function(require,module,exports){
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

var _addAllImageLinks = require('./addAllImageLinks');

var addAllImageLinks = _interopRequireWildcard(_addAllImageLinks);

var _addSingleImageLink = require('./addSingleImageLink');

var addSingleImageLink = _interopRequireWildcard(_addSingleImageLink);

var _hrefToAnimals = require('./hrefToAnimals');

var hrefToAnimals = _interopRequireWildcard(_hrefToAnimals);

var _hrefToIndex = require('./hrefToIndex');

var hrefToIndex = _interopRequireWildcard(_hrefToIndex);

var _navigateAnimalPages = require('./navigateAnimalPages');

var navigateAnimalPages = _interopRequireWildcard(_navigateAnimalPages);

var _navigateIndex = require('./navigateIndex');

var navigateIndex = _interopRequireWildcard(_navigateIndex);

var _navigateSinglePage = require('./navigateSinglePage');

var navigateSinglePage = _interopRequireWildcard(_navigateSinglePage);

var _navigateToList = require('./navigateToList');

var navigateToList = _interopRequireWildcard(_navigateToList);

var _requireAnimalsTab = require('./requireAnimalsTab');

var requireAnimalsTab = _interopRequireWildcard(_requireAnimalsTab);

var _showSwitchingTabs = require('./showSwitchingTabs');

var showSwitchingTabs = _interopRequireWildcard(_showSwitchingTabs);

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
        "content": "This page already has an `a` [define html_element Element] but it isn't clickable yet. This is because it's missing an `href` [define html_attribute Attribute].\n"
      }, {
        "controller": "hrefToAnimals",
        "content": "Let's update the [define hyperlink link] to include an `href` [define html_attribute Attribute] so it will navigate to `||/animals.html|animals.html||`.\n"
      }, {
        "controller": "navigateToList",
        "content": "Let's make sure that the [define hyperlink link] works as expected. Try to navigate to `animals.html` by clicking on *\"See the animals\"*\n"
      }, {
        "highlight": "$preview .url",
        "content": "That worked! We were able to navigate to the `animals.html` page!\n\nYou'll notice that the address bar has changed and now says `||/animals.html|animals.html||`.\n"
      }, {
        "content": "However, this page doesn't have a link that returns to the previous page so we're not able to navigate back.\n\nLet's add another [define hyperlink link] to this page to take us back to `index.html`.\n"
      }, {
        "waitForFile": "/animals.html",
        "content": "Start by opening the `animals.html` file by [define double_click double clicking] on it so we can make some changes.\n"
      }, {
        "highlight": "$workspace .tab[file=\"/animals.html\"]",
        "controller": "showSwitchingTabs",
        "content": "You'll notice that now we have more than one file open. You can switch back and forth between the two files by clicking on the tab of the file you want to view.\n\nThis is very useful when you're trying to work with more than one page at a time.\n"
      }, {
        "controller": "requireAnimalsTab"
      }, {
        "controller": "hrefToIndex",
        "content": "Alright, let's continue adding a [define hyperlink link] to take the user back to the `index.html` page.\n\nFollow along with instructions to create a complete [define hyperlink link].\n"
      }, {
        "controller": "navigateIndex",
        "content": "Before we continue, let's make sure the [define hyperlink links] behave as expected. \n\nNavigate to `index.html` and then back to the `animals.html` page.\n"
      }, {
        "controller": "addSingleImageLink",
        "content": "Let's add some more [define hyperlink links] to the `animals.html` page, but this time let's use an `img` [define html_element Element]!\n\nFollow along with the instructions to add an image [define hyperlink link] to one of the animal facts\n"
      }, {
        "controller": "navigateSinglePage"
      }, {
        "content": "Let's practice that a few more times by adding the remaining animal images as [define hyperlink links] to each of their pages.\n\nCode hints will be turned off this time so make sure to look at the previous example for help. If you get stuck, use the *\"Enable Hints\"* button to turn them back on.\n"
      }, {
        "controller": "addAllImageLinks",
        "content": "Add image [define hyperlink links] for the remaining animals like you did with the %%animalType%%.\n"
      }, {
        "controller": "navigateAnimalPages"
      }, {
        "emote": "happy",
        "content": "Great work! We've created a whole website with [define hyperlink links] that connect each of the pages together!\n"
      }, {
        "mode": "overlay",
        "content": "We've learned a lot in this lesson so let's take a few minutes to review!\n"
      }, {
        "title": "What is another name for a *link* on a web page?",
        "explain": "Links are also known as [define hyperlink s] although most people will use the former name as opposed to the latter.\n",
        "choices": ["Hyperlink", "Hypercard", "URL Binder", "Meta Resource"]
      }, {
        "title": "What is the `a` [define html_element Element] used for?",
        "explain": "The `a` element is used to create [define hyperlink s]. Hyperlinks can be used to navigate between different locations on the [define internet] among other things.\n",
        "choices": ["Creating links to other pages", "Displaying images and videos", "Meta information like author names and page keywords", "Setting a font to use bold letters"]
      }, {
        "title": "What does the phrase **URL** stand for?",
        "explain": "URL stands for *Uniform Resource Locator*. Although they're not exactly the same, you'll sometimes hear developers call them a *||URI|u r i||* instead.\n",
        "choices": ["Uniform Resource Locator", "Undefined Rail Laser", "Unified Radio Logistics", "Unidirectional Repeating Loopback"]
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
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
      addAllImageLinks: addAllImageLinks, addSingleImageLink: addSingleImageLink, hrefToAnimals: hrefToAnimals, hrefToIndex: hrefToIndex, navigateAnimalPages: navigateAnimalPages, navigateIndex: navigateIndex, navigateSinglePage: navigateSinglePage, navigateToList: navigateToList, requireAnimalsTab: requireAnimalsTab, showSwitchingTabs: showSwitchingTabs, validation: validation
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

  return webHyperlinksLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_hyperlinks', webHyperlinksLesson);

},{"./addAllImageLinks":1,"./addSingleImageLink":2,"./controllers/waitForFile":3,"./controllers/waitForTab":4,"./hrefToAnimals":6,"./hrefToIndex":7,"./lib":9,"./navigateAnimalPages":10,"./navigateIndex":11,"./navigateSinglePage":12,"./navigateToList":13,"./requireAnimalsTab":14,"./showSwitchingTabs":15,"./validation":17}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onNavigatePreviewArea = onNavigatePreviewArea;
exports.onExit = onExit;

var _lib = require('./lib');

var _utils = require('./utils');

var controller = exports.controller = true;

var DEFAULT_MESSAGE = 'Try to navigate to each of the animal pages to make sure each link works.';

var $done = void 0;
var $remaining = void 0;

function getMessage() {

	if (!_lib._.some($remaining)) {
		return 'Navigate back to the `animals.html` page by using the link that says _"Go back to Animals"_.';
	}

	// needs to show animals
	var remains = (0, _utils.oxfordize)($remaining, 'and');
	var pages = (0, _utils.pluralize)($remaining, 'page');
	return DEFAULT_MESSAGE + '\n\nNavigate to the ' + remains + ' ' + pages + ' by clicking on the image of the animal.';
}

function onActivateLesson() {
	$done = undefined;
	$remaining = ['fox.html', 'bear.html', 'cat.html'];
}

function onEnter() {
	this.file.readOnly({ path: '/index.html' });
	this.file.readOnly({ path: '/animals.html' });
	this.progress.block();

	this.assistant.say({
		message: getMessage()
	});
}

function onNavigatePreviewArea(url) {
	if ($done) return;

	// remove a page
	var remove = $remaining.indexOf(url.substr(1));
	if (remove > -1) $remaining.splice(remove, 1);

	// check if finished
	if (url !== '/animals.html' || _lib._.some($remaining)) {
		return this.assistant.say({
			message: getMessage(),
			silent: !($remaining.length === 3 || $remaining.length === 0)
		});
	}

	// looks like it worked
	$done = true;
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'Way to go! It looks like all of the [define hyperlink links] work as expected!'
	});
}

function onExit() {

	this.events.clear();
}

},{"./lib":9,"./utils":16}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onBeforeNavigatePreviewArea = onBeforeNavigatePreviewArea;
exports.onNavigatePreviewArea = onNavigatePreviewArea;
var controller = exports.controller = true;

var $hasIndex = void 0;
var $hasAnimals = void 0;

function onActivateLesson() {
	$hasIndex = undefined;
	$hasAnimals = undefined;
}

function onEnter() {
	this.progress.block();
}

function onBeforeNavigatePreviewArea() {
	return !($hasAnimals || $hasIndex);
}

function onNavigatePreviewArea(url) {

	if (url === '/index.html') {
		$hasIndex = true;
		return;
	}

	if (url === '/animals.html' && $hasIndex) {
		$hasAnimals = true;
		this.assistant.say({
			emote: 'happy',
			message: 'Looks good! Both of the [define hyperlink links] are working as expected!'
		});

		return this.progress.allow();
	}
}

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onNavigatePreviewArea = onNavigatePreviewArea;
exports.onExit = onExit;
var controller = exports.controller = true;

var $remaining = void 0;
var $toAnimals = void 0;
var $toList = void 0;

function onActivateLesson() {
	$toAnimals = undefined;
	$toList = undefined;
	$remaining = ['/fox.html', '/bear.html', '/cat.html', '/animals.html'];
}

function onEnter() {
	this.file.readOnly({ path: '/index.html' });
	this.file.readOnly({ path: '/animals.html' });
	this.progress.block();

	var animal = this.state.animalType;
	this.assistant.say({
		message: 'Let\'s try out the new [define hyperlink link] we just added! Click on the picture of the ' + animal + ' to navigate to the `' + animal + '.html` page!'
	});
}

function onNavigatePreviewArea(url) {

	// animal page
	if (!$toAnimals && /\/(fox|bear|cat)\.html/i.test(url)) {
		$toAnimals = true;
		this.assistant.say({
			message: 'Now use the `Go back to Animals` link to return to the previous page.'
		});
	}

	// has visited the animal page
	if ($toAnimals && /\/animals\.html/i.test(url)) $toList = true;

	// not far enough
	if (!($toAnimals && $toList)) return;

	// looks like it worked
	this.progress.allow();
	this.assistant.say({
		emote: 'happy',
		message: 'Fantastic! That looks like it worked!'
	});
}

function onExit() {

	this.events.clear();
}

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onNavigatePreviewArea = onNavigatePreviewArea;
var controller = exports.controller = true;

function onEnter() {
	this.progress.block();
}

function onNavigatePreviewArea(url) {
	if (url !== '/animals.html') return;
	return this.progress.next();
}

},{}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onChangeTab = onChangeTab;
exports.onEnter = onEnter;
var controller = exports.controller = true;

function onChangeTab(tab) {
	if (tab.path !== '/animals.html') return;
	this.progress.next();
	return true;
}

function onEnter() {

	// check if already active
	var tab = this.editor.activeTab();
	if (tab && tab.path === '/animals.html') {
		return this.progress.next();
	}

	// must be on the correct tab
	this.progress.block();
	this.screen.highlight('#workspace .tab[file="/animals.html"]');
	this.assistant.say({
		message: 'Switch to the `animals.html` tab by clicking on it.'
	});
}

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onChangeTab = onChangeTab;
var controller = exports.controller = true;

function onChangeTab() {
	this.screen.highlight.clear();
	return true;
}

},{}],16:[function(require,module,exports){
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

},{"./lib":9}],17:[function(require,module,exports){
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

},{"./lib":9}]},{},[8]);
