"use strict";

(function () {

  // returns the instance of this lesson
  function console1Lesson(state, project, utils) {
    var $self = this;
    $self.data = {
      "name": "Console 1",
      "type": "code",
      "description": "An Introduction to the CodeLab Learning System 1",
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
        "mode": "overlay",
        "content": "<p>This is the end of the lesson</p>",
        "type": "slide",
        "speak": ["This is the end of the lesson"]
      }],
      "definitions": {},
      "snippets": {
        "declare_variables": {
          "content": "const a = 300;\nconst b = false;\nconst c = 'hello';",
          "type": "javascript"
        },
        "log_variables": {
          "content": "console.log(a);\nconsole.log(b);\nconsole.log(c);",
          "type": "javascript"
        }
      },
      "zones": {
        "log_variables": {
          "all": {}
        },
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
    var $validateCode = utils.$validate;

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
    $self.$validateCode = $validateCode;

    // create some common messages
    _.assign($speakMessage, {
      MATCH_EXAMPLE: function MATCH_EXAMPLE() {
        return $speakMessage("Almost there! The code ran successfully, but you need to finish matching the example!", 'happy');
      },
      EXECUTION_ERROR: function EXECUTION_ERROR() {
        return $speakMessage('Oops! It appears there was an error running that code!', 'surprised');
      }
    });

    // attach required scripts

    // checks the logged values
    var syntax_verifyLog = function syntax_verifyLog(test) {
      var variableOrder = [];

      // adds a result value
      test.includeResult({ variableOrder: variableOrder });

      // checks if a variable has already been logged
      function checkIfVariableUsed(id) {
        if (_.includes(variableOrder, id)) {
          var allowed = _.difference(['a', 'b', 'c'], variableOrder);
          var vars = _.map(allowed, function (id) {
            return "`" + id + "`";
          });
          var phrase = $oxford(vars, 'or');
          return "Expected " + phrase;
        }

        variableOrder.push(id);
      }

      // test for the required logs
      test.newline().id('console').symbol('.').id('log').symbol('(').id('a', 'b', 'c', checkIfVariableUsed).symbol(')').symbol(';').newline().id('console').symbol('.').id('log').symbol('(').id('a', 'b', 'c', checkIfVariableUsed).symbol(')').symbol(';').newline().id('console').symbol('.').id('log').symbol('(').id('a', 'b', 'c', checkIfVariableUsed).symbol(')').symbol(';');
    };

    // make sure code is in a valid format
    $define('verifyLogSyntax', function () {
      var code = $getFile('/main.ts', { trim: false });
      var result = $validateCode(code, syntax_verifyObject, syntax_verifyLog);

      // check for errors
      if (result.error) $showHint(result.error.message, result.error);else $hideHint();
      return result;
    });

    // checks the code execution
    $define('verifyLog', function (_ref) {
      var runner = _ref.runner,
          code = _ref.code,
          onSuccess = _ref.onSuccess;


      // execute and test the code
      runner.run(code, {

        onError: $speakMessage.EXECUTION_ERROR,

        onEnd: function onEnd() {
          var hasA = void 0,
              hasB = void 0,
              hasC = void 0,
              hasMismatch = void 0;

          // check each variable
          _.each(['a', 'b', 'c'], function (name, i) {

            // stop if there's already an error
            if (hasMismatch) return;

            // compare the values
            var logged = runner.getOutput(i + 1, 0);
            if (name === 'a') {
              hasA = true;
              if (logged !== 300) {
                hasMismatch = true;
                $speakMessage('Expected `a` to be logged as `300`', 'sad');
              }
            } else if (name === 'b') {
              hasB = true;
              if (logged !== false) {
                hasMismatch = true;
                $speakMessage('Expected `b` to be logged as `false`', 'sad');
              }
            } else if (name === 'c') {
              hasC = true;
              if (logged !== 'hello') {
                hasMismatch = true;
                $speakMessage('Expected `c` to be logged as `hello`', 'sad');
              }
            }
          });

          // there was a result error
          if (hasMismatch) return;

          // make sure all variables were used
          if (!(hasA && hasB && hasC)) return $speakMessage("Seems like you're missing a few variables", 'sad');

          // check the syntax
          var syntax = $self.verifyLogSyntax();
          if (syntax.error) return $speakMessage.MATCH_EXAMPLE();

          // success
          $speakMessage('That looks great! You can see your values printed in the output area on the right');
          onSuccess();
        }

      });
    });

    // require variables
    var syntax_verifyObject = function syntax_verifyObject(test) {
      return test.declare('const').id('a').symbol('=').num(300).symbol(';').newline().declare('const').id('b').symbol('=').bool(false).symbol(';').newline().declare('const').id('c').symbol('=').str('hello').symbol(';');
    };

    // make sure code is in a valid format
    $define('verifyObjectSyntax', function () {
      var code = $getFile('/main.ts', { trim: false });
      var result = $validateCode(code, syntax_verifyObject);

      // check for errors
      if (result.error) $showHint(result.error.message, result.error);else $hideHint();
      return result;
    });

    // checks the code execution
    $define('verifyObject', function (_ref2) {
      var runner = _ref2.runner,
          code = _ref2.code,
          onSuccess = _ref2.onSuccess;


      // execute and test the code
      runner.run(code, {
        onError: $speakMessage.EXECUTION_ERROR,

        onEnd: function onEnd() {

          var a = runner.interpreter.get('a');
          if (a !== 300) {
            if (_.isNil(a)) $speakMessage('You need to declare a variable `a` with a number value of `300`');else if (!_.isNumber(a)) $speakMessage('The variable `a` should be the number `300`');else $speakMessage('The variable `a` should be `300`, but the variable you declared equals to `' + a + '`', 'surprised');
            return;
          }

          var b = runner.interpreter.get('b');
          if (b !== false) {
            if (_.isNil(b)) $speakMessage('You need to declare a variable `b` with a boolean value of `false`');else if (!_.isBoolean(b)) $speakMessage('The variable `b` should be the boolean `false`');else $speakMessage('The variable `b` should be `false`, but the variable you declared equals to `' + b + '`', 'surprised');
            return;
          }

          var c = runner.interpreter.get('c');
          if (c !== 'hello') {
            if (_.isNil(c)) $speakMessage('You need to declare a variable `c` with a string value of `hello`');else if (!_.isString(c)) $speakMessage('The variable `c` should be the string `hello`');else $speakMessage('The variable `c` should be `hello`, but the variable you declared equals to `' + c + '`', 'surprised');
            return;
          }

          // since the values are all correct, we also should check
          // that the code is entered correctly
          var syntax = $self.verifyObjectSyntax();
          if (syntax.error) return $speakMessage.MATCH_EXAMPLE();

          // notify the success
          $speakMessage('looks great!');
          onSuccess();
        }

      });
    });
  }

  // registration function
  window.registerLesson('console_1', console1Lesson);
})();