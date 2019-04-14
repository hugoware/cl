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

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		test.lines(3).merge(_validation.validate_basic_1)._n.lines(3).eof();
	},
	onValid: function onValid() {

		$isValid = true;

		this.assistant.say({
			message: 'Looks good! Press the **Run Code** button so we can see the output!'
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
			return true;
		},
		onRunCodeEnd: function onRunCodeEnd() {
			if (!$isValid) return;

			this.progress.allow();
			this.assistant.say({
				message: 'Fantastic! Each of the expressions worked as expected and printed their values in the [define codelab_code_output] area!',
				emote: 'happy'
			});
		}
	}

});

},{"./controllers/waitForValidation":6,"./lib":8,"./utils":12,"./validation":13}],2:[function(require,module,exports){
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
	disableHints: true,

	validation: function validation(test, code) {

		test.lines(3).merge(_validation.validate_basic_1)._n.lines(2).merge(_validation.validate_basic_2).lines(2).eof();
	},
	onValid: function onValid() {

		$isValid = true;

		this.assistant.say({
			message: 'Very good! Press **Run Code** and let\'s see what happens next!'
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
			return true;
		},
		onRunCodeEnd: function onRunCodeEnd() {
			if (!$isValid) return;

			this.progress.allow();
			this.assistant.say({
				message: 'That\'s it! Each `console.log` message is displaying the correct result for their expression!',
				emote: 'happy'
			});
		}
	}

});

},{"./controllers/waitForValidation":6,"./lib":8,"./utils":12,"./validation":13}],3:[function(require,module,exports){
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

		test.lines(3).merge(_validation.validate_basic_1)._n.lines(2).merge(_validation.validate_basic_2)._n.lines(2).merge(_validation.validate_basic_3).lines(2).eof();
	},
	onValid: function onValid() {

		$isValid = true;

		this.assistant.say({
			message: 'Very good! Press **Run Code** and let\'s see what happens next!'
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
			return true;
		},
		onRunCodeEnd: function onRunCodeEnd() {
			if (!$isValid) return;

			this.progress.allow();
			this.assistant.say({
				message: 'That\'s it! Each of these [define javascript_expression ls] are more complicated, but the results are still what you\'d expect!',
				emote: 'happy'
			});
		}
	}

});

},{"./controllers/waitForValidation":6,"./lib":8,"./utils":12,"./validation":13}],4:[function(require,module,exports){
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

},{"../lib":8}],5:[function(require,module,exports){
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

},{"../lib":8}],6:[function(require,module,exports){
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

			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			if (config.onExit) config.onExit.apply(this, args);
		}
	}, config.extend);

	// extra logic as required
	if (config.init) config.init.call(obj, obj);
}

},{"../lib":8}],7:[function(require,module,exports){
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

var _basicMath = require('./basicMath1');

var basicMath1 = _interopRequireWildcard(_basicMath);

var _basicMath2 = require('./basicMath2');

var basicMath2 = _interopRequireWildcard(_basicMath2);

var _basicMath3 = require('./basicMath3');

var basicMath3 = _interopRequireWildcard(_basicMath3);

var _modifyVariables = require('./modifyVariables');

var modifyVariables = _interopRequireWildcard(_modifyVariables);

var _tryConsole = require('./tryConsole');

var tryConsole = _interopRequireWildcard(_tryConsole);

var _usingVariables = require('./usingVariables');

var usingVariables = _interopRequireWildcard(_usingVariables);

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
var codeMathBasicsLesson = function () {

  // setup the lesson
  function codeMathBasicsLesson(project, lesson, api) {
    var _this = this;

    _classCallCheck(this, codeMathBasicsLesson);

    this.state = {};
    this.lesson = lesson;
    this.project = project;
    this.api = api;

    // core lesson data
    this.data = {
      "name": "Basic Arithmetic",
      "type": "code",
      "description": "An introduction to using numbers and simple math operators",
      "lesson": [{
        "mode": "overlay",
        "title": "Basic Arithmetic",
        "content": "In this lesson we're going to start learning the capabilities of [define javascript JavaScript's] Arithmetic [define code_operator ls].\n"
      }, {
        "content": "An [define code_operator l] is simply a symbol that does something using other values. This is called an _\"operation\"_.\n\n[snippet operator_example]\n\n[define javascript] has Arithmetic operations, such as adding numbers together, as well as Logical operations, such as checking `true` and `false` conditions.\n"
      }, {
        "content": "This example uses Arithmetic operations to add two numbers together. The operator in this example is the `+` sign.\n\n[snippet operator_example highlight:19,6]\n"
      }, {
        "content": "After that, Logical operations are used to compare if the [define code_variable l] ||`totalCookies`|total cookies|| is less than the number `20`.\n\n[snippet operator_example highlight:32,17]\n\nIn this case, the [define code_operator l] being used is the `<` sign.\n"
      }, {
        "content": "[define javascript] has other types of [define code_operator ls] that you will eventually use. In this lesson we're going to be focusing on math operations that you're already familiar with.\n"
      }, {
        "content": "In [define javascript], you can use the `+` sign to perform addition.\n\n[snippet math_basics highlight:0,16]\n"
      }, {
        "content": "The ||`-`|minus|| sign is used for subtraction.\n\n[snippet math_basics highlight:17,22]\n"
      }, {
        "content": "Division is performed with the `/` character.\n\n[snippet math_basics highlight:40,20]\n"
      }, {
        "content": "And lastly, multiplication is done using the `*`.\n\n[snippet math_basics highlight:61,21]\n"
      }, {
        "content": "[define javascript] has many more math operations, but in this lesson we will be focusing on the basics.\n\n[snippet math_basics]\n"
      }, {
        "content": "Sequences of numbers like these are typically called [define javascript_expression s].\n\n[snippet math_expression highlight:13,10]\n\nAn [define javascript_expression l] is a set of literals, such as [define javascript_string ls] and numbers, [define code_variable ls], and [define code_operator ls] that become a single value after they've been evaluated.\n"
      }, {
        "content": "For example, this [define javascript_expression l] is made up of 5 parts.\n\n[snippet math_expression highlight:13,1|15,1|17,2|20,1|22,1]\n\nWhen the [define javascript_expression l] is evaluated, [define javascript] will take a value from each side of an [define code_operator l] and then perform the math required.\n"
      }, {
        "content": "When this code is run, [define javascript] would take the numbers `5` and `10`, and then use the `+` sign to add them together. This ends up with the number `15`.\n\n[snippet math_expression highlight:13,6|13,10]\n\nAfter that, [define javascript] would take the number `15` and subtract the next value, which is the number `8`.\n"
      }, {
        "content": "After performing each of these [define javascript_expression ls], the value is then placed in to the [define code_variable l] named `result`.\n\n[snippet math_expression highlight:4,6]\n\n**The final value for the [define code_variable l] `result` would be `7`!**\n"
      }, {
        "mode": "popup",
        "content": "Let's try performing a few math operations of our own.\n"
      }, {
        "waitForFile": "/main.js",
        "fileName": "main.js"
      }, {
        "highlight": "#preview",
        "content": "In this lesson we're going to introduce a new way to write messages using the `console`\n\nUnlike the `alert` message box, this will show messages in the output area without needing to press the **OK** button.\n"
      }, {
        "controller": "tryConsole",
        "content": "Press **Run Code** to see the `console.log` write a message to the [define codelab_code_output] area.\n"
      }, {
        "controller": "basicMath1",
        "content": "Let's try out some math operations. Follow along with the instructions to create some simple expressions.\n"
      }, {
        "content": "Let's try that again, but this time without any code hints. If you get stuck, use the **Show Hints** button to turn them back on.\n"
      }, {
        "controller": "basicMath2",
        "content": "Write two more `console.log` messages using different math operations each time. Like with the previous examples, only use numbers from 1 to 9999.\n"
      }, {
        "mode": "overlay",
        "content": "So far each of the examples we've worked on only use two numbers and a single math operator, however, [define javascript] is able to understand far more complex expressions.\n"
      }, {
        "content": "In this example you can see that these [define javascript_expression ls] use even more numbers and [define code_operator ls].\n\n[snippet math_complex]\n"
      }, {
        "content": "The value of ||`example1`|example 1|| ends up being the number `5`. The longer expression for  ||`example2`|example 2|| evaluates to the number `13`.\n\n[snippet math_complex highlight:15,9|41,20]\n\nBut the end result for ||`example3`|example 3|| is deceptively more complicated.\n"
      }, {
        "content": "The value for ||`example3`|example 3|| ends up being the number `1`. This might seem surprising, but it's the expected result.\n\n[snippet math_complex highlight:78,9]\n\nAs it turns out, [define javascript] will automatically use [define order_of_operations] when performing math.\n"
      }, {
        "content": "[define order_of_operations] is the sequence in which math expressions are evaluated. You might have heard your teacher mention this in school before as ||**PEMDAS**|pim daas||.\n\n[snippet math_complex highlight:82,5]\n\nWhen you follow the [define order_of_operations], multiplication should be done before addition. This will dramatically change the result of the [define javascript_expression l].\n    \n"
      }, {
        "content": "As a reminder, ||**PEMDAS**|pim daas|| states that math should be evaluated in the following order.\n\n**Parentheses, Exponentials, Multiply, Divide, Add**, then **Subtract**\n\nThis will be important when you create more complicated math expressions.\n"
      }, {
        "content": "We'll learn more about [define order_of_operations] in later lessons, but for now let's continue to work with basic Arithmetic operations.\n"
      }, {
        "mode": "popup",
        "content": "Let's try to write a few expressions that use several math operations.\n"
      }, {
        "controller": "basicMath3",
        "content": "Follow along with the instructions and write two more expressions that use multiple numbers and [define code_operator sl]. \n"
      }, {
        "mode": "overlay",
        "content": "You might remember from earlier in the lesson that [define javascript_expression ls] allow for [define code_variable ls] to be used along with [define code_operator ls].\n\n[snippet math_variable size:medium]\n"
      }, {
        "content": "In this example, two [define code_variable ls] are declared each with a number of their own.\n\n[snippet math_variable size:medium highlight:0,25|26,21]\n"
      }, {
        "content": "The last of the [define code_variable ls] is an [define javascript_expression l] that multiplies the previous two [define code_variable ls] together.\n\n[snippet math_variable size:medium highlight:67,30]\n\nEven though there aren't any numbers typed in the expression for ||`totalCookies`|total cookies||, the result for that [define code_variable l] is `36`!\n"
      }, {
        "content": "Being able to use [define code_variable ls] inside of [define javascript_expression ls] is extremely powerful and will become increasingly useful as you learn more about [define javascript].\n\n[snippet math_variable size:medium]\n"
      }, {
        "mode": "popup",
        "content": "Let's try to use some [define code_variable ls] and [define javascript_expression ls] together.\n"
      }, {
        "controller": "usingVariables",
        "content": "Try declaring some variables and then using `console||.| dot ||log` to display them in the [define codelab_code_output] area.\n\n[snippet variable_example size:xsmall]\n"
      }, {
        "content": "Because [define code_variable ls] can be declared separately from where they are used, you're also able to change the value of a [define code_variable l]. When the code is executed the new values will be used instead!\n"
      }, {
        "content": "This is a very simple example, but as code becomes more complicated the ability to use [define code_variable ls] from different locations becomes critical for writing complex computer programs!\n"
      }, {
        "controller": "modifyVariables",
        "content": "Try changing the values for both the `||cookiesPerPerson|cookies per person||` and `||totalPeople|total people||` to new numbers, then press **Run Code** to see the new total value.\n"
      }, {
        "content": "We've learned a lot in this lesson so let's take a break and review what we've covered so far!\n"
      }, {
        "mode": "overlay",
        "inline": true,
        "title": "What is the operator used to **multiply** numbers?",
        "explain": "Multiplication is performed using the `*` character.\n\n**Fun fact**: The `×` sign is known as the multiplication symbol, but since it could be confused with a [define code_variable l] named `x`, it's considered better to use an `*`.\n",
        "choices": ["`*`", "`+`", "`-`", "`/`"]
      }, {
        "inline": true,
        "title": "What is the operator used to **divide** numbers?",
        "explain": "Division is performed using the `/` character.\n\n**Fun fact**: Math can do some pretty wild things! Did you know that `5 ||/|divided by|| 0.25` and `5 ||*|times|| 4` are both equal to `20`?\n",
        "choices": ["`/`", "`*`", "`+`", "`-`"]
      }, {
        "title": "What does **Order of Operations** mean?",
        "explain": "The [define order_of_operations] is the rules that decide which math operations are performed first in an expression. You probably have heard this mentioned before in math class as **||PEMDAS|pim daas||**.\n",
        "choices": ["The specific order that math expressions should be evaluated", "The command in JavaScript to convert numbers to strings", "A program that removes unused code from a file", "The scientific name for a negative number"]
      }, {
        "title": "What is the value of `result` after the math expression?",
        "inline": true,
        "content": "[snippet question_1]\n",
        "explain": "Following the [define order_of_operations] means you must first perform **addition** and then **subtraction**. This means that `2 + 4` becomes `6`, and then `6 ||-|minus|| 2` results in `4` again!\n",
        "choices": ["`4`", "`2`", "`6`", "`8`"]
      }, {
        "title": "What is the value of `result` after the math expression?",
        "inline": true,
        "content": "[snippet question_2]        \n",
        "explain": "Even though this [define javascript_expression l] is out of order, [define javascript] will follow the [define order_of_operations] and start by performing the **multiplication** step first. This means that `4 ||*|times|| 2` becomes `8`, and then `8 + 2` results in `10`!\n",
        "choices": ["`10`", "`8`", "`12`", "`16`"]
      }, {
        "mode": "popup",
        "content": "Experimenting with code is a great way to learn more about how it works. You're encouraged to continue making changes to these files before moving on.\n\nGreat work, and I'll see you in the next lesson!\n"
      }],
      "snippets": {
        "math_basics": {
          "content": "let add = 5 + 5;\nlet subtract = 10 - 4;\nlet divide = 25 / 5;\nlet multiply = 6 * 2;",
          "type": "javascript"
        },
        "math_complex": {
          "content": "let example1 = 2 + 6 - 3;\nlet example2 = 1 - 3 + 10 - 15 + 20;\nlet example3 = 5 - 2 * 2;",
          "type": "javascript"
        },
        "math_expression": {
          "content": "let result = 5 + 10 - 8;",
          "type": "javascript"
        },
        "math_variable": {
          "content": "let cookiesPerPerson = 3;\nlet totalPeople = 12;\nlet totalCookies = cookiesPerPerson * totalPeople;",
          "type": "javascript"
        },
        "operator_example": {
          "content": "let totalCookies = 5 + 10;\n\nif (totalCookies < 20) {\n\talert('not enough cookies!');\n}",
          "type": "javascript"
        },
        "question_1": {
          "content": "let result = 2 + 4 - 2;",
          "type": "javascript"
        },
        "question_2": {
          "content": "let result = 2 + 4 * 2;",
          "type": "javascript"
        },
        "variable_example": {
          "content": "let cookiesPerPerson = 3;\nlet totalPeople = 12;\nlet totalCookies =\n\tcookiesPerPerson * totalPeople;",
          "type": "javascript"
        }
      },
      "resources": [],
      "definitions": {
        "codelab_code_output": {
          "id": "codelab_code_output",
          "name": "Code Output",
          "define": "The result of called code\n"
        },
        "javascript_expression": {
          "id": "javascript_expression",
          "name": "Expression",
          "define": "A sequence of numbers, string, variables, and operators that evaluate to a single value\n"
        },
        "code_variable": {
          "id": "code_variable",
          "name": "Variable",
          "define": "A programming method of storing and accessing data \n"
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
        "javascript": {
          "id": "javascript",
          "name": "JavaScript",
          "define": "Programming language\n"
        },
        "code_operator": {
          "id": "code_operator",
          "name": "Operator",
          "define": "Something in code that does a thing like add/sub\n"
        },
        "javascript_string": {
          "id": "javascript_string",
          "name": "String",
          "plural": "Strings",
          "define": "Series of characters\n"
        },
        "order_of_operations": {
          "id": "order_of_operations",
          "name": "Order of Operations",
          "define": "The sequence that math is executed\n"
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
      basicMath1: basicMath1, basicMath2: basicMath2, basicMath3: basicMath3, modifyVariables: modifyVariables, tryConsole: tryConsole, usingVariables: usingVariables, validation: validation
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


  _createClass(codeMathBasicsLesson, [{
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

  return codeMathBasicsLesson;
}();

// converts to an invoke action name


function toActionName(name) {
  if (!/on[A-Z]/.test(name)) name = 'on' + name.charAt(0).toUpperCase() + name.substr(1);
  return name;
}

// register the lesson for use
window.registerLesson('code_math_basics', codeMathBasicsLesson);

},{"./basicMath1":1,"./basicMath2":2,"./basicMath3":3,"./controllers/waitForFile":4,"./controllers/waitForTab":5,"./lib":8,"./modifyVariables":9,"./tryConsole":10,"./usingVariables":11,"./validation":13}],8:[function(require,module,exports){
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
var $isValid = void 0;

(0, _waitForValidation2.default)(module.exports, {

	file: '/main.js',

	validation: function validation(test, code) {

		test.lines(3).merge(_validation.validate_basic_1)._n.lines(2).merge(_validation.validate_basic_2)._n.lines(2).merge(_validation.validate_basic_3)._n.lines(2);

		(0, _validation.validate_variables)(test, this.state.cookies, this.state.people);
		test.lines(2).eof();
	},
	onValid: function onValid() {

		$isValid = true;

		this.assistant.say({
			message: 'That looks correct! Press **Run Code** and let\'s see the result!'
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
			return true;
		},
		onRunCodeEnd: function onRunCodeEnd(runner) {
			if (!$isValid) return;

			var value = _lib._.toString(runner.output[9]);
			var isSame = _lib._.toString(this.state.cookies * this.state.people) === value;
			var message = isSame ? "Oh, that's funny! You changed the numbers but still ended up with the same total as before! In any case, changing [define code_variable ls] will normally cause [define javascript_expression ls] to end up with different results!" : 'Perfect! Changing the value of [define code_variable sl] earlier in the code caused the [define javascript_expression l] for `||totalCookies|total cookies||` to have a different result!';

			this.screen.highlight.outputLine(9);
			this.progress.allow();
			this.assistant.say({
				message: message,
				emote: isSame ? 'surprise' : 'happy'
			});
		}
	}

});

},{"./controllers/waitForValidation":6,"./lib":8,"./utils":12,"./validation":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.onEnter = onEnter;
exports.onRunCode = onRunCode;
exports.onRunCodeEnd = onRunCodeEnd;
exports.onExit = onExit;
var controller = exports.controller = true;

function onEnter() {
	this.progress.block();
}

function onRunCode() {
	return true;
}

function onRunCodeEnd() {
	this.screen.highlight.outputLine(1);
	this.progress.allow();
	this.assistant.say({
		message: "That's pretty great! Now each time you use `console.log` a new message will be appended to the end of the [define codelab_code_output] area.",
		emote: 'happy'
	});
}

function onExit() {
	this.file.content({
		path: '/main.js',
		replaceRestore: true,
		content: '\n\n\n'
	});
}

},{}],11:[function(require,module,exports){
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

		test.lines(3).merge(_validation.validate_basic_1)._n.lines(2).merge(_validation.validate_basic_2)._n.lines(2).merge(_validation.validate_basic_3)._n.lines(2);

		(0, _validation.validate_variables)(test);
		test.lines(2).eof();

		// for the next test
		this.state.cookies = test.pull('cookies');
		this.state.people = test.pull('people');
	},
	onValid: function onValid() {

		$isValid = true;

		this.assistant.say({
			message: 'That looks correct! Press **Run Code** and let\'s see the result!'
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
			return true;
		},
		onRunCodeEnd: function onRunCodeEnd() {
			if (!$isValid) return;

			this.screen.highlight.outputLine(9);
			this.progress.allow();
			this.assistant.say({
				message: 'Wonderful! The [define code_variable l] `||totalCookies|total cookies||` was declared using the result of the [define javascript_expression l] using two other [define code_variable ls].',
				emote: 'happy'
			});
		}
	}

});

},{"./controllers/waitForValidation":6,"./lib":8,"./utils":12,"./validation":13}],12:[function(require,module,exports){
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

},{"./lib":8}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () {
	function sliceIterator(arr, i) {
		var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
			for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
				_arr.push(_s.value);if (i && _arr.length === i) break;
			}
		} catch (err) {
			_d = true;_e = err;
		} finally {
			try {
				if (!_n && _i["return"]) _i["return"]();
			} finally {
				if (_d) throw _e;
			}
		}return _arr;
	}return function (arr, i) {
		if (Array.isArray(arr)) {
			return arr;
		} else if (Symbol.iterator in Object(arr)) {
			return sliceIterator(arr, i);
		} else {
			throw new TypeError("Invalid attempt to destructure non-iterable instance");
		}
	};
}();

function twoSegmentExpression(test, limit) {
	var allowed = ['+', '-', '/', '*'];

	var limit_range = function limit_range(match, num) {
		if (!match) return 'Enter a number from 1 to 9999';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 9999) return 'Use a number less than 10,000';
	};

	for (var i = 0; i < limit; i++) {
		var _test$id$symbol$func$;

		(_test$id$symbol$func$ = test.id('console').symbol('.').func('log').symbol('(').number(limit_range)._s).symbol.apply(_test$id$symbol$func$, allowed.concat([function (used) {
			var index = allowed.indexOf(used);
			allowed.splice(index, 1);
		}]))._s.number(limit_range).symbol(')').symbol(';');

		if (i + 1 !== limit) {
			test.lines(2);
		}
	}
}

function threeSegmentExpression(test, limit) {
	var allowed = ['+', '-', '/', '*'];

	var limit_range = function limit_range(match, num) {
		if (!match) return 'Enter a number from 1 to 9999';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 9999) return 'Use a number less than 10,000';
	};

	for (var i = 0; i < limit; i++) {
		var _test$id$symbol$func$2, _test$id$symbol$func$3;

		(_test$id$symbol$func$2 = (_test$id$symbol$func$3 = test.id('console').symbol('.').func('log').symbol('(').number(limit_range)._s).symbol.apply(_test$id$symbol$func$3, allowed.concat([function (used) {
			var index = allowed.indexOf(used);
			allowed.splice(index, 1);
		}]))._s.number(limit_range)._s).symbol.apply(_test$id$symbol$func$2, allowed.concat([function (used) {
			var index = allowed.indexOf(used);
			allowed.splice(index, 1);
		}]))._s.number(limit_range).symbol(')').symbol(';');

		if (i + 1 !== limit) {
			test.lines(2);
		}
	}
}

var validate_basic_1 = exports.validate_basic_1 = function validate_basic_1(test) {
	twoSegmentExpression(test, 4);
};

var validate_basic_2 = exports.validate_basic_2 = function validate_basic_2(test) {
	twoSegmentExpression(test, 2);
};

var validate_basic_3 = exports.validate_basic_3 = function validate_basic_3(test) {
	threeSegmentExpression(test, 2);
};

var validate_variables = exports.validate_variables = function validate_variables(test, cookies, people) {
	var expects = void 0;
	var alt = void 0;

	var limit_range = function limit_range(match, num) {
		if (!match) return 'Enter a number from 1 to 100';
		if (num < 1) return 'Use a number greater than 0';
		if (num > 100) return 'Use a number less than 100';
	};

	var check_cookies = function check_cookies(match, num) {
		if (!isNaN(cookies) && num === cookies) return 'Use a different number than `' + cookies + '`';
		test.append({ cookies: num });
		return limit_range(match, num);
	};

	var check_people = function check_people(match, num) {
		if (!isNaN(people) && num === people) return 'Use a different number than `' + people + '`';
		test.append({ people: num });
		return limit_range(match, num);
	};

	test.declare('let')._s.id('cookiesPerPerson', 'totalPeople', function (used) {
		if (used === 'cookiesPerPerson') alt = 'totalPeople';
		if (used === 'totalPeople') alt = 'cookiesPerPerson';
	})._s.symbol('=')._s;

	var _ref = alt === 'totalPeople' ? [check_cookies, check_people] : [check_people, check_cookies],
	    _ref2 = _slicedToArray(_ref, 2),
	    first_number = _ref2[0],
	    second_number = _ref2[1];

	test.number(first_number).symbol(';')._n.lines(2).declare('let')._s.id(alt)._s.symbol('=')._s.number(second_number).symbol(';')._n.lines(2).declare('let')._s.id('totalCookies')._s.symbol('=')._s.id('cookiesPerPerson', 'totalPeople', function (used) {
		if (used === 'cookiesPerPerson') expects = 'totalPeople';else if (used === 'totalPeople') expects = 'cookiesPerPerson';
	})._s.symbol('*')._s.id(expects).symbol(';')._n.lines(2).id('console').symbol('.').func('log').symbol('(').id('totalCookies').symbol(')').symbol(';');
};

},{}]},{},[7]);
