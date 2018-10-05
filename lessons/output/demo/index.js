"use strict";

(function () {

  // returns the instance of this lesson
  function demoLesson(state, project, utils) {
    var $self = this;
    $self.data = {
      "name": "CodeLab Demo",
      "type": "web",
      "description": "An Introduction to the CodeLab Learning System",
      "lesson": [{
        "mode": "overlay",
        "title": "An Introduction to HTML",
        "content": "<p>This brief tutorial will give you an introduction to using HTML to create web pages.</p>",
        "type": "slide",
        "speak": ["This brief tutorial will give you an introduction to using HTML to create web pages."]
      }, {
        "title": "An Introduction to HTML",
        "mode": "overlay",
        "content": "<p>This is an <span class=\"define\" type=\"html_element\" >HTML Element</span>. This is the most basic of HTML instructions.</p><div class=\"snippet\" type=\"html_tag_example\" />",
        "type": "slide",
        "speak": ["This is an HTML Element. This is the most basic of HTML instructions."]
      }, {
        "title": "An Introduction to HTML",
        "mode": "overlay",
        "content": "<p>The two highlighted blocks of code are known as <span class=\"define\" type=\"html_tag\" >HTML Tags</span></p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"start_tag end_tag\"/><p>When these instructions are viewed in a web browser, it appears as a large, bold header.</p>",
        "type": "slide",
        "speak": ["The two highlighted blocks of code are known as HTML Tags", "When these instructions are viewed in a web browser, it appears as a large, bold header."]
      }, {
        "title": "An Introduction to HTML",
        "mode": "overlay",
        "content": "<p>The content in the middle is the words that will be displayed on the screen.</p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"content\"/><p>In this example, the screen would display <strong>Hello, World</strong></p>",
        "type": "slide",
        "speak": ["The content in the middle is the words that will be displayed on the screen.", "In this example, the screen would display Hello, World"]
      }, {
        "mode": "popup",
        "content": "<p>Let's make some changes to an HTML page. Let's start by opening the <code>index.html</code> page in the File Browser.</p>",
        "waitFor": ["::fileOpen(/index.html)"],
        "highlight": ["::fileBrowser(/index.html)"],
        "validation": {
          "openFile": "::allowIfFile(/index.html, open-file)"
        },
        "type": "slide",
        "speak": ["Let's make some changes to an HTML page. Let's start by opening the index.html page in the File Browser."]
      }, {
        "mode": "popup",
        "content": "<p>Great! Try changing the header on this page to be a different greeting.</p>",
        "zones": {
          "/index.html": {
            "header_content": "edit"
          }
        },
        "autoNext": false,
        "waitFor": ["::event(modify-file, verifyHeaderContent)"],
        "type": "slide",
        "speak": ["Great! Try changing the header on this page to be a different greeting."]
      }],
      "definitions": {
        "html_element": {
          "id": "html_element",
          "name": "HTML Element",
          "define": "This is about HTML elements"
        },
        "html_tag": {
          "id": "html_tag",
          "name": "HTML Tag",
          "define": "This is about HTML elements - this is <code>&lt;</code> or <code>&gt;</code>"
        }
      },
      "snippets": {
        "html_img_example": {
          "content": "",
          "type": "html"
        },
        "html_tag_example": {
          "content": "<h1>Hello, World!</h1>",
          "type": "html"
        }
      },
      "zones": {
        "html_tag_example": {
          "start_tag": {
            "start": {
              "row": 0,
              "col": 0
            },
            "end": {
              "row": 0,
              "col": 4
            }
          },
          "end_tag": {
            "start": {
              "row": 0,
              "col": 17
            },
            "end": {
              "row": 0,
              "col": 22
            }
          },
          "content": {
            "start": {
              "row": 0,
              "col": 4
            },
            "end": {
              "row": 0,
              "col": 17
            }
          },
          "entire_tag": {
            "start": {
              "row": 0,
              "col": 0
            },
            "end": {
              "row": 0,
              "col": 22
            }
          }
        },
        "/index$html": {
          "header_content": {
            "start": {
              "row": 8,
              "col": 8
            },
            "end": {
              "row": 8,
              "col": 16
            }
          },
          "paragraph": {
            "start": {
              "row": 10,
              "col": 4
            },
            "end": {
              "row": 10,
              "col": 4
            },
            "collapsed": true,
            "content": "<p></p>"
          },
          "img_path": {
            "start": {
              "row": 12,
              "col": 0
            },
            "end": {
              "row": 12,
              "col": 0
            }
          },
          "img": {
            "start": {
              "row": 12,
              "col": 4
            },
            "end": {
              "row": 12,
              "col": 4
            },
            "collapsed": true,
            "content": "<img src=\"\" />"
          },
          "paragraph_content": {
            "start": {
              "row": 10,
              "col": 0
            },
            "end": {
              "row": 10,
              "col": 0
            }
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

    // share all of the utility methods
    $self.$html = $html;
    $self.$ = $;
    $self.$denyAccess = $denyAccess;
    $self.$speakMessage = $speakMessage;
    $self.$revertMessage = $revertMessage;
    $self.$showHint = $showHint;
    $self.$hideHint = $hideHint;
    $self.$validate = $validate;
    $self.$getZone = $getZone;

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
    $define('verifyFileUploadIsImage', function (data) {
      return $validate({ revertOnError: false }, function () {
        var files = data.files;

        // didn't work for some reason

        if (!_.isArray(files)) return false;

        // make sure it's valid
        if (files.length !== 1) {
          $speakMessage("For now, just upload a single image file to continue");
          return false;
        }

        // get the data
        var file = files[0] || {};

        // make sure it's an image
        if (!/(png|jpe?g|gif)$/.test(file.name)) {
          $speakMessage("Only upload image files at this time. Try `png`, `jpg` or `gif` files");
          return false;
        }

        // wait for the file to upload
        $self.waitingForFile = file.name;
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

    // checks that they've added enough list items to a zone
    $define('verifyUploadImageSuccess', function (result) {
      return $validate({ revertOnError: false }, function () {

        // make sure it's for the correct file
        if ($self.waitingForFile !== result.file.name) return false;

        // failed to upload for some reason
        if (!result.success) {
          $speakMessage("Seems like something went wrong uploading your file. Go ahead and try again", 'sad');
          return false;
        }

        // difficult to type name
        if (/ /g.test($self.waitingForFile)) $speakMessage("It's sometimes difficult to work with a file name that has spaces in it. Consider uploading a new file without spaces in the name.", 'sad');

        // very long name
        else if (_.size($self.waitingForFile) > 20) $speakMessage("That's a fairly long file name. You might consider uploading an image with a shorter name to make it easier to type in.", 'sad');

          // looks good
          else $speakMessage("Perfect! Let's add this image to our web page!", 'happy');

        // it worked, so let's move on
        $state.imageName = $self.waitingForFile;
        delete $self.waitingForFile;
      });
    });
  }

  // registration function
  window.registerLesson('demo', demoLesson);
})();