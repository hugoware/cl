"use strict";

(function () {

  // returns the instance of this lesson
  function web1Lesson(state, project, utils) {
    var $self = this;
    $self.data = {
      "name": "Basics 1",
      "type": "web",
      "description": "Introduction to building Web Pages",
      "lesson": [{
        "mode": "popup",
        "content": "<p>Let's learn about unordered lists</p><p>Start by opening the <code>index.html</code> file by double clicking on it</p>",
        "waitFor": ["fileOpen(/index.html)"],
        "highlights": ["fileBrowser(/index.html)"],
        "validation": {
          "openFile": "canOpenIndexHtml"
        },
        "type": "slide",
        "speak": ["Let's learn about unordered lists", "Start by opening the index.html file by double clicking on it"]
      }, {
        "mode": "popup",
        "content": "<p>Great! Now that this file is open, let's look at a few things</p>",
        "type": "slide",
        "speak": ["Great! Now that this file is open, let's look at a few things"]
      }, {
        "mode": "popup",
        "content": "<p>These are tags that wrap the unordered list</p>",
        "autoNext": false,
        "waitFor": ["::event(modify-file, verifyHasEnoughListItems)"],
        "zones": {
          "/index.html": {
            "ul_start_tag": "show",
            "ul_end_tag": "show",
            "ul_content": "edit"
          }
        },
        "type": "slide",
        "speak": ["These are tags that wrap the unordered list"]
      }, {
        "mode": "overlay",
        "show": 4,
        "title": "What is the name of the <code>highlighted</code> block of code?",
        "content": "<div class=\"snippet\" type=\"mary_example\" />",
        "hint": "This is a longer example of what a hint might look like. This is going to span for a period longer than the other items on the page.\n",
        "explain": "This is just a <code>summary message</code> to explain the final answer",
        "choices": ["this is <code>correct</code>", "This <em>is</em> incorrect", "This <em>is</em> also wrong", "This ~shouldn't~ work", "This <em>is another</em> mix", "This <em>is</em> failed"],
        "type": "question",
        "speak": ["What is the name of the highlighted block of code?"],
        "explained": "This is just a summary message to explain the final answer"
      }, {
        "mode": "overlay",
        "show": 4,
        "title": "This is another question about what you've learned?",
        "hint": "It's really pretty obvious",
        "explain": "This is just a <code>summary message</code> to explain the final answer",
        "choices": ["this is <code>correct</code>", "This <em>is</em> incorrect", "This <em>is</em> also wrong", "This ~shouldn't~ work", "This <em>is another</em> mix", "This <em>is</em> failed"],
        "type": "question",
        "speak": ["This is another question about what you've learned?"],
        "content": "",
        "explained": "This is just a summary message to explain the final answer"
      }, {
        "checkpoint": true,
        "mode": "popup",
        "content": "<p>That's it! The lesson is finished!</p>",
        "type": "slide",
        "speak": ["That's it! The lesson is finished!"]
      }],
      "definitions": {
        "html": {
          "id": "html",
          "name": "HTML",
          "aka": "Hyper Text Markup Language",
          "define": "This is the full def"
        }
      },
      "snippets": {
        "complex_tag": {
          "content": "<div>\n  <h1>The Title</h1>\n  <p></p>\n</div>",
          "type": "html"
        },
        "html_tag_example": {
          "content": "<h1>This is an example of HTML</h1>",
          "type": "html"
        },
        "mary_example": {
          "content": "function () {\n  console.log('reads the file');\n}",
          "type": "javascript"
        }
      },
      "zones": {
        "/index$html": {
          "ul_start_tag": {
            "start": {
              "row": 9,
              "col": 4
            },
            "end": {
              "row": 9,
              "col": 8
            }
          },
          "ul_end_tag": {
            "start": {
              "row": 13,
              "col": 4
            },
            "end": {
              "row": 13,
              "col": 9
            }
          },
          "ul_content": {
            "start": {
              "row": 10,
              "col": 0
            },
            "end": {
              "row": 12,
              "col": 36
            },
            "line": true
          }
        },
        "complex_tag": {
          "main_content": {
            "start": {
              "row": 1,
              "col": 6
            },
            "end": {
              "row": 1,
              "col": 15
            }
          },
          "paragraph_content": {
            "start": {
              "row": 2,
              "col": 5
            },
            "end": {
              "row": 2,
              "col": 5
            },
            "collapsed": true,
            "content": "The main content!"
          }
        },
        "html_tag_example": {
          "main_content": {
            "start": {
              "row": 0,
              "col": 4
            },
            "end": {
              "row": 0,
              "col": 30
            }
          }
        },
        "mary_example": {
          "read_file": {
            "start": {
              "row": 0,
              "col": 9
            },
            "end": {
              "row": 1,
              "col": 6
            }
          },
          "argument": {
            "start": {
              "row": 1,
              "col": 14
            },
            "end": {
              "row": 1,
              "col": 30
            }
          },
          "function_scope": {
            "start": {
              "row": 0,
              "col": 0
            },
            "end": {
              "row": 2,
              "col": 1
            },
            "line": true
          },
          "function": {
            "start": {
              "row": 0,
              "col": 9
            },
            "end": {
              "row": 0,
              "col": 9
            },
            "collapsed": true,
            "content": "readTheFile"
          },
          "code_block": {
            "start": {
              "row": 1,
              "col": 0
            },
            "end": {
              "row": 1,
              "col": 0
            },
            "collapsed": true,
            "line": true,
            "content": ""
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

    // parses a string of html
    function $html(str, options) {
      return _.isString(str) ? utils.$html((str || '').toString(), options) : utils.$html(str);
    }

    // a general selector function
    function $() {
      return utils.$.apply(utils.$, arguments);
    }

    // shared functions
    function $denyAccess(message, explain) {
      if (_.isFunction($lesson.onDeny)) $lesson.onDeny({ message: message, explain: explain });
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
    function $getZone(file, id, asDom, strict) {
      var html = utils.getZoneContent(file, id);
      return asDom ? $html(html, { strict: strict !== false }) : html;
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

    // attach required scripts

    $define('canOpenIndexHtml', function (file) {
      return $validate({ revertOnError: false }, function () {

        if (file.path !== '/index.html') {
          $denyAccess("Can't Open This File", 'Open the index.html file to continue the lesson');
          $speakMessage("You can't open that file just yet!\n\nMake sure to open `index.html` to continue the lesson.", 'surprised');
          return false;
        }
      });
    });

    // checks that they've added enough list items to a zone
    $define('verifyHasEnoughListItems', { init: true }, function () {

      var requiredItems = 5;
      var minimumLength = 3;

      // tracking item count
      var totalItems = 0;
      var totalListItems = 0;

      // make sure there's a valid zone
      return $validate(function () {

        var zone = $getZone('/index.html', 'ul_content', true);
        if (!zone) {
          $showHint('Fix the HTML errors to continue');
          return false;
        }

        // check how many items are listed
        var hasEmptyItem = void 0;
        var hasShortItem = void 0;

        // check each list item
        zone.children().each(function (index, node) {
          totalItems++;

          // not a list item
          if (!/^li$/i.test(node.tagName)) return;
          totalListItems++;

          // check the contents
          var item = $html(node);
          var text = _.trim(item.text());
          if (text.length === 0) hasEmptyItem = true;
          if (text.length < minimumLength) hasShortItem = true;
        });

        // update the message, if needed
        if (totalListItems < requiredItems) {
          var remaining = requiredItems - totalListItems;
          var plural = remaining > 1 ? 's' : '';
          $showHint("Enter " + remaining + " more list item" + plural);
          return false;
        }

        // check for other conditions
        if (hasEmptyItem) {
          $showHint("Add content to each list item");
          return false;
        }

        if (hasShortItem) {
          $showHint("Add at least " + minimumLength + " characters per list item");
          return false;
        }

        // must only be list items
        if (totalItems !== requiredItems) {
          $showHint("Only use list items in this example");
          return false;
        }

        // remove list items
        zone.children('li').remove();

        // check the remaining text
        var text = _.trim(zone.html());
        if (_.some(text)) {
          $showHint('Only use `li` tags. Do not include any extra text');
          return false;
        }

        // passed validation
        $hideHint();
        $speakMessage('Looks great! You can move onto the next step now');
      });
    });
  }

  // registration function
  window.registerLesson('web_1', web1Lesson);
})();