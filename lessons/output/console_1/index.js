"use strict";

(function () {

  // returns the instance of this lesson
  function console1Lesson(state, project, utils) {
    var $self = this;
    $self.data = {
      "name": "CodeLab Console Demo",
      "type": "console",
      "description": "An Introduction to the CodeLab Learning System",
      "lesson": [{
        "mode": "popup",
        "content": "<p>Let's start working on code examples - open the file <code>main.ts</code></p>",
        "waitFor": ["::fileOpen(/main.ts)"],
        "highlight": ["::fileBrowser(/main.ts)"],
        "validation": {
          "openFile": "::allowIfFile(/main.ts, open-file)"
        },
        "type": "slide",
        "speak": ["Let's start working on code examples - open the file main.ts"]
      }, {
        "mode": "popup",
        "content": "<p>create the object</p><div class=\"snippet\" type=\"declare_variables\" />",
        "runValidation": "verifyObject",
        "events": ["modify-file, verifyObjectSyntax, {preview:true}"],
        "type": "slide",
        "speak": ["create the object"]
      }],
      "definitions": {},
      "snippets": {
        "declare_variables": {
          "content": "const a = 300;\nconst b = false;\nconst c = 'hello';",
          "type": "javascript"
        }
      },
      "zones": {
        "declare_variables": {
          "all": {
            "start": {
              "row": 1,
              "col": 1
            },
            "end": {
              "row": 2,
              "col": 17
            },
            "line": true
          }
        }
      }
    };

    // share imported utils
    var _ = utils._;

    // shared variables
    var $lesson = $self;
    var $project = project;
    var $state = state;

    // access to code syntax and content validator
    var $codeValidator = utils.$validate;

    // parses a string of html
    function $html(str, options) {
      return _.isString(str) ? utils.$html((str || '').toString(), options) : utils.$html(str);
    }

    // a general selector function
    function $() {
      return utils.$.apply(utils.$, arguments);
    }

    // performs the oxford comma
    function $oxford(items, conjunction) {
      var total = items.length;

      // determine the best
      if (total === 1) return items.join('');else if (total == 2) return items.join(" " + conjunction + " ");

      // return the result
      else {
          var last = items.pop();
          return items.join(', ') + ", " + conjunction + " " + last;
        }
    }

    // pluralizes a word
    function $plural(count, single, plural, none) {
      var delimeter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '@';

      var value = Math.abs(count);
      var message = value === 1 ? single : value > 1 ? plural ? plural : single + "s" : none || plural;
      return message.replace(delimeter, count);
    }

    // shared functions
    function $denyAccess(message, explain) {
      if (_.isFunction($lesson.onDeny)) $lesson.onDeny({ message: message, explain: explain });
    }

    // shared functions
    function $approveSlide(message, emotion) {
      if (_.isFunction($lesson.onApprove)) $lesson.onApprove({ message: message, emotion: emotion });
    }

    // speaks a message using the assistant
    function $speakMessage(message, emotion) {
      if (_.isFunction($lesson.onSpeak)) $lesson.onSpeak({ message: message, emotion: emotion, isOverride: true });
    }

    // returns the message to the prior content
    function $revertMessage() {
      if (_.isFunction($lesson.onRevert)) $lesson.onRevert();
    }

    // handles displaying a hint
    function $showHint(str, options) {
      if (!_.isFunction($lesson.onHint)) return;
      options = options || {};
      options.message = str;
      $lesson.onHint(options);
    }

    // handles hiding hints
    function $hideHint() {
      if (_.isFunction($lesson.onHint)) $lesson.onHint(null);
    }

    // runs a series of actions until one
    // of them returns false
    function $validate() {
      var actions = [].slice.call(arguments);

      // check for extra options
      var options = {};
      if (!_.isFunction(actions[0])) options = actions.shift();

      // run each action
      for (var i = 0, total = actions.length; i < total; i++) {
        var action = actions[i];

        // perform each action
        try {
          if (action() === false) throw 'validation failed';
        }

        // for errors, just fail
        catch (err) {
          if (options.revertOnError !== false) $revertMessage();
          return false;
        }
      }

      // was successful
      return true;
    }

    // gets a zone
    function $getZone(file, id) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var code = utils.getZoneContent(file, id);
      if (options.trim !== false) code = _.trim(code);
      return options.toDom || options.asDom ? $html(code) : code;
    }

    // gets a zone
    function $getFile(file) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var code = utils.getFileContent(file, options);
      if (options.trim !== false) code = _.trim(code);
      return options.toDom || options.asDom ? $html(code) : code;
    }

    // 
    var $noop = {};

    // creates a validator function
    function $validator(key, options) {

      // create the primary validation function
      var handler = function handler() {

        // execute the validator
        var result = void 0;
        var exception = void 0;
        try {
          result = options.validate.apply(options, arguments);
        }
        // failed to validate
        catch (err) {
          exception = true;
          result = err;
        }

        // validation passed
        if (_.isNil(result)) {
          if (options.hideHintOnSuccess) $hideHint();
          return true;
        }

        // if there was an error
        try {

          // handle reverting
          if (options.revertOnError) $revertMessage();

          // doesn't want to do anything with validation
          if (result === $noop) return false;

          // check for messages
          if (exception && options.error) {
            console.warn('validation error:', key, ex);
            options.error(result);
          }

          // handle failure
          else if (_.isString(result) && options.fail) options.fail(result);
        }
        // extreme case
        catch (ex) {
          console.warn('validation error:', key, ex);
          $hideHint();
          $revertMessage();
        } finally {
          return false;
        }
      };

      // save the options
      $self[key] = _.assign(handler, options);
    }

    // append each action
    function $define(name, options, action) {

      // no options were provided
      if (_.isFunction(options)) {
        action = options;
        options = null;
      }

      // save the actions
      _.assign(action, options);
      $self[name] = action;
    }

    // share all of the utility methods
    $self.$html = $html;
    $self.$ = $;
    $self.$denyAccess = $denyAccess;
    $self.$approveSlide = $approveSlide;
    $self.$speakMessage = $speakMessage;
    $self.$revertMessage = $revertMessage;
    $self.$showHint = $showHint;
    $self.$hideHint = $hideHint;
    $self.$validate = $validate;
    $self.$getZone = $getZone;
    $self.$getFile = $getFile;
    $self.$codeValidator = $codeValidator;

    // attach required scripts

    // make sure code is in a valid format
    $define('verifyObjectSyntax', function () {

      var code = $getFile('/main.ts', { trim: false });
      var error = $codeValidator(code, function (test) {
        return test.declare('const').id('a').symbol('=').num(300).symbol(';').newline().declare('const').id('b').symbol('=').bool(false).symbol(';').newline().declare('const').id('c').symbol('=').str('hello').symbol(';').end();
      });

      // check for errors
      if (error) {
        $showHint(error.error, error);
        return error;
      } else {
        $hideHint();
      }
    });

    // checks the code execution
    $define('verifyObject', function (_ref) {
      var runner = _ref.runner,
          code = _ref.code;


      // if not correct syntax, 
      var error = $self.verifyObjectSyntax();
      if (error) {
        $speakMessage('You still have some syntax errors to fix before running this code');
        return;
      }

      // execute and test the code
      runner.run(code, {

        onEnd: function onEnd() {

          var a = runner.interpreter.get('a');
          if (a !== 300) {
            if (_.isNil(a)) $speakMessage('You need to declare a variable `"a"` with a number value of `300`');else if (!_.isNumber(a)) $speakMessage('The variable `"a"` should be the number `300`');else $speakMessage('The variable `"a"` should be `300`, but the variable you declared equals to `' + a + '`', 'surprised');
            return;
          }

          var b = runner.interpreter.get('b');
          if (b !== false) {
            if (_.isNil(b)) $speakMessage('You need to declare a variable `"b"` with a boolean value of `false`');else if (!_.isBoolean(b)) $speakMessage('The variable `"b"` should be the boolean `false`');else $speakMessage('The variable `"b"` should be `false`, but the variable you declared equals to `' + b + '`', 'surprised');
            return;
          }

          var c = runner.interpreter.get('c');
          if (c !== 'hello') {
            if (_.isNil(c)) $speakMessage('You need to declare a variable `"c"` with a string value of `hello`');else if (!_.isString(c)) $speakMessage('The variable `"c"` should be the string `hello`');else $speakMessage('The variable `"c"` should be `hello`, but the variable you declared equals to `' + c + '`', 'surprised');
            return;
          }

          // console.log('finished');
          // console.log(runner);
          // 
          $speakMessage('looks great!');
        }

      });
    });
  }

  // registration function
  window.registerLesson('console_1', console1Lesson);
})();