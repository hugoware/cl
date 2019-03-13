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
        "content": "In this lesson we're going look at how to use [define html_attribute s].\n\n[define html_attribute s] are a way to provide additional information about the behavior of an [define html_element].\n"
      }, {
        "content": "To help explain the concept of an [define html_attribute], let's walk through a simple scenario. \n\nLet's say we wanted to add an image to our webpage. The correct HTML element to use in this case is the `img` element.\n\n[snippet img_no_attr]\n"
      }, {
        "content": "But what's interesting about the `img` [define html_element Element] is that it's a [define void_element], meaning it can't have any content.\n\nNot only that, all of the [define html_element s] we have written so far only support text. In this case we want to display an image file.\n\n[snippet img_no_attr]\n"
      }, {
        "content": "This is where we can use an [define html_attribute] to provide additional information so our `img` Element knows what to do.\n\n[snippet img_with_attr]\n\nLet's walk through each of the parts that make up an [define html_attribute].\n"
      }, {
        "content": "To start, and a [define html_attribute] needs a name. This name will change depending on the purpose, much like the name of an HTML element changes the behavior in the browser.\n\n[snippet img_with_attr highlight:5,3]\n\nIn this case, the `img` Element uses the `src` attribute as the location for where the image is found.\n"
      }, {
        "content": "The next character that is shown is an `||=|equal sign||`.\n\n[snippet img_with_attr highlight:8,1]\n\nA good way to remember this is that the name is equal to the value, which comes at the end of the [define html_attribute].\n"
      }, {
        "content": "The value of the [define html_attribute] is placed between two _double quotes_, one at the beginning of the value and the other at the end. \n\n[snippet img_with_attr highlight:9,1|18,1]\n\nYou're also allowed to use _single quotes_, however most developers only use _double quotes_ when writing [define html].\n"
      }, {
        "content": "Everything between the two _double quotes_ is the value. In this case, the **value** is telling the Image element where it can find the image file.\n\n[snippet img_with_attr highlight:10,8]\n\n_We haven't discussed how paths work in [define html] just yet, but we'll be discussing them in the next lesson._\n"
      }, {
        "mode": "popup",
        "content": "Lets give this a try so you can See it in action.\n"
      }, {
        "content": "Open the `index.html` file in the [define file_browser]\n"
      }, {
        "content": "Follow along with the instructions to add an image to this page. Use the `src` [define html_attribute attribute] to tell the `img` [define html_element element] where to find the image file to display.\n"
      }, {
        "content": "Let's try that again, but this time add the other two images in the project to the page. This should include `/cat.png` and `/fish.png`\n"
      }, {
        "content": "Great! You can see that an [define html_attribute] allows us to provide additional instructions for [define html_element elements] to change its behavior.\n"
      }, {
        "mode": "overlay",
        "content": "Let's look at another [define html_attribute] that's frequently used when creating web pages.\n"
      }, {
        "content": "This is the `a` [define html_element Element], which is used for creating [define hyperlink s]. You've seen [define hyperlink s] on most websites since you click on them to navigate between pages.\n\n[snippet anchor_example]\n"
      }, {
        "content": "You can see that this [define html_attribute] is written exactly the same as the previous example.\n\n[snippet anchor_example highlight:3,24]\n\nThere is a name, an `=`, a pair of double quotes, and a value. In this case, the value is the address of the webpage to navigate to.\n"
      }, {
        "content": "However, unlike the `img` [define html_element Element], we are able to set the content of this [define html_element Element] using text.\n\n[snippet anchor_example highlight:31,16]\n\nWhen you're writing a [define hyperlink] for a webpage, this text is typically used to describe where the link will navigate the visitor to.\n"
      }, {
        "slide": "popup",
        "content": "Let's give it a try! Follow along with instructions to add a link to the other page in this project.\n\n[snippet other_page]\n"
      }, {
        "content": "Looks like that worked! Click on the [define hyperlink] on this page to return back to the `index.html` page.\n"
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
        "other_page": {
          "content": "<a href=\"/example.html\" >\n\tShow example page\n</a>",
          "type": "html"
        }
      },
      "resources": [],
      "definitions": {
        "html_attribute": {
          "id": "html_attribute",
          "name": "HTML Attribute",
          "define": "Something different for html stuff\n\n`<img src=\"something\" />`\n"
        },
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements\n"
        },
        "void_element": {
          "id": "void_element",
          "name": "Void Element",
          "define": "An HTML Element that does not have a separate closing tag. Also does not contain content.    \n"
        },
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full definition value"
        },
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
        },
        "hyperlink": {
          "id": "hyperlink",
          "name": "Hyperlink",
          "aka": "Link",
          "define": "An HTML Element that's used to link from one page to another resource using a URL.\n"
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


  _createClass(webAttributesLesson, [{
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

  return webAttributesLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = "on" + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_attributes', webAttributesLesson);

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
