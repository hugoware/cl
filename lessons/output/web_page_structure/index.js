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
        "content": "So far we've used [define html] to create headings and paragraphs by adding [define html_element s] to our page.\n\nEven though we could see what we typed in the [define codelab_html_preview], the [define html] was not written properly.\n"
      }, {
        "content": "For the most part, [define web_browser s] are very forgiving when showing [define html]. Most [define web_browser s] will attempt to display the [define html] even if there are errors in the code.\n\nHowever, as smart as [define web_browser s] might be, it's always a good idea to write your code in a way that it makes it easier for the browser to understand the intent of your [define web_page l].\n"
      }, {
        "content": "In this lesson, we will be creating a default web page structure so we can understand the purpose of each [define html_element].\n\nIf you don't remember everything, don't worry. Most modern code editors will fill in the default HTML page structure when creating a new file.\n"
      }, {
        "mode": "popup",
        "content": "Okay, let's get started!\n"
      }, {
        "content": "Open the file named `index.html` in the [define file_browser]\n"
      }, {
        "content": "Since we're going to be creating an entire page structure from scratch, this file is completely blank.\n"
      }, {
        "content": "The Element that should appear in an HTML document is the `doctype`. The `doctype` is used to identify the version of HTML being used.\n\nFor modern web development, this is fairly simple as there's only one type you need to use.\n"
      }, {
        "content": "Follow along with the instructions to add the correct `doctype` to the page.\n"
      }, {
        "content": "The next [define html_element] that we need to use is the `html` Element. This is used to wrap the entire [define html] document. Basically, anything that falls between the opening and closing tags it's considered to be part of the document.\n"
      }, {
        "content": "Follow along with instructions to add the opening and closing `html` tags.\n"
      }, {
        "content": "The next [define html_element] we are going to add is the `head` Element.\n"
      }, {
        "content": "The `head` Element has quite a few varied purposes.\n\nFor one, it is used to hold information about the page that is not visually displayed. This include data like descriptions, author names, copyright dates, supported languages and more. \n\nThis information is read by search engines to identify what is on your page.\n"
      }, {
        "content": "The `head` Element is also where you define the page title. The page title is the text that appears on the tab in the browser.\n"
      }, {
        "content": "Finally, the `head` is used to include external resources, for example CSS styles. We haven't talked about this yet but will cover it and a few lessons from now.\n"
      }, {
        "content": "Follow along with the instructions to add the `head` Element and some information about this page.\n"
      }, {
        "content": "Finally, the `body` Element is used to wrap all visual content for a page. This includes text, images, videos, forms, and more.\n\nEssentially, if it should be visible to the visitor of the page, it probably should be in the `body` Element.\n"
      }, {
        "content": "Follow along with the instructions to add the `body` Element to your page.\n"
      }, {
        "content": "Great work! Although the page does not look different than previous examples we done, it is structured correctly now.\n\nFollowing best practices and writing good code is a great way become a better software developer.\n"
      }, {
        "mode": "overlay",
        "title": "What is the purpose of the `doctype` Element?",
        "explain": "The `doctype` is used to identify which version of [define html] your page is using. However, in modern web development this is typically going to be set to simply `\"html\"`.\n",
        "choices": ["Identifies the version of HTML the page is using", "Enables spellcheck for the page content", "Disables images and video files", "Changes the background color of the web page"]
      }, {
        "title": "What is NOT a purpose of the `head` Element?",
        "explain": "The head element has many purposes, such as holding a meta-information, the page title, and references for external resources.\n",
        "choices": ["Showing a photo of the current web page visitor", "Container for meta-information like description and author", "Holds the `title` Element for the page", "Container for references to external resources"]
      }, {
        "title": "What should go inside of the `body` Element?",
        "explain": "Generally speaking, the `body` Element contains the content that should be seen by the webpage visitor such as text, images, videos, and more.\n",
        "choices": ["Content that should be seen by the visitor", "The `title` Element for the page", "The `doctype` Element for the page", "Meta-information like a page description or author name"]
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {},
      "resources": [],
      "definitions": {
        "web_page": {
          "id": "web_page",
          "name": "Web Page",
          "define": "An individual view of a web site.\n"
        },
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
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
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
    var refs = {};

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
    });

    // debugging
    if (/localhost/gi.test(window.location.origin)) window.LESSON = this;
  }

  // returns the active controller


  _createClass(webPageStructureLesson, [{
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
    key: "clearTimers",
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
    key: "clear",
    value: function clear() {
      this.clearTimers();
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

  return webPageStructureLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_page_structure', webPageStructureLesson);

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
