(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
var controller = exports.controller = true;

function onEnter() {

	// Opera 8.0+
	var isOpera = !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

	// Firefox 1.0+
	var isFirefox = typeof InstallTrigger !== 'undefined';

	// Safari 3.0+ "[object HTMLElementConstructor]" 
	var isSafari = /constructor/i.test(window.HTMLElement) || function (p) {
		return p.toString() === "[object SafariRemoteNotification]";
	}(!window['safari'] || typeof safari !== 'undefined' && safari.pushNotification);

	// Internet Explorer 6-11
	var isIE = /*@cc_on!@*/false || !!document.documentMode;

	// Edge 20+
	var isEdge = !isIE && !!window.StyleMedia;

	// Chrome 1 - 71
	var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

	// Blink engine detection
	var isBlink = (isChrome || isOpera) && !!window.CSS;

	// get the name
	var name = isOpera ? 'Opera' : isFirefox ? 'Firefox' : isSafari ? 'Safari' : isIE ? 'Internet Explorer' : isEdge ? 'Edge' : isChrome ? 'Chrome' : isBlink ? 'Blink' : null;

	var tell = name ? 'For example, the name of the web browser you\'re using is *' + name + '*!' : 'However, in this case I\'m not sure what browser you\'re using';

	this.assistant.say('\nWhen you browse the [define internet], you visit [define website websites] that show you information. That information is displayed on your screen using a [define web_browser web browser].\n\nThere\'s many web browsers that are used such as Chrome, Firefox, Safari, and more.\n\n' + tell);
}

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onOpenFile = onOpenFile;
exports.onEnter = onEnter;
var controller = exports.controller = true;

function onOpenFile(file) {
	this.screen.highlight.clear();
}

function onEnter() {
	this.screen.highlight.fileBrowser();
}

},{}],3:[function(require,module,exports){
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


var _browserType = require('./browserType');

var browserType = _interopRequireWildcard(_browserType);

var _highlightFileBrowser = require('./highlightFileBrowser');

var highlightFileBrowser = _interopRequireWildcard(_highlightFileBrowser);

var _waitForIndexHtml = require('./waitForIndexHtml');

var waitForIndexHtml = _interopRequireWildcard(_waitForIndexHtml);

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

// performs the oxford comma
function $oxford(items, conjunction) {
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
function $plural(count, single, plural, none) {
  var delimeter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '@';

  var value = Math.abs(count);
  var message = value === 1 ? single : value > 1 ? plural ? plural : single + 's' : none || plural;
  return message.replace(delimeter, count);
}

// lesson controller

var web1Lesson = function () {

  // setup the lesson
  function web1Lesson(project, lesson, api, utils) {
    var _this = this;

    _classCallCheck(this, web1Lesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Introduction to Web Development",
      "type": "web",
      "description": "Getting started on learning the basics of Web Development",
      "lesson": [{
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "Welcome to your first lesson on creating web pages!\n\nAs you work through this lesson you will be asked to complete certain tasks before you can move onto the next step.\n"
      }, {
        "content": "In this tutorial we're going to start learning the basics of creating web pages.\n\nHowever, before we start learning how to write code, it's best to take a little bit of time and learn how web pages work _behind the scenes_.\n"
      }, {
        "controller": "browserType"
      }, {
        "content": "Generally speaking, web pages viewed in the browser are created using just three different core technologies.\n\n[image tech.png]\n\nIn fact, it's entirely possible that every single website you've ever visited has used all three of these technologies at the same time!\n"
      }, {
        "content": "[define html] is the foundation for all [define web_page web pages]. [define html] is a language that determines the words and content that are displayed in the web browser.\n\n[image html-focus.png]\n\nIn a sense, [define html] is what your web page _says_.\n"
      }, {
        "content": "[define css] is a language that's used to determine the visual appearance of a web page. Colors, font sizes, layout, and more are defined by the rules written in [define css]\n\n[image css-focus.png]\n\nSimply put, [define css] decides what your web page _looks like_.\n"
      }, {
        "content": "Finally, [define javascript] is a programming language that can be used to create logic and behaviors on a web page. Many modern websites use [define javascript] to create complicated applications that run entirely in the [define web_browser browser]\n\n[image javascript-focus.png]\n\nGenerally speaking, [define javascript] decides what your web page _will do_.\n"
      }, {
        "content": "Each time you vist a [define website website], code files like [define html], [define css], and [define javascript] are sent to your computer. The [define web_browser] uses the instructions in each of these files to create the [define web_page web page] you see on the screen.\n\n[image build.jpg frame]\n"
      }, {
        "content": "There's a lot to learn when it comes to creating web pages, but with practice and time you'll be building entire websites before you know it.\n\n[image html-focus.png]\n\nAt the start of this tutorial series, we're going to focus on learning [define html] and then introduce [define css] and [define javascript] at a later time.\n"
      }, {
        "emotion": "happy",
        "content": "Great! So let's get started learning some [define html]!"
      }, {
        "title": "What is HTML?",
        "content": "[define html] is a language that's used to describe the information found in a web page. It's written using instructions called [define html_element Elements]. An [define html_element] is made up of several parts called [define html_tag tags].\n\nBelow is an example of a simple [define html_element].\n\n[snippet html_tag_example]\n\nLet's go over what each part of this code example ||does|duz||. \n"
      }, {
        "content": "An [define html_element] starts with an opening [define html_tag tag]. It's written by surrounding the name of the tag with a `<` and `>` sign.\n\n[snippet html_tag_example highlight:0,1|3,1]\n"
      }, {
        "content": "The word between the opening and closing tags is the type. Each [define html_element] has a different role in the web browser. For example, this `h1` Element is a heading.\n\n[snippet html_tag_example highlight:1,2]\n"
      }, {
        "content": "At the end of an [define html_element] is the closing [define html_tag tag]. It's written much like the opening tag, but there's also a `/` character after the first `<`.\n\nThe closing [define html_tag] is very important because it marks where a [define html_element] ends. Otherwise, the Element would continue to the end of the page.\n\n[snippet html_tag_example highlight:30,5]\n"
      }, {
        "content": "At the end of an [define html_element] is the closing [define html_tag tag]. It's written much like the opening tag, but there's also a `/` character after the first `<`.\n\nThe closing [define html_tag] is very important because it marks where a [define html_element] ends. Otherwise, the Element would continue to the end of the page.\n\n[snippet html_tag_example highlight:30,5]\n"
      }, {
        "content": "Everything between the opening and closing tags for an [define html_element] is the content. This Element is a _heading_. If you were to look at this in a browser it would show up as the phrase \"This is an example of HTML\" in a large and bold font\n\n[snippet html_tag_example highlight:4,26]\n"
      }, {
        "start": true,
        "mode": "popup",
        "content": "We've talked a lot about what [define html] is and how it works, so let's actually try writing code and see what happens.\n"
      }, {
        "controller": "highlightFileBrowser",
        "content": "On the left side of the screen is the [define file_browser]. This is a list of all files in your project.\n"
      }, {
        "controller": "waitForIndexHtml",
        "content": "Open the file named `index.html` by [define double_click double clicking] on it in the [define file_browser].\n"
      }, {
        "title": "FINISHED WARNING",
        "content": "about to finish"
      }, {
        "title": "FINISHED",
        "content": "did finish"
      }],
      "snippets": {
        "complex_tag": {
          "content": "<div>\n  <h1>The Title</h1>\n  <p>The main content!</p>\n</div>",
          "type": "html"
        },
        "html_tag_example": {
          "content": "<h1>This is an example of HTML</h1>",
          "type": "html"
        }
      },
      "resources": [{
        "height": 559,
        "width": 1340,
        "type": "jpg",
        "path": "build.jpg"
      }, {
        "width": 1260,
        "height": 310,
        "type": "png",
        "path": "css-focus.png"
      }, {
        "width": 1260,
        "height": 310,
        "type": "png",
        "path": "html-focus.png"
      }, {
        "width": 1260,
        "height": 310,
        "type": "png",
        "path": "javascript-focus.png"
      }, {
        "width": 1260,
        "height": 310,
        "type": "png",
        "path": "tech.png"
      }],
      "definitions": {
        "internet": {
          "id": "internet",
          "name": "Internet",
          "define": "A world wide network of computers\n"
        },
        "website": {
          "id": "website",
          "name": "Website",
          "define": "A point on the Internet that serves web pages"
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
        "web_page": {
          "id": "web_page",
          "name": "Web Page",
          "define": "An individual view of a web site.\n"
        },
        "css": {
          "id": "css",
          "name": "CSS",
          "aka": "Cascading Style Sheets",
          "define": "Special rules for styling\n"
        },
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
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
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
        },
        "double_click": {
          "id": "double_click",
          "name": "Double Click",
          "define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."
        }
      }
    };

    // other utilities
    utils.plural = $plural;
    utils.oxford = $oxford;

    // share utility function
    var _ = window._ = utils._;
    utils._.assign(_, utils);

    // timing
    this._delays = {};
    this._intervals = {};

    // expose API tools
    this.assistant = api.assistant;
    this.screen = api.screen;
    this.progress = api.progress;
    this.validate = api.validate;
    this.content = api.content;
    this.editor = api.editor;
    this.sound = api.sound;

    // setup controllers
    this.controllers = {};

    // setup each included entry
    var refs = {
      browserType: browserType, highlightFileBrowser: highlightFileBrowser, waitForIndexHtml: waitForIndexHtml
    };

    // setup each reference
    _.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;else _.assign(_this, ref);
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(web1Lesson, [{
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
      _.each(this._delays, function (cancel) {
        return cancel();
      });
      _.each(this._intervals, function (cancel) {
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

  return web1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_1', web1Lesson);

},{"./browserType":1,"./highlightFileBrowser":2,"./waitForIndexHtml":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onOpenFile = onOpenFile;
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onOpenFile(file) {

	if (file.path === '/index.html') {
		this.progress.next();
		return true;
	}
}

function onEnter() {
	var _this = this;

	this.screen.highlight.fileBrowserItem('/index.html');

	this.delay(8000, function () {
		_this.assistant.say('To open the `index.html` file, double click the item in the File Browser.\n\nTo double click, move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.');
	});
}

function onExit() {
	this.screen.highlight.clear();
}

},{}]},{},[3]);
