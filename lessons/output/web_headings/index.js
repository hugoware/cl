(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _lib = require("./lib");

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// import controllers


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
        "content": "In this lesson we're going to start working with the different types of blocks use for formatting text an HTML.\n\nThere are many tag types and HTML, but in this lesson we will be focusing on the heading tags and the paragraph tag.\n"
      }, {
        "content": "Each of these tags have a different purpose in HTML.\n\nThe heading tags are used to start new sections of content on your page. By default, they're displayed in a large and bold font.\n\n[snippet heading_example]\n"
      }, {
        "content": "Paragraphs, on the other hand, are used to display sections of text. Most of the time, paragraphs have additional margin space around them.\n\nGenerally speaking, you'll have many more paragraphs then you will have headings on a page.\n"
      }, {
        "content": "We'll learn more about it in later lessons, but headings actually have a specific purpose. Headings are used by screen readers help blind people read your webpage, as well as help search engines understand the structure of your page.\n\nHeadings should not be used to simply change the size or boldness of a font. In later lessons, we will be learning the correct way to change the style of a webpage.\n"
      }, {
        "mode": "popup",
        "content": "Let's get started adding some headings to our page.\n\nOpen the file named `index.html` in the File Browser on the left side of the screen.\n"
      }, {
        "content": "At this point you're already familiar with writing [define html_element s]. Let's start by adding a `h1` [define html_element element] to this page.\n"
      }, {
        "content": "Okay, let's do that again for the remaining heading [define html_element elements].\n\nThere are six in total heading elements in [define html]. Try and added the remaining five heading elements.\n"
      }, {
        "title": "Using Paragraphs",
        "mode": "overlay",
        "content": "Paragraphs are another way to add text to your webpage, but these aren't intended to mark new sections on the page.\n\nInstead, paragraphs are typically used for large passages of text.\n"
      }, {
        "mode": "popup",
        "content": "Add a new paragraph to this page by using the `p` tag.\n\n[snippet paragraph_example]\n"
      }, {
        "content": "In each of the examples we've done so far all of the text has been on one line. However, HTML allows you to put text on multiple lines.\n"
      }, {
        "content": "You'll notice that even though the text is on multiple lines, the [define codelab_html_preview] displays all of the text on a single line.\n\nIn HTML, new lines are displayed as a single space between characters.\n"
      }, {
        "content": "This creates a problem were trying to add a new line to our webpage. However, like with most things in HTML, we can use an [define html_element] to solve this problem.\n"
      }, {
        "title": "Using Line Breaks",
        "mode": "overlay",
        "content": "The `br` tag is used to create line breaks, meaning that a new line is displayed wherever the [define html_element] is placed in the code.\n\n[snippet linebreak]\n"
      }, {
        "content": "You probably noticed that this [define html_element] looks different than the other tags you've written so far.\n\n[snippet linebreak highlight:4,2]\n\nUnlike the other HTML elements you've added, this [define html_element element] does not have a separate closing tag.\n"
      }, {
        "content": "This is called a [define void_element], meaning that it does not have any content.\n\nYou'll also hear these referred to as _self-closing_ tag or _empty tags_.\n"
      }, {
        "mode": "popup",
        "content": "There are many other [define html_element s] that are also [define void_element s]. You'll learn more about these and later lessons.\n"
      }, {
        "content": "Let's go back and add a `br` [define html_element element] between the two lines in the previous example.\n\n[snippet insert_linebreak]\n"
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
          "content": "<p>\n\tParagraphs can be\n\t<br />\n\ton multiple lines\n</p>",
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
        }
      },
      "resources": [],
      "definitions": {
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements\n"
        },
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full definition value"
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
    var refs = {};

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webHeadingsLesson, [{
    key: "invoke",

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
    key: "respondsTo",
    value: function respondsTo(action) {
      action = toActionName(action);
      var controller = this.controller;

      return !!controller && controller[action];
    }

    // resets any required information between slides

  }, {
    key: "clear",
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
    key: "delay",
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
    key: "interval",
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
    key: "controller",
    get: function get() {
      var slide = this.lesson.slide;

      return slide && this.controllers[slide.controller];
    }

    // returns the current slide

  }, {
    key: "slide",
    get: function get() {
      return this.lesson.slide;
    }
  }]);

  return webHeadingsLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_headings', webHeadingsLesson);

},{"./lib":2}],2:[function(require,module,exports){
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

},{}]},{},[1]);
