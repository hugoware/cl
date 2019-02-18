'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import controllers


var _browserType = require('./browserType');

var browserType = _interopRequireWildcard(_browserType);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "In this tutorial we're going to start learning the basics of creating web pages.\n\nHowever, before we start learning how to write code, it's best to take a little bit of time and learn how web pages work _behind the scenes_.\n"
      }, {
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "controller": "browserType"
      }, {
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "Generally speaking, web pages viewed in the browser are created using just three different core technologies.\n\n[image tech.png]\n\nIn fact, it's entirely possible that every single website you've ever visited has used all three of these technologies at the same time!\n"
      }, {
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "[define html] is the foundation for all [define web_page web pages]. [define html] is a language that determines the words and content that are displayed in the web browser.\n\n[image html-focus.png]\n\nIn a sense, [define html] is what your web page _says_.\n"
      }, {
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "[define css] is a language that's used to determine the visual appearance of a web page. Colors, font sizes, layout, and more are defined by the rules written in [define css]\n\n[image css-focus.png]\n\nSimply put, [define css] decides what your web page _looks like_.\n"
      }, {
        "mode": "overlay",
        "title": "Introduction to Creating Web Pages",
        "content": "Finally, [define javascript] is a programming language that can be used to create logic and behaviors on a web page. Many modern websites use [define javascript] to create complicated applications that run entirely in the [define web_browser browser]\n\n[image javascript-focus.png]\n\nGenerally speaking, [define javascript] decides what your web page _will do_.\n"
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
        }
      }
    };

    // other utilities
    utils.plural = $plural;
    utils.oxford = $oxford;

    // share utility function
    var _ = window._ = utils._;
    utils._.assign(_, utils);

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
      browserType: browserType
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
  }, {
    key: 'timeout',
    value: function timeout(action, time) {}
  }, {
    key: 'interval',
    value: function interval(action, time) {}
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