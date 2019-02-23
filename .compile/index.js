'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

// import controllers


var _lib = require('./lib');

var _addListItems = require('./addListItems');

var addListItems = _interopRequireWildcard(_addListItems);

var _browserType = require('./browserType');

var browserType = _interopRequireWildcard(_browserType);

var _changeHeadingContent = require('./changeHeadingContent');

var changeHeadingContent = _interopRequireWildcard(_changeHeadingContent);

var _codeEditorIntro = require('./codeEditorIntro');

var codeEditorIntro = _interopRequireWildcard(_codeEditorIntro);

var _freeButtonInsert = require('./freeButtonInsert');

var freeButtonInsert = _interopRequireWildcard(_freeButtonInsert);

var _freeHeadingInsert = require('./freeHeadingInsert');

var freeHeadingInsert = _interopRequireWildcard(_freeHeadingInsert);

var _highlightFileBrowser = require('./highlightFileBrowser');

var highlightFileBrowser = _interopRequireWildcard(_highlightFileBrowser);

var _previewAreaIntro = require('./previewAreaIntro');

var previewAreaIntro = _interopRequireWildcard(_previewAreaIntro);

var _validation = require('./validation');

var validation = _interopRequireWildcard(_validation);

var _waitForIndexHtml = require('./waitForIndexHtml');

var waitForIndexHtml = _interopRequireWildcard(_waitForIndexHtml);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// lesson controller
var web1Lesson = function () {

  // setup the lesson
  function web1Lesson(project, lesson, api) {
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
        "content": "Generally speaking, web pages viewed in the browser are created using just three different core technologies. These are [define html], [define css], and [define javascript].\n\n[image tech.png]\n\nIn fact, it's entirely possible that every single website you've ever visited has used all three of these technologies at the same time!\n"
      }, {
        "content": "[define html] is the foundation for all [define web_page web pages]. [define html] is a language that determines the words and content that are displayed in the web browser.\n\n[image html-focus.png]\n\nIn a sense, [define html] is what your web page _says_.\n"
      }, {
        "content": "[define css] is a language that's used to determine the visual appearance of a web page. The colors, font sizes, layout, and other design properties of your web page are defined by the rules in [define css]\n\n[image css-focus.png]\n\nSimply put, [define css] decides what your web page _looks like_.\n"
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
        "content": "At the end of an [define html_element] is the closing [define html_tag tag]. It's written much like the opening tag, but there's also a `/` character after the first `<`.\n\nThe closing [define html_tag] is very important because it marks where a [define html_element] ends. Otherwise, the Element would continue to the end of the page.\n\n[snippet html_tag_example highlight:17,5]\n"
      }, {
        "content": "Everything between the opening and closing tags for an [define html_element] is the content. This Element is a _heading_. If you were to look at this in a browser it would show up as the phrase \"Hello, World!\" in a large and bold font\n\n[snippet html_tag_example highlight:4,13]\n"
      }, {
        "mode": "popup",
        "content": "We've talked a lot about what [define html] is and how it works, so let's actually try writing code and see what happens.\n"
      }, {
        "controller": "highlightFileBrowser",
        "content": "On the left side of the screen is the [define file_browser]. This is a list of all files in your project.\n"
      }, {
        "controller": "waitForIndexHtml",
        "content": "Open the file named `index.html` by [define double_click double clicking] on it in the [define file_browser].\n"
      }, {
        "controller": "codeEditorIntro",
        "content": "Great! The code file you just opened is now in the [define codelab_editor] area. This is where you can make changes to code. At the top, you'll see there's a new tab added for the file you just opened.\n"
      }, {
        "content": "Like with the previous example, this is a heading [define html_element Element]. You can see that it uses opening and closing [define html_tag tags] to surround the content.\n"
      }, {
        "controller": "previewAreaIntro",
        "content": "On the right side of the screen, we can see the result of the [define html] in the [define codelab_html_preview].\n"
      }, {
        "controller": "changeHeadingContent",
        "content": "Let's start by changing the content of the [define html_element Element]. Replace the words \"Hello, World!\" with something different.\n"
      }, {
        "content": "Now, let's try to type in an entirely new [define html_element]. This time we're going to create both the opening and closing [define html_tag tags] as well as the content inside.\n"
      }, {
        "controller": "freeHeadingInsert",
        "content": "Create the following [define html_element]\n\n[snippet free_heading_insert]\n"
      }, {
        "content": "Practice makes perfect! Let's try that again with another [define html_element].\n"
      }, {
        "controller": "freeButtonInsert",
        "content": "Create the following [define html_element]\n\n[snippet free_button_insert]\n"
      }, {
        "mode": "overlay",
        "content": "So far you've written a few simple [define html_element HTML Elements] that had some words inside.\n\nEach [define html_element] you created had a different effect on the contents.\n"
      }, {
        "content": "For example, the `h1` [define html_element Element] made the font large and bold.\n\nThe `button` [define html_element Element] created a clickable button.\n\nBasically, the type of [define html_element] used will have a different effect on the contents.\n"
      }, {
        "content": "This is where [define html] starts getting exciting!\nText isn't the only thing that you can put inside of an [define html_element]!"
      }, {
        "content": "Many [define html_element HTML Elements] allow for you to put even more Elements inside of them.\n\n[snippet list_example]\n\nIn fact, most websites you visit on the [define internet] are made up of hundreds, or even thousands, of individual [define html_element HTML Elements]!\n"
      }, {
        "content": "Let's review the [define html] code sample below.\n\n[snippet list_example highlight:0,4|48,5]\n\nLike with the previous examples, there are still opening and closing [define html_tag tags].\n"
      }, {
        "content": "Between the opening and closing [define html_tag tags] are more [define html_element HTML Elements].\n\n[snippet list_example highlight:6,12|20,12|34,13]\n\nOften times you'll hear these called [define html_child_elements] or \"nested\" Elements.\n"
      }, {
        "content": "These two [define html_element Element] types work together to create a list of numbers in the [define web_browser].\n\n[snippet list_example preview:45%]\n\nThe `ol` Element tells the [define web_browser] that each of the child `li` Elements should be displayed as a new **list item**.\n"
      }, {
        "mode": "popup",
        "content": "This might seem a little confusing at first, but it'll make much more sense once you try it out for yourself.\n"
      }, {
        "controller": "addListItems",
        "content": "Create the list in the example below.\n\n[snippet list_example]\n"
      }, {
        "mode": "overlay",
        "content": "Great work! There's still a lot to learn, but let's end this lesson by reviewing what we've covered so far.\n"
      }, {
        "show": 4,
        "title": "What is the name of the `highlighted` code?",
        "content": "[snippet html_tag_example highlight:0,4]\n",
        "hint": "The individual parts of an [define html_element] are called tags.\n",
        "explain": "Each time you create a new [define html_element] you must start with an opening tag.\n",
        "choices": ["The opening tag", "The leading byte", "The execute command", "The block maker"]
      }, {
        "show": 4,
        "title": "What is the name of the `highlighted` code?",
        "content": "[snippet html_tag_example highlight:17,5]\n",
        "hint": "The individual parts of an [define html_element] are called tags.\n",
        "explain": "Each time you create a new [define html_element] you must use a closing tag to end it. You'll learn about more types in later lessons!\n",
        "choices": ["The closing tag", "The ending byte", "The terminator command", "The block breaker"]
      }, {
        "show": 4,
        "title": "What is the name of the `highlighted` code?",
        "content": "[snippet html_tag_example highlight:4,13]\n",
        "explain": "The content is whatever has been added between the opening and closing [define html_tag tags] of an [define html_element]. It could be text, or even other [define html_element Elements].\n",
        "choices": ["The content", "The encoded matrix", "The bytecode input", "The binary block"]
      }, {
        "show": 4,
        "title": "What is the name of a complete [define html] instruction?",
        "content": "This includes the opening and closing tags as well as the content inside.\n\n[snippet html_tag_example highlight:0,22]\n",
        "explain": "Basic commands in [define html] are called [define html_element HTML Elements]. Websites use hundreds, or even thousands of them, to create the content in the [define web_browser]\n",
        "choices": ["An HTML Element", "An encoded terminator", "A binary block", "A bytecode command"]
      }, {
        "mode": "popup",
        "content": "Way to go! You've finished this lesson!\n"
      }, {
        "content": "At this point all files are now unlocked and you're free to make changes to anything in this project. You can play with the [define html] you've learned, or just try out new things.\n"
      }, {
        "content": "If you create something that you'd like others to see, you can use the **Share** button and send them a link so they can try it out for themselves.\n"
      }, {
        "emote": "happy",
        "content": "Great work, and I'll see you again for **Lesson 2**\n"
      }],
      "snippets": {
        "complex_tag": {
          "content": "<div>\n  <h1>The Title</h1>\n  <p>The main content!</p>\n</div>",
          "type": "html"
        },
        "free_button_insert": {
          "content": "<button>Click me</button>",
          "type": "html"
        },
        "free_heading_insert": {
          "content": "<h3>HTML is great</h3>",
          "type": "html"
        },
        "html_tag_example": {
          "content": "<h1>Hello, World!</h1>",
          "type": "html"
        },
        "list_example": {
          "content": "<ol>\n\t<li>dog</li>\n\t<li>cat</li>\n\t<li>fish</li>\n</ol>",
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
        "web_browser": {
          "id": "web_browser",
          "name": "Web Browser",
          "define": "An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"
        },
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
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
        },
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
        },
        "codelab_editor": {
          "id": "codelab_editor",
          "name": "Code Editor",
          "define": "The CodeLab editing area\n"
        },
        "codelab_html_preview": {
          "id": "codelab_html_preview",
          "name": "Preview Area",
          "define": "You can see your HTML as you type\n"
        },
        "html_child_elements": {
          "id": "html_child_elements",
          "name": "Child Elements",
          "define": "HTML Elements that are contained inside of other HTML Elements. Also commonly referred to as **nested Elements**.\n"
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

    // setup controllers
    this.controllers = {};

    // setup each included entry
    var refs = {
      addListItems: addListItems, browserType: browserType, changeHeadingContent: changeHeadingContent, codeEditorIntro: codeEditorIntro, freeButtonInsert: freeButtonInsert, freeHeadingInsert: freeHeadingInsert, highlightFileBrowser: highlightFileBrowser, previewAreaIntro: previewAreaIntro, validation: validation, waitForIndexHtml: waitForIndexHtml
    };

    // setup each reference
    _lib._.each(refs, function (ref, key) {
      if (ref.controller) _this.controllers[key] = ref;
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

  return web1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_1', web1Lesson);