(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;
var $hasInsertedNewline = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		var boundary = (0, _utils.findBoundary)(code, {
			expression: 'else {',
			trimToLine: true
		});

		// // add a newline for readability
		// if (!$hasInsertedNewline) {
		// 	$hasInsertedNewline = true;
		// 	const content = code.substr(0, boundary) + '\n' + code.substr(boundary);
		// 	console.log('epl', content);
		// 	this.file.content({ content, path: '/main.js', replaceRestore: true });
		// }

		test.setBounds(boundary);

		(0, _validation.validate_start_function)(test, {
			includeArgument: true
		});

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'woof',
				'cat': 'meow',
				'mouse': 'squeak',
				'bird': 'tweet'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { arg: 'dog' });

		test.gap();

		(0, _validation.validate_call_func)(test, { arg: 'bird' });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
		$hasInsertedNewline = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;

		this.assistant.say({
			message: 'That\'s correct! Now press **Run Code** to make sure that everything works as expected.'
		});
	},
	onRunCode: function onRunCode() {
		this.screen.highlight.clear();
		return true;
	},
	onExit: function onExit() {
		this.screen.highlight.clear();
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.progress.allow();
		this.screen.highlight.outputLine(2);
		this.assistant.say({
			message: 'Awesome! The new condition worked just like it should and displayed the message **"bird says tweet"**!'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {});
		test.gap();

		(0, _validation.validate_declare_animal)(test, { insideFunction: true, variableName: 'animal' });
		var animalVariable = this.state.animalVariable = test.pull('animalVariable');

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { noArgument: true });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.assistant.say({
			message: 'Good! Now that the [define javascript_function] has been added, use the **Run Code** button so we can see the result.'
		});
	},
	onRunCode: function onRunCode() {
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		var animalVariable = this.state.animalVariable;

		this.state.animalSound = {
			'dog': 'bark',
			'cat': 'meow',
			'mouse': 'squeak'
		}[animalVariable];

		this.progress.allow();
		this.assistant.say({
			message: 'It worked! The [define javascript_function] ran and printed the message like it did before!'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {
			includeArgument: true
		});

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'woof',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { arg: 'dog' });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;

		this.assistant.say({
			message: 'That looks correct! Press **Run Code** and check that the result has updated.'
		});
	},
	onRunCode: function onRunCode() {
		this.screen.highlight.clear();
		return true;
	},
	onExit: function onExit() {
		this.screen.highlight.clear();
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.screen.highlight.outputLine(1);

		this.progress.allow();
		this.assistant.say({
			message: 'There we go! Now the message reads **"dog says woof"** instead of the old message!',
			emote: 'happy'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],4:[function(require,module,exports){
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

},{"../lib":15}],5:[function(require,module,exports){
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

},{"../lib":15}],6:[function(require,module,exports){
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

			if (!!config.disableHint || !!config.disableHints) this.editor.hint.disable();

			if ('area' in config) this.editor.area({ path: config.file, start: config.area.start, end: config.area.end });

			if ('cursor' in config) {
				this.editor.focus();
				setTimeout(function () {
					_this.editor.cursor({ path: config.file, index: config.cursor });
				}, 10);
			}

			validate(this);
		},
		onActivate: function onActivate() {
			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (config.onActivate) return config.onActivate.apply(this, args);
		},
		onRunCode: function onRunCode() {
			for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				args[_key3] = arguments[_key3];
			}

			if (config.onRunCode) return config.onRunCode.apply(this, args);
		},
		onRunCodeEnd: function onRunCodeEnd() {
			for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
				args[_key4] = arguments[_key4];
			}

			if (config.onRunCodeEnd) return config.onRunCodeEnd.apply(this, args);
		},
		onReset: function onReset() {
			validate(this);

			if (state.isValid) return;
			this.progress.block();
			this.assistant.revert();
		},
		onContentChange: function onContentChange(file) {
			validate(this);

			if (state.isValid) return;
			this.progress.block();
			this.assistant.revert();
		},
		onExit: function onExit() {
			this.file.readOnly({ path: config.file });
			this.editor.hint.enable();

			for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
				args[_key5] = arguments[_key5];
			}

			if (config.onExit) config.onExit.apply(this, args);
		}
	}, config.extend);

	// extra logic as required
	if (config.init) config.init.call(obj, obj);
}

},{"../lib":15}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {});
		test.gap();

		(0, _validation.validate_declare_animal)(test, { insideFunction: true, variableName: 'animal' });
		var except = test.pull('selectedAnimal');

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap().eof();
	},
	onValid: function onValid() {
		this.progress.next();
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],8:[function(require,module,exports){
"use strict";

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		test._n._n;

		(0, _validation.validate_list)(test, {
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test._n.lines(2).eof();
	},
	onValid: function onValid() {

		this.progress.allow();

		this.assistant.say({
			message: 'Wow! That was a lot of `if` statements to type in!'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_declare_animal)(test, {
			variableName: 'animal'
		});

		test._n._n;

		(0, _validation.validate_list)(test, {
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test._n.lines(2).eof();

		this.state.animalVariable = test.pull('animalVariable');
	},
	onValid: function onValid() {

		$isValid = true;

		this.assistant.say({
			message: 'That looks good! Now press **Run Code** and let\'s see which message is displayed!'
		});
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onEnter: function onEnter() {
		$isValid = false;
	},

	extend: {
		onRunCode: function onRunCode() {
			this.screen.highlight.clear();
			return true;
		},
		onRunCodeEnd: function onRunCodeEnd() {
			if (!$isValid) return;

			this.screen.highlight.outputLine(1);

			this.progress.allow();
			this.assistant.say({
				message: 'Good job! That looks like the correct message for the `' + this.state.animalVariable + '`!'
			});
		}
	}

});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],11:[function(require,module,exports){
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

var _addBirdSound = require('./addBirdSound');

var addBirdSound = _interopRequireWildcard(_addBirdSound);

var _addInvoke = require('./addInvoke');

var addInvoke = _interopRequireWildcard(_addInvoke);

var _changeDogSound = require('./changeDogSound');

var changeDogSound = _interopRequireWildcard(_changeDogSound);

var _convertToFunction = require('./convertToFunction');

var convertToFunction = _interopRequireWildcard(_convertToFunction);

var _createFunctionDef = require('./createFunctionDef');

var createFunctionDef = _interopRequireWildcard(_createFunctionDef);

var _createIfStatements = require('./createIfStatements');

var createIfStatements = _interopRequireWildcard(_createIfStatements);

var _declareAnimalVar = require('./declareAnimalVar');

var declareAnimalVar = _interopRequireWildcard(_declareAnimalVar);

var _invokeFunctionNoArg = require('./invokeFunctionNoArg');

var invokeFunctionNoArg = _interopRequireWildcard(_invokeFunctionNoArg);

var _invokeFunctionWithBird = require('./invokeFunctionWithBird');

var invokeFunctionWithBird = _interopRequireWildcard(_invokeFunctionWithBird);

var _invokeFunctionWithDog = require('./invokeFunctionWithDog');

var invokeFunctionWithDog = _interopRequireWildcard(_invokeFunctionWithDog);

var _removeInlineVar = require('./removeInlineVar');

var removeInlineVar = _interopRequireWildcard(_removeInlineVar);

var _repeatExample = require('./repeatExample');

var repeatExample = _interopRequireWildcard(_repeatExample);

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
var codeFunctionsBasicsLesson = function () {

  // setup the lesson
  function codeFunctionsBasicsLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, codeFunctionsBasicsLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Using Functions",
      "type": "code",
      "description": "An introduction to using functions in code",
      "lesson": [{
        "mode": "overlay",
        "title": "Introduction to Functions",
        "content": "In this lesson we're going to start learning about a very important feature in programming called [define javascript_function s].\n"
      }, {
        "content": "Generally speaking, [define javascript_function s] are blocks of code that perform a task and can be used over and over.\n\nIn fact, you've been using [define javascript_function s] in the past few lessons!\n"
      }, {
        "content": "Let's look at an example [define javascript_function] from one of the earlier lessons.\n\n[snippet alertMessage]\n\nThis is the `alert` [define javascript_function].\n"
      }, {
        "content": "You probably remember that when this code is run, a message box appears on the screen and displays the phrase **\"hello, world!\"**.\n\n[snippet alertMessage]\n\nYou aren't sure how the message box is being displayed, but you do know that you can control the message that's shown.\n"
      }, {
        "content": "This is actually one of the primary benefits of [define javascript_function s].\n\n[snippet alertMessage]\n\nWith a [define javascript_function] you're able to run a complex block of code, control how it behaves by telling it instructions, and then reuse it over and over again without needing to know what's happening inside.\n"
      }, {
        "content": "So far you've only been using existing [define javascript_function s] in the code that you've written. In this lesson we're going to learn how to write our own!\n\nLet's take a look at what a [define javascript_function] looks like.\n"
      }, {
        "content": "There a several ways to create [define javascript_function s] in [define javascript], but this is a good style to start with.\n\n[snippet addFunction]\n\nIf you ||read|reed|| through the code it's pretty easy to see that this [define javascript_function] will add two values together and then use `console.log` to display it on the screen.\n"
      }, {
        "content": "To define a [define javascript_function] you must start with the `function` [define javascript_keyword].\n\n[snippet addFunction highlight:0,8]\n\nThis will inform [define javascript] that the following code will be a new [define javascript_function].\n"
      }, {
        "content": "After that is the **name** of the [define javascript_function]. This is the phrase you will use when you attempt to use the [define javascript_function] in your code.\n\n[snippet addFunction highlight:9,3]\n\nFor example, this [define javascript_function] would be used by typing in the phrase `||add(5, 5)|add and then a pair of numbers||`.\n"
      }, {
        "content": "Next, you must use an `(`. This marks the beginning of where [define javascript_argument s] can be added.\n\n[snippet addFunction highlight:12,1]\n"
      }, {
        "content": "Between the parentheses are where you can define [define javascript_argument s] for your [define javascript_function].\n\n[snippet addFunction highlight:13,4]\n\n[define javascript_argument s] are extra instructions for a [define javascript_function] so it knows what to do. We'll discuss this in more detail later in the lesson.\n"
      }, {
        "content": "After the [define javascript_argument s], if any have been defined, is the `)`.\n\n[snippet addFunction highlight:17,1]\n\nThis marks the end of the area for the [define javascript_function] [define javascript_argument s].\n"
      }, {
        "content": "Next, the [define javascript_function] needs an `{` and `}`. \n\n[snippet addFunction highlight:19,1|62,1]\n\nThese braces are placed around the code that you want to be run each time this [define javascript_function] is used.\n"
      }, {
        "content": "Now that we've covered the parts of a [define javascript_function], let's walk through each step of what happens with the code each time this [define javascript_function] is used.\n\n[snippet addFunction]\n"
      }, {
        "content": "In this example, there are two values that are _\"passed into\"_ the [define javascript_function]. This basically means that the values for `||a|ae||` and `b` are given to the [define javascript_function] by the code that's using it.\n\n[snippet addFunction highlight:13,1|16,1]\n\n[define javascript_argument s] like these behave almost identically to [define code_variable s].\n"
      }, {
        "content": "Once inside of the [define javascript_function] code block, the two values are added together and _\"assigned\"_ to the [define code_variable] named `total`.\n\n[snippet addFunction highlight:22,18]\n\nIf `||a|ae||` were to be the number **10**, and `b` was the number **15**, then `total` would be the number **25**.\n"
      }, {
        "content": "Finally, the `total` value is displayed in the [define codelab_code_output] area using the `console.log` [define javascript_function].\n\n[snippet addFunction highlight:42,19]\n"
      }, {
        "content": "This now means we have a [define javascript_function] that can be used over and over again by simply changing the [define javascript_argument s] that are \"passed in\".\n\n[snippet usingAddFunction]\n\nEach time the `add` [define javascript_function] is used, the two numbers are added together and then displayed on the screen!\n"
      }, {
        "content": "This is a simple example, but you'll quickly find how useful this can be as you create more complex computer programs.\n"
      }, {
        "mode": "popup",
        "content": "Let's start working on a simple example where a [define javascript_function] would be useful.\n"
      }, {
        "waitForFile": "/main.js",
        "fileName": "main.js"
      }, {
        "content": "Let's start by writing a fairly complex list of `if` statements that check for an animal name and then displays the sound they make.\n"
      }, {
        "controller": "createIfStatements",
        "content": "Follow along with the example and create all of the required conditions.\n"
      }, {
        "controller": "declareAnimalVar",
        "content": "Now declare a [define code_variable] for one of the animals so we can test that the conditions behave as expected.\n"
      }, {
        "content": "Now, at this point, if we had to check another animal sound we'd have to retype all of this code again.\n"
      }, {
        "content": "In fact, we would have to repeat this code every single time we needed to check an animal noise.\n"
      }, {
        "content": "In programming, repeating code is a bad idea. In fact, there's a rule in programming called the **DRY Principle** which means **\"Don't Repeat Yourself\"**.\n\n**If you can avoid repeating code, then it's a good thing to do!**\n"
      }, {
        "content": "Obviously, retyping code over and over very slow and time consuming and would be very difficult to manage!\n\n**This is precisely where [define javascript_function s] are most useful!**\n"
      }, {
        "controller": "convertToFunction",
        "content": "Let's try to change the code you've written so far into a [define javascript_function].\n\nFollow along with the instructions to convert this series of `if` statements into a new [define javascript_function].\n"
      }, {
        "controller": "addInvoke",
        "content": "Now, let's use the `checkAnimalSound` [define javascript_function] and then press **Run Code** to see the result!\n"
      }, {
        "content": "Now that we have a working [define javascript_function], let's start making it more useful.\n"
      }, {
        "content": "Each of the `if` statements in this [define javascript_function] are checking the `animal` variable and then using it to decide which messsages to display.\n"
      }, {
        "content": "At the moment, this code declares the `animal` [define code_variable] and sets it to **\"%%selectedAnimal%%\"**, which makes it impossible for it match any of the other conditions.\n"
      }, {
        "content": "This is a great example of something that should be an [define javascript_argument] for this [define javascript_function].\n"
      }, {
        "mode": "overlay",
        "content": "[define javascript_argument s] make [define javascript] [define javascript_function s] much more useful because they allow you to provide extra instructions that it can use to perform the work.\n"
      }, {
        "content": "Let's look at the `add` function from earlier in the lesson.\n\n[snippet addFunction]\n"
      }, {
        "content": "Both `a` and `b` are [define javascript_argument s].\n\n[snippet addFunction]\n\nIt doesn't matter what the values are since the purpose of the [define javascript_function] is to add _whatever_ two values are provided and add them together and then `log` them onto the screen.\n"
      }, {
        "content": "The values for `a` and `b` are \"passed in\", meaning they are provided when the [define javascript_function] is used.\n\n[snippet addFunction]\n"
      }, {
        "content": "Let's look at the `showAnimalSound` [define javascript_function] you're writing and see how [define javascript_argument s] flow.\n\n[image arg-cat.png]\n\nIn this example, if you were to use ||`showAnimalSound('cat')`|the function show animal sound with the argument cat|| then the `animal` argument would be equal to the value **\"cat\"**.\n"
      }, {
        "content": "Changing the value between the parentheses when using the [define javascript_function] will change the value of `animal` inside of the [define javascript_function].\n\n[image arg-mouse.png]\n\nIn this case, using **\"mouse\"** instead of **\"cat\"** would cause the `animal` [define javascript_argument] to be changed to **\"mouse\"** instead.\n"
      }, {
        "content": "In [define javascript], it's also possible to **not** tell the [define javascript_function] an [define javascript_argument].\n\n[image arg-undefined.png]\n\nIn [define javascript], not providing an [define javascript_argument] will make the value of animal be assigned a special value called `undefined`.\n"
      }, {
        "content": "Finally, [define javascript_function] isn't strict about the types of values that are passed into functions. For example, it's entirely valid to use a number when using this [define javascript_function]!\n\n[image arg-number.png]\n\nWe'll learn how to check the types of [define javascript_argument s] passed into [define javascript_function s] in later lessons.\n"
      }, {
        "mode": "popup",
        "content": "Let's change this [define javascript_function] so that it uses an [define javascript_argument].\n"
      }, {
        "controller": "removeInlineVar",
        "content": "First, we need to remove the `animal` variable that's being declared inside of the [define javascript_function].\n\n[snippet variableToRemove]\n"
      }, {
        "controller": "invokeFunctionNoArg",
        "content": "Next, we need to use `animal` as an argument inside the [define javascript_function] definition.\n"
      }, {
        "controller": "invokeFunctionWithDog",
        "content": "Let's update the ||`showAnimalSound`|show animal sound|| [define javascript_function] to use an [define javascript_argument].\n"
      }, {
        "content": "As mentioned earlier, one of the biggest advantages to using a [define javascript_function] is that you can avoid repeating code through your programs.\n"
      }, {
        "content": "If you didn't use a [define javascript_function], the series of `if` statements would be repeated over and over through the program each time you need to check an animal sound.\n"
      }, {
        "content": "This would be very difficult to maintain or even make changes to it.\n\nFortunately, by using a [define javascript_function], you only need to update the code in one single place.\n"
      }, {
        "controller": "changeDogSound",
        "content": "Try updating the ||`showAnimalSound`|show animal sound|| [define javascript_function] os that a  `dog` makes the sound `woof` instead of the current sound.\n"
      }, {
        "controller": "invokeFunctionWithBird",
        "content": "Let's use the ||`showAnimalSound`|show animal sound|| [define javascript_function] again, but this time include an animal that doesn't exist yet.\n"
      }, {
        "controller": "addBirdSound",
        "content": "Now, let's update the ||`showAnimalSound`|show animal sound|| to include another condition that tests if the [define code_variable] `animal` matches the [define javascript_string] **\"bird\"**.\n"
      }, {
        "content": "As you can see, [define javascript_function s] are a great way to create reusable code that's easy to update!\n"
      }, {
        "content": "You've learned a lot about [define javascript_function s] in this lesson, so let's take a break and review what we've covered.\n"
      }, {
        "mode": "overlay",
        "title": "What is the **DRY** Principle?",
        "choices": ["Don't Repeat Yourself", "Download Redirect Yields", "Don't Reheat Yogurt", "Direct Red to Yellow"],
        "explain": "The **DRY Principle** means, \"Don't repeat yourself\". Basically, instead of repeating the same code over and over, you should try to change it into a reuseable [define javascript_function].\n"
      }, {
        "title": "Functions are a great way to avoid repeating code?",
        "choices": ["True", "False"],
        "explain": "You should try your best to avoid repeating code when you write programs. [define javascript_function s] are a great way to create reusable blocks of code and simplify the programs you create.\n"
      }, {
        "title": "What is the highlighted block of code?",
        "content": "[snippet quizExample highlight:15,4]\n",
        "choices": ["An argument", "A code maker", "A binary reader", "An HTML Element"],
        "explain": "The values between the parentheses in a [define javascript_function] declaration are the [define javascript_argument s]. You can define as you'd like, so long as you separate each one with a `,`.\n"
      }, {
        "title": "what is the higlighted block of code?",
        "content": "[snippet quizExample highlight:9,5]\n",
        "choices": ["The function name", "An argument", "A bytecode reversal", "The file terminator"],
        "explain": "After the `function` [define javascript_keyword] is the name of the [define javascript_function]. This is what you will type whenever you're using the [define javascript_function] in your code.\n"
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {
        "addFunction": {
          "content": "function add(a, b) {\n\tlet total = a + b;\n\tconsole.log(total);\n}",
          "type": "javascript"
        },
        "alertMessage": {
          "content": "alert('hello, world!');",
          "type": "javascript"
        },
        "functionWithoutArg": {
          "content": "showAnimalSound();",
          "type": "javascript"
        },
        "quizExample": {
          "content": "function greet(name) {\n  console.log('hello,', name);\n}",
          "type": "javascript"
        },
        "usingAddFunction": {
          "content": "add(10, 5);\nadd(123, 456);\nadd(99, 77);\nadd(1, 0);",
          "type": "javascript"
        },
        "variableToRemove": {
          "content": "let animal = `%%animalVariable%%`;",
          "type": "javascript"
        }
      },
      "resources": [{
        "width": 1260,
        "height": 496,
        "type": "png",
        "path": "arg-cat.png"
      }, {
        "width": 1260,
        "height": 496,
        "type": "png",
        "path": "arg-mouse.png"
      }, {
        "width": 1260,
        "height": 496,
        "type": "png",
        "path": "arg-number.png"
      }, {
        "width": 1260,
        "height": 496,
        "type": "png",
        "path": "arg-undefined.png"
      }],
      "definitions": {
        "javascript_function": {
          "id": "javascript_function",
          "name": "Function",
          "define": "A block of executed code\n"
        },
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
        },
        "javascript_argument": {
          "id": "javascript_argument",
          "name": "Argument",
          "define": "A parameter for functions\n"
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
        "javascript_keyword": {
          "id": "javascript_keyword",
          "name": "Keyword",
          "define": "A reserved word in JavaScript that has a purpose\n"
        },
        "code_variable": {
          "id": "code_variable",
          "name": "Variable",
          "define": "A programming method of storing and accessing data \n"
        },
        "codelab_code_output": {
          "id": "codelab_code_output",
          "name": "Code Output",
          "define": "The result of called code\n"
        },
        "javascript_string": {
          "id": "javascript_string",
          "name": "String",
          "plural": "Strings",
          "define": "Series of characters\n"
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
      addBirdSound: addBirdSound, addInvoke: addInvoke, changeDogSound: changeDogSound, convertToFunction: convertToFunction, createFunctionDef: createFunctionDef, createIfStatements: createIfStatements, declareAnimalVar: declareAnimalVar, invokeFunctionNoArg: invokeFunctionNoArg, invokeFunctionWithBird: invokeFunctionWithBird, invokeFunctionWithDog: invokeFunctionWithDog, removeInlineVar: removeInlineVar, repeatExample: repeatExample, validation: validation
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


  _createClass(codeFunctionsBasicsLesson, [{
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

  return codeFunctionsBasicsLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('code_functions_basics', codeFunctionsBasicsLesson);

},{"./addBirdSound":1,"./addInvoke":2,"./changeDogSound":3,"./controllers/waitForFile":4,"./controllers/waitForTab":5,"./convertToFunction":7,"./createFunctionDef":8,"./createIfStatements":9,"./declareAnimalVar":10,"./invokeFunctionNoArg":12,"./invokeFunctionWithBird":13,"./invokeFunctionWithDog":14,"./lib":15,"./removeInlineVar":16,"./repeatExample":17,"./validation":19}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {
			includeArgument: true
		});

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { noArgument: true });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;

		this.assistant.say({
			message: 'That\'s correct! Press **Run Code** and let\'s see the result.'
		});
	},
	onExit: function onExit() {
		this.screen.highlight.clear();
	},
	onRunCode: function onRunCode() {
		this.screen.highlight.clear();
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;
		this.screen.highlight.outputLine(1);

		this.progress.allow();
		this.assistant.say({
			message: 'Perfect! In this case, the function ||`showAnimalSound`|show animal sound|| is being used without an [define javascript argument], meaning `animal` has a value of `undefined`.\n\nThis means it won\'t match any of the `if` conditions and the message **"not sure"** is correct!'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {
			includeArgument: true
		});

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'woof',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { arg: 'dog' });

		test.gap();

		(0, _validation.validate_call_func)(test, { arg: 'bird' });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;

		this.assistant.say({
			message: 'Good! Now press **Run Code** and to see what message is shown!'
		});
	},
	onExit: function onExit() {
		this.screen.highlight.clear();
	},
	onRunCode: function onRunCode() {
		this.screen.highlight.clear();
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;

		this.progress.allow();
		this.screen.highlight.outputLine(2);
		this.assistant.say({
			message: 'That\'s exactly what we should see. The [define javascript_argument] `animal` has the value **"bird"**, which doesn\'t match any of the conditions.'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {
			includeArgument: true
		});

		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { arg: 'dog' });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;

		this.assistant.say({
			message: 'Great! Now press **Run Code** to see the result.'
		});
	},
	onExit: function onExit() {
		this.screen.highlight.clear();
	},
	onRunCode: function onRunCode() {
		this.screen.highlight.clear();
		return true;
	},
	onRunCodeEnd: function onRunCodeEnd() {
		if (!$isValid) return;
		this.screen.highlight.outputLine(1);

		this.progress.allow();
		this.assistant.say({
			message: 'Fantastic! The [define javascript_argument] was passed from where the ||`showAnimalSound`|show animal sound|| [define javascript_function] was used and into the `animal` [define javascript_argument]!'
		});
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_start_function)(test, {});
		test.gap();

		(0, _validation.validate_list)(test, {
			insideFunction: true,
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test.gap();

		(0, _validation.validate_end_function)(test);

		test.gap();

		(0, _validation.validate_call_func)(test, { noArgument: true });

		test.gap().eof();
	},
	onActivate: function onActivate() {
		$isValid = false;
	},
	onInvalid: function onInvalid() {
		$isValid = false;
	},
	onValid: function onValid() {
		$isValid = true;
		this.progress.next();
	},
	onRunCode: function onRunCode() {
		return true;
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.controller = undefined;

var _lib = require('./lib');

var _utils = require('./utils');

var _waitForValidation = require('./controllers/waitForValidation');

var _waitForValidation2 = _interopRequireDefault(_waitForValidation);

var _validation = require('./validation');

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var controller = exports.controller = true;
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		(0, _validation.validate_declare_animal)(test, { variableName: 'animal' });
		var except = test.pull('animalVariable');

		test._n._n;

		(0, _validation.validate_list)(test, {
			animals: {
				'dog': 'bark',
				'cat': 'meow',
				'mouse': 'squeak'
			}
		});

		test._n;

		(0, _validation.validate_declare_animal)(test, {
			variableName: 'otherAnimal',
			except: except
		});

		test._n.lines(2).eof();
	},
	onValid: function onValid() {
		this.progress.next();
	}
});

},{"./controllers/waitForValidation":6,"./lib":15,"./utils":18,"./validation":19}],18:[function(require,module,exports){
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

},{"./lib":15}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validate_list = exports.validate_declare_animal = exports.validate_end_function = exports.validate_start_function = exports.validate_call_func = undefined;

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

function _defineProperty(obj, key, value) {
	if (key in obj) {
		Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
	} else {
		obj[key] = value;
	}return obj;
}

var validate_call_func = exports.validate_call_func = function validate_call_func(test, options) {
	test.func('showAnimalSound').symbol('(');

	if (options.arg) test.string(options.arg);

	test.symbol(')').symbol(';');
};

var validate_start_function = exports.validate_start_function = function validate_start_function(test, options) {
	test.keyword('function')._s.id('showAnimalSound').symbol('(');

	if (options.includeArgument) test.arg('animal');

	test.symbol(')')._s.symbol('{');
};

var validate_end_function = exports.validate_end_function = function validate_end_function(test) {
	return test.symbol('}');
};

var validate_declare_animal = exports.validate_declare_animal = function validate_declare_animal(test) {
	var _test$declare$_s$id$_;

	var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	// get the valid animal options
	var animals = ['dog', 'cat', 'mouse'];
	if (options.except) {
		animals.splice(animals.indexOf(options.except), 1);
	}

	if (options.insideFunction) test.tab();

	// declare the variable
	(_test$declare$_s$id$_ = test.declare('let')._s.id(options.variableName)._s.symbol('=')._s).string.apply(_test$declare$_s$id$_, animals.concat([function (id) {
		test.append(_defineProperty({}, options.variableName + 'Variable', id));
	}])).symbol(';');
};

var validate_list = exports.validate_list = function validate_list(test, options) {

	// get the options
	var insideFunction = options.insideFunction;

	var names = _lib._.keys(options.animals);
	var sounds = _lib._.values(options.animals);
	var soundArgs = _lib._.map(sounds, function (sound, index) {
		return names[index] + ' says ' + sound;
	});
	var total = names.length;

	// check each animal
	_lib._.times(total, function (index) {
		var _test$_s$symbol$id$_s;

		var isFirst = index === 0;
		var isLast = index + 1 === total;
		var expectsSound = void 0;
		var removeAt = void 0;

		// nudge over inside of a function
		if (insideFunction) test.tab();

		// create the if statement
		if (isFirst) test.keyword('if');else test.keyword('else')._s.keyword('if');

		// create the comparison
		(_test$_s$symbol$id$_s = test._s.symbol('(').id('animal')._s.symbol('===')._s).string.apply(_test$_s$symbol$id$_s, _toConsumableArray(names).concat([function (match) {
			removeAt = names.indexOf(match);
			expectsSound = soundArgs[removeAt];
		}])).symbol(')')._s.symbol('{')._n;

		// extra tab for function
		if (insideFunction) test.tab();

		// nudge inward for the message
		test._t.id('console').symbol('.').func('log').symbol('(').string(expectsSound, function (match) {
			names.splice(removeAt, 1);
			sounds.splice(removeAt, 1);
			soundArgs.splice(removeAt, 1);
		}).symbol(')').symbol(';')._n;

		if (insideFunction) test.tab();

		// closing brace
		test.symbol('}');

		// finishing up
		if (!isLast) test._n.lines(1);
	});

	// finally, include the else
	test.clearBounds()._n.lines(1);

	// tab first
	if (insideFunction) test.tab();

	// else keyword
	test.keyword('else')._s.symbol('{')._n;

	// extra tab, if needed
	if (insideFunction) test.tab();

	// logging message
	test._t.id('console').symbol('.').func('log').symbol('(').string('not sure').symbol(')').symbol(';')._n;

	// closing the brace
	if (insideFunction) test.tab();

	test.symbol('}');
};

},{"./lib":15}]},{},[11]);
