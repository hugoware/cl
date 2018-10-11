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
        "content": "<p>Like with our previous example, you can see the start and ending tags</p>",
        "zones": {
          "/index.html": {
            "header_start_tag": "show",
            "header_end_tag": "show"
          }
        },
        "type": "slide",
        "speak": ["Like with our previous example, you can see the start and ending tags"]
      }, {
        "mode": "popup",
        "content": "<p>The words inbetween match the content on the page</p>",
        "zones": {
          "/index.html": {
            "header_content": "show",
            "header_start_tag": "hide",
            "header_end_tag": "hide"
          }
        },
        "type": "slide",
        "speak": ["The words inbetween match the content on the page"]
      }, {
        "mode": "popup",
        "content": "<p>Try and change the content to something new</p>",
        "cursor": "header_content",
        "zones": {
          "/index.html": {
            "header_content": "edit"
          }
        },
        "autoNext": false,
        "waitFor": ["::event(modify-file, verifyHeaderContent)"],
        "type": "slide",
        "speak": ["Try and change the content to something new"]
      }, {
        "mode": "popup",
        "content": "<p>Let's try that again with a different type of HTML element. This one will look like a button</p>",
        "zones": {
          "/index.html": {
            "button_content": "edit",
            "header_content": "hide"
          }
        },
        "cursor": "button_content",
        "autoNext": false,
        "waitFor": ["::event(modify-file, verifyHeaderContent)"],
        "type": "slide",
        "speak": ["Let's try that again with a different type of HTML element. This one will look like a button"]
      }, {
        "mode": "popup",
        "content": "<p>Let's try uploading an image and adding it to the page!</p><p>Use the <strong>Upload File</strong> option to go to the next step</p>",
        "actions": ["deselect-items"],
        "zones": {
          "/index.html": {
            "header_content": "lock"
          }
        },
        "validation": {
          "uploadFile": "verifyFileUploadIsImage"
        },
        "waitFor": ["::event(file-uploaded, verifyUploadImageSuccess)"],
        "highlight": ["::ui(upload-file)"],
        "flags": {
          "add": ["upload-file-dialog"]
        },
        "type": "slide",
        "speak": ["Let's try uploading an image and adding it to the page!", "Use the Upload File option to go to the next step"]
      }, {
        "mode": "popup",
        "content": "<p>Great! Let's add an image to the page</p>",
        "zones": {
          "/index.html": {
            "img": "expand"
          }
        },
        "flags": {
          "remove": ["upload-file-dialog"]
        },
        "type": "slide",
        "speak": ["Great! Let's add an image to the page"]
      }, {
        "mode": "popup",
        "content": "<p>Type in the name of the image file - In this case, <code>/%uploadedFileName%</code></p>",
        "zones": {
          "/index.html": {
            "img_path": "edit"
          }
        },
        "flags": {
          "remove": ["upload-file-dialog"]
        },
        "waitFor": ["::editing(verifyImageSrc)"],
        "type": "slide",
        "speak": ["Type in the name of the image file - In this case, /%uploadedFileName%"]
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
          "img_element": {
            "start": {
              "row": 12,
              "col": 1,
              "index": 175
            },
            "collapsed": true,
            "line": true,
            "id": "img_element",
            "content": "\n    <img src=\"\" />"
          },
          "img_src": {
            "content": "",
            "offset": 15,
            "parent": "img_element",
            "id": "img_src"
          },
          "button_content": {
            "id": "button_content",
            "content": "Click Me!",
            "offset": 8,
            "parent": "button_element"
          },
          "header_element": {
            "start": {
              "row": 9,
              "col": 5,
              "index": 151
            },
            "end": {
              "row": 9,
              "col": 22,
              "index": 168
            },
            "id": "header_element"
          },
          "header_content": {
            "start": {
              "row": 9,
              "col": 9,
              "index": 155
            },
            "end": {
              "row": 9,
              "col": 17,
              "index": 163
            },
            "id": "header_content"
          },
          "header_start_tag": {
            "start": {
              "row": 9,
              "col": 5,
              "index": 151
            },
            "end": {
              "row": 9,
              "col": 9,
              "index": 155
            },
            "id": "header_start_tag"
          },
          "header_end_tag": {
            "start": {
              "row": 9,
              "col": 17,
              "index": 163
            },
            "end": {
              "row": 9,
              "col": 22,
              "index": 168
            },
            "id": "header_end_tag"
          },
          "button_element": {
            "start": {
              "row": 11,
              "col": 5,
              "index": 174
            },
            "collapsed": true,
            "id": "button_element",
            "content": "<button></button>"
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

    $define('verifyHeaderContent', { init: true }, function () {
      return $validate(function () {

        // get the current entered value
        var content = $getZone('/index.html', 'header_content');
        content = _.trim(content);

        // make sure it's okay
        if (/^welcome/i.test(content)) {
          $showHint('Change the greeting to something different');
          return false;
        }

        if (content.length < 5) {
          $showHint('Enter a longer greeting');
          return false;
        }

        $hideHint();
        $speakMessage('Looks great!');
      });
    });

    $define('verifyImageSrc', { init: true }, function () {
      return $validate(function () {

        // get the current entered value
        var content = $getZone('/index.html', 'image_path');
        content = _.trim(content);

        // make sure it's okay
        if (content !== $state.uploadedFileName) {
          $showHint('Enter in the name of the image you uploaded');
          return false;
        }

        $hideHint();
        $speakMessage('Perfect! You can see that the image is showing!');
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
        $state.uploadedFileName = $self.waitingForFile;
        delete $self.waitingForFile;
      });
    });
  }

  // registration function
  window.registerLesson('demo', demoLesson);
})();