(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onSaveFile = onSaveFile;
exports.onReady = onReady;
var controller = exports.controller = true;

function onSaveFile() {
	this.progress.next();
	return true;
}

function onReady() {
	this.screen.marker.saveButton({ offsetX: -2, offsetY: 2, tr: true });
}

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.validate = validate;
exports.onEnter = onEnter;
exports.onReady = onReady;
exports.onExit = onExit;
exports.onContentChange = onContentChange;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

function validate(instance) {
	var content = instance.file.content({ path: '/index.html' });
	var result = _lib.HtmlValidator.validate(content, _validation.validate_list);

	// check for the first item
	if (!instance.state.addedItem && result.progress === 'added-item') {
		instance.state.addedItem = true;
		instance.assistant.say({
			message: 'Very good! Notice how the [define html_element Element] you added already has a number indicating which position it is on the list.',
			emote: 'happy'
		});
	}

	// update validation
	instance.editor.hint.validate({ path: '/index.html', result: result });

	// update progress
	instance.progress.update({
		result: result,
		allow: function allow() {
			return instance.assistant.say({
				message: 'Wonderful! You\'ll notice that the [define web_browser] automatically placed a number next to each of the list items you created!'
			});
		},
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onEnter() {
	this.progress.block();
	this.file.allowEdit({ path: '/index.html' });
}

function onReady() {
	this.editor.cursor({ end: true });
	validate(this);
}

function onExit() {
	this.file.readOnly({ path: '/index.html' });
}

function onContentChange(file) {
	validate(this);
}

},{"./lib":13,"./validation":16}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onEnter = onEnter;

var _lib = require('./lib');

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

	this.assistant.say({
		emote: 'happy',
		message: '\n\t\t\tWhen you browse the [define internet], you visit [define website websites] that show you information. That information is displayed on your screen using a [define web_browser web browser].\n\n\t\t\tThere\'s many web browsers that are used such as Chrome, Firefox, Safari, and more.\n\n\t\t\t' + tell
	});
}

},{"./lib":13}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onActivateLesson = onActivateLesson;
exports.onEnter = onEnter;
exports.onExit = onExit;
exports.onContentChange = onContentChange;
exports.onBeforeContentChange = onBeforeContentChange;

var _lib = require('./lib');

var _utils = require('./utils');

var controller = exports.controller = true;

var $valid = void 0;

function onActivateLesson() {
	$valid = false;
}

function onEnter() {
	this.progress.block();
	this.file.readOnly({ path: '/index.html', readOnly: false });
	this.editor.area({ path: '/index.html', start: 6, end: 19 });
}

function onExit() {
	this.file.readOnly({ file: '/index.html' });
	this.editor.area.clear({ path: '/index.html' });
}

function onContentChange(file, change) {
	var content = this.editor.area.get({ path: '/index.html' });

	var simplified = (0, _utils.simplify)(content);
	var diff = (0, _utils.similarity)('helloworld', simplified);
	var isChanged = simplified.length > 5 && diff < 0.4;

	// it's literally what was said
	if (simplified === 'somethingdifferent') {
		$valid = true;
		this.assistant.say({
			emote: 'happy',
			message: '\n\t\t\t\tOh! I did say to type _"something different"_, didn\'t I?\n\t\t\t\tYou\'re very clever!'
		});
	}

	// check if the message is new
	else if (!$valid && isChanged) {
			$valid = true;
			this.progress.allow();
			this.assistant.say({
				message: 'Looks great! You can see what you typed into the Preview Area'
			});
		}
		// invalidated
		else if ($valid && !isChanged) {
				$valid = false;
				this.assistant.revert();
			}
}

function onBeforeContentChange(file, change) {
	return !change.hasNewline;
}

},{"./lib":13,"./utils":15}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onTryEditReadOnly = onTryEditReadOnly;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight.codeEditor();
}

function onTryEditReadOnly() {
	this.assistant.say({
		emote: 'happy',
		message: 'Oops! I\'m glad you\'re so excited to start making changes, but you can\'t edit the file just yet!'
	});
}

function onExit() {
	this.screen.highlight.clear();
}

},{}],6:[function(require,module,exports){
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
			var name = config.fileName || config.file.split('/').pop();

			// check for content
			if (!config.content) {
				this.assistant.say({
					message: 'Open the file named `' + name + '` by [define double_click double clicking] on it in the [define file_browser File Browser].'
				});
			}

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

},{"../lib":13}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = configure;

var _lib = require('../lib');

function configure(obj, config) {

	_lib._.assign(obj, {

		controller: true,

		onEnter: function onEnter() {
			var _this = this;

			this.progress.block();

			var waiting = this.events.listen('expand-objectives-list', function () {
				_this.progress.next();
				_this.events.clear();
			});
		},
		onExit: function onExit() {
			this.events.clear();
		}
	});
}

},{"../lib":13}],8:[function(require,module,exports){
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

},{"../lib":13}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onEnter = onEnter;
exports.onReady = onReady;
exports.onExit = onExit;
exports.onContentChange = onContentChange;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;;

function validate(instance) {
	var content = instance.file.content({ path: '/index.html' });
	var result = _lib.HtmlValidator.validate(content, _validation.validate_insert_button);

	// update validation
	instance.editor.hint.validate({ path: '/index.html', result: result });

	// update progress
	instance.progress.update({
		result: result,
		allow: function allow() {
			return instance.assistant.say({
				message: 'Great! Let\'s move to the next step!'
			});
		},
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onEnter() {
	var _this = this;

	this.editor.focus();
	this.progress.block();
	this.file.allowEdit({ path: '/index.html' });

	// for curious students
	this.preview.addEvent('click', 'button', function () {
		_this.assistant.say({
			emote: 'happy',
			message: '\n\t\t\t\tThat button doesn\'t do anything just yet, but we\'ll learn how to make it do stuff in later lessons.\n\t\t\t\tI\'m glad you we\'re curious and tried clicking on it!'
		});
	});
}

function onReady() {
	validate(this);
}

function onExit() {
	this.file.readOnly({ path: '/index.html' });
	this.editor.area.clear();
	this.preview.clearEvents();
}

function onContentChange(file) {
	validate(this);
}

},{"./lib":13,"./validation":16}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;
exports.onEnter = onEnter;
exports.onReady = onReady;
exports.onExit = onExit;
exports.onContentChange = onContentChange;

var _lib = require('./lib');

var _validation = require('./validation');

var controller = exports.controller = true;

function validate(instance) {
	var content = instance.file.content({ path: '/index.html' });
	var result = _lib.HtmlValidator.validate(content, _validation.validate_insert_h3);

	// update validation
	instance.editor.hint.validate({ path: '/index.html', result: result });

	// update progress
	instance.progress.update({
		result: result,
		allow: function allow() {
			return instance.assistant.say({
				emote: 'happy',
				message: 'Great! Let\'s move to the next step!'
			});
		},
		deny: instance.assistant.revert,
		always: instance.sound.notify
	});
}

function onEnter() {
	this.progress.block();
	this.file.allowEdit({ path: '/index.html' });
}

function onReady() {
	this.editor.cursor({ end: true });
	validate(this);
}

function onExit() {
	this.preview.clearEvents();
	this.file.readOnly({ path: '/index.html' });
	this.editor.area.clear();
}

function onContentChange(file) {
	validate(this, file);
}

},{"./lib":13,"./validation":16}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

var _waitForObjectivesList = require('./controllers/waitForObjectivesList');

var _waitForObjectivesList2 = _interopRequireDefault(_waitForObjectivesList);

var _aboutSaving = require('./aboutSaving');

var aboutSaving = _interopRequireWildcard(_aboutSaving);

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
        "content": "Generally speaking, web pages viewed in the browser are created using three different core technologies. These are [define html], [define css], and [define javascript].\n\n[image tech.png]\n\nIn fact, it's entirely possible that every single website you've ever visited has used all three of these technologies at the same time!\n"
      }, {
        "content": "[define html] is the foundation for all [define web_page web pages]. [define html] is a language that determines the words and content that are displayed in the web browser.\n\n[image html-focus.png]\n\nIn a sense, [define html] is what your web page _says_.\n"
      }, {
        "content": "[define css] is a language that's used to determine the visual appearance of a web page. The colors, font sizes, layout, and other design properties of your web page are defined by the rules in [define css]\n\n[image css-focus.png]\n\nSimply put, [define css] decides what your web page _looks like_.\n"
      }, {
        "content": "Finally, [define javascript] is a programming language that can be used to create logic and behaviors on a web page. Many modern websites use [define javascript] to create complicated applications that run entirely in the [define web_browser browser]\n\n[image javascript-focus.png]\n\nGenerally speaking, [define javascript] decides what your web page _will do_.\n"
      }, {
        "content": "Each time you visit a [define website website], code files like [define html], [define css], and [define javascript] are sent to your computer. The [define web_browser] uses the instructions in each of these files to create the [define web_page web page] you see on the screen.\n\n[image build.jpg frame]\n"
      }, {
        "content": "There's a lot to learn when it comes to creating web pages, but with practice and time, you'll be building entire websites before you know it.\n\n[image html-focus.png]\n\nAt the start of this tutorial series, we're going to focus on learning [define html] and then introduce [define css] and [define javascript] at a later time.\n"
      }, {
        "emotion": "happy",
        "content": "Great, let's get started learning some [define html]!"
      }, {
        "title": "What is HTML?",
        "content": "[define html] is a language that's used to describe the information found on a web page. It's written using instructions called [define html_element Elements]. An [define html_element] is made up of several parts called [define html_tag tags].\n\nBelow is an example of a simple [define html_element].\n\n[snippet html_tag_example]\n\nLet's go over what each part of this code example ||does|duz||. \n"
      }, {
        "content": "The first part of an [define html_element] is the **Opening** [define html_tag tag]. It's written using a `<` sign, followed by the name of the tag, and then a `>` sign.\n\n[snippet html_tag_example highlight:0,4]\n\nThis tells the [define web_browser] what rules to follow for everything that comes after the opening tag.\n"
      }, {
        "content": "The `<` and `>` signs are special characters that are used in [define html] to mark where [define html_tag tags] begin and end.\n\n[snippet html_tag_example highlight:0,1|3,1]\n\nYou'll sometimes hear these characters referred to as _\"angle brackets\"_ by other developers.\n"
      }, {
        "content": "The word between the opening and closing tags is the name of the [define html_element Element]. Each [define html_element] has a different purpose in the web browser.\n\n[snippet html_tag_example highlight:1,2]\n\nFor example, this `h1` Element is how you display a large heading.\n"
      }, {
        "content": "At the end of an [define html_element] is the closing [define html_tag tag]. It's written much like the opening tag, but there's also a `/` character after the first `<` sign.\n\n[snippet html_tag_example highlight:17,5]\n\nThe closing [define html_tag] is very important because it marks where an [define html_element] stops.\n"
      }, {
        "content": "Everything between the opening and closing [define html_tag tags] is the content. This [define html_element Element] is a _heading_. If you were to look at this in a browser it would show up as the phrase \"Hello, World!\" in a large and bold font.\n\n[snippet html_tag_example highlight:4,13 preview:45%]\n"
      }, {
        "mode": "popup",
        "content": "We've talked a lot about how [define html] works, so let's jump into writing some code and see what happens.\n"
      }, {
        "controller": "highlightFileBrowser",
        "content": "On the left side of the screen is the [define file_browser]. This is a list of all files in your project.\n"
      }, {
        "controller": "waitForIndexHtml",
        "content": "Open the file named `index.html` by [define double_click double clicking] on it in the [define file_browser].\n"
      }, {
        "controller": "codeEditorIntro",
        "content": "The code file you just opened is now in the [define codelab_editor] area. This is where you can make changes to code.\n\nAt the top, you'll see there's a new tab added for the file you just opened.\n"
      }, {
        "controller": "previewAreaIntro",
        "content": "On the right side of the screen you can see the [define codelab_html_preview]. This shows what the [define html] for this file looks like when viewed in a [define web_browser browser].\n\nThis area will update automatically as you make changes.\n"
      }, {
        "controller": "highlightEditor",
        "content": "The left side of the screen is the [define code_editor]. This has many of the same features as modern code editors.\n"
      }, {
        "controller": "highlightPreviewArea",
        "content": "The right side of the screen is the [define preview_area]. Students are able to see the results of the code as they work.\n"
      }, {
        "controller": "addHeading",
        "content": "Let's have you try writing some HTML for yourself. Follow along with the instructions to add a heading to the page.\n\n[snippet base_example]\n"
      }, {
        "content": "Lessons will have multiple coding exercises that guide a student through writing code.\n"
      }, {
        "controller": "addImage",
        "content": "Let's write some more HTML, but this time let's add an image to the page.\n\nThis example is a little more complicated, but if you follow along with the instructions then you shouldn't have a problem!\n\n[snippet void_example]\n"
      }, {
        "content": "So far you've used [define html] to create a new heading and image. Maybe we need to use some [define css] to improve the visual appearance of the page!\n"
      }, {
        "content": "In later web development lessons we'll begin teaching students how to apply visual styles to their web pages using [define css].\n"
      }, {
        "controller": "addStylesheet",
        "content": "Let's see what kind of difference a little bit of [define css] can make to a web page.\n\nFollow the instructions in include a [define css] [define css_stylesheet stylesheet].\n\n[snippet css_stylesheet]\n"
      }, {
        "title": "About CodeLab",
        "mode": "overlay",
        "content": "CodeLab works entirely from this website, so students can write code and share creations without having to install software on their own computers.\n"
      }, {
        "content": "CodeLab focuses on teaching languages that are actively used by professionals today, such as [define html], [define css], and [define javascript].\n\nCodeLab offers courses in both basic computer programming and web development.\n"
      }, {
        "emote": "happy",
        "content": "Students have **access to their completed lessons from home** so they can continue to work on programming even when they aren't in class.\n\nAdditionally, students can create their own projects and websites and then **share them with friends and family**! \n"
      }, {
        "emote": "happy",
        "content": "If you have any questions about CodeLab, or if you're interested in reserving a space, use either of the links below to get started!\n\n[silent] <a class=\"assistant-button\" target=\"__ask_question\" href=\"https://docs.google.com/forms/d/e/1FAIpQLSeYOBUeymVmQXG654BhiQF7_97_3Okn7vxrSNozqkXy23cZjg/viewform\" >Ask a Question</a> <a class=\"assistant-button\" href=\"/signup\" target=\"__reserve_space\" >Reserve a Space</a>\n"
      }, {
        "mode": "popup",
        "content": "I hope you enjoyed trying out CodeLab! You're free to continue experimenting with these files to see what kind of neat things you can make!\n\n**Create! Learn! And have fun writing code!**\n"
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
        "show": 4,
        "title": "What is another name for the `<` and `>` signs in [define html]?",
        "explain": "The `<` and `>` signs are special characters used by [define html] to identify where [define html_tag tags] begin and end.\n",
        "choices": ["Angle brackets", "Pointy blocks", "Arrow bytecodes", "Sharp codes"]
      }, {
        "emote": "happy",
        "content": "Great work! I hope you learned a lot about creating web pages!\n"
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
        "height": 458,
        "width": 838,
        "type": "jpg",
        "path": "reset-lesson.jpg"
      }, {
        "height": 170,
        "width": 555,
        "type": "jpg",
        "path": "share-project.jpg"
      }, {
        "width": 1260,
        "height": 310,
        "type": "png",
        "path": "tech.png"
      }],
      "definitions": {
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements\n"
        },
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
        "double_click": {
          "id": "double_click",
          "name": "Double Click",
          "define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."
        },
        "file_browser": {
          "id": "file_browser",
          "name": "File Browser",
          "define": "The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"
        },
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "Hypertext Markup Language, a standardized system for tagging text files to achieve font, color, graphic, and hyperlink effects on World Wide Web pages."
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
        "html_tag": {
          "id": "html_tag",
          "name": "HTML Tag",
          "define": "This is about HTML elements - this is `<` or `>`\n"
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
        "code_editor": {
          "id": "code_editor",
          "name": "Code Editor",
          "aka": "IDE",
          "define": "A program that is designed to make it easier to modify code files by including features such as syntax highlighting, auto-complete, and code validation.\n"
        },
        "preview_area": {
          "id": "preview_area",
          "name": "Preview Area",
          "define": "The right side of the screen that shows the current output of the project being worked on"
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
      aboutSaving: aboutSaving, addListItems: addListItems, browserType: browserType, changeHeadingContent: changeHeadingContent, codeEditorIntro: codeEditorIntro, freeButtonInsert: freeButtonInsert, freeHeadingInsert: freeHeadingInsert, highlightFileBrowser: highlightFileBrowser, previewAreaIntro: previewAreaIntro, validation: validation, waitForIndexHtml: waitForIndexHtml
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


  _createClass(web1Lesson, [{
    key: 'activateSlide',

    // helpers
    value: function activateSlide(slide) {

      // check for common controller scenarios
      if (slide.waitForFile) {
        slide.controller = _lib._.uniqueId('controller_');
        var controller = this.controllers[slide.controller] = {};
        (0, _waitForFile2.default)(controller, {
          file: slide.waitForFile,
          content: slide.content,
          fileName: slide.fileName
        });
      }

      if (slide.waitForTab) {
        slide.controller = _lib._.uniqueId('controller_');
        var _controller = this.controllers[slide.controller] = {};
        (0, _waitForTab2.default)(_controller, {
          file: slide.waitForTab
        });
      }

      if (slide.waitForObjectivesList) {
        slide.controller = _lib._.uniqueId('controller_');
        var _controller2 = this.controllers[slide.controller] = {};
        (0, _waitForObjectivesList2.default)(_controller2, {});
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

  return web1Lesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('web_1', web1Lesson);

},{"./aboutSaving":1,"./addListItems":2,"./browserType":3,"./changeHeadingContent":4,"./codeEditorIntro":5,"./controllers/waitForFile":6,"./controllers/waitForObjectivesList":7,"./controllers/waitForTab":8,"./freeButtonInsert":9,"./freeHeadingInsert":10,"./highlightFileBrowser":11,"./lib":13,"./previewAreaIntro":14,"./validation":16,"./waitForIndexHtml":17}],13:[function(require,module,exports){
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
var createTestRunner = exports.createTestRunner = lib.createTestRunner;
var validateHtmlDocument = exports.validateHtmlDocument = lib.HtmlValidationHelper.validate;
var runTests = exports.runTests = lib.runTests;

$.preview = function () {
	return $('#preview .output').contents();
};

exports.default = {
	_: _, $: $,
	CodeValidator: CodeValidator,
	HtmlValidator: HtmlValidator,
	CssValidator: CssValidator,
	createTestRunner: createTestRunner,
	runTests: runTests,
	validateHtmlDocument: validateHtmlDocument
};

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.screen.highlight.previewArea();
}

function onExit() {
	this.screen.highlight.clear();
}

},{}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.randomString = randomString;
exports.randomNumber = randomNumber;
exports.findBoundary = findBoundary;
exports.simplify = simplify;
exports.stringRange = stringRange;
exports.oxfordize = oxfordize;
exports.pluralize = pluralize;
exports.similarity = similarity;

var _lib = require('./lib');

var CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
var TOTAL_CHARACTERS = CHARACTERS.length;
function randomString() {
	var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
	var prefix = arguments[1];

	var result = '';
	for (var i = 0; i < length; i++) {
		result += CHARACTERS.charAt(Math.floor(Math.random() * TOTAL_CHARACTERS));
	}
	return (prefix || '') + result;
}

function randomNumber() {
	var min = void 0;
	var max = void 0;

	if (arguments.length === 1) {
		min = 0;
		max = arguments.length <= 0 ? undefined : arguments[0];
	} else {
		min = arguments.length <= 0 ? undefined : arguments[0];
		max = arguments.length <= 1 ? undefined : arguments[1];
	}

	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
exports.validate_list = exports.validate_insert_button = exports.validate_insert_h3 = undefined;

var _lib = require('./lib');

var validate_h1 = function validate_h1(test) {
	return test.tag('h1').trim.content(5, 25).close('h1');
};

var validate_h3 = function validate_h3(test) {
	return test.tag('h3').trim.content('HTML is great').close('h3');
};

var validate_button = function validate_button(test) {
	return test.tag('button').trim.content('Click me').close('button');
};

var validate_insert_h3 = exports.validate_insert_h3 = function validate_insert_h3(test) {
	return test.__w$.merge(validate_h1)._n.__w$.merge(validate_h3).__w$.eof();
};

var validate_insert_button = exports.validate_insert_button = function validate_insert_button(test) {
	return test.__w$.merge(validate_h1)._n.__w$.merge(validate_h3)._n.__w$.merge(validate_button).__w$.eof();
};

var validate_list = exports.validate_list = function validate_list(test) {
	return test.__w$.merge(validate_h1)._n.__w$.merge(validate_h3)._n.__w$.merge(validate_button)._n.__w$.tag('ol')._n._t.tag('li').text('dog').close('li').progress('added-item')._n._t.tag('li').text('cat').close('li')._n._t.tag('li').text('fish').close('li')._n.close('ol').__w$.eof();
};

// export const validate_h1 = test => test

// export const validate_h3 = test => test

// export const validate_button = test => test

},{"./lib":13}],17:[function(require,module,exports){
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

	this.progress.block();

	this.file.readOnly({ path: '/index.html' });
	this.screen.highlight.fileBrowserItem('/index.html');

	this.delay(10000, function () {
		_this.assistant.say({
			message: '\n\t\t\t\tTo open the `index.html` file, [define double_click double click] the item in the [define file_browser File Browser].\n\t\t\t\tTo [define double_click double click], move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly.'
		});
	});
}

function onExit() {
	this.screen.highlight.clear();
}

},{}]},{},[12]);
