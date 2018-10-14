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
        "content": "<p>The content in the middle are the words that will be displayed on the screen.</p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"content\"/><p>In this example, the screen would display <strong>\"Hello, World\"</strong></p>",
        "type": "slide",
        "speak": ["The content in the middle are the words that will be displayed on the screen.", "In this example, the screen would display \"Hello, World\""]
      }, {
        "mode": "popup",
        "content": "<p>Let's make some changes to an HTML page. Start by opening the <code>index.html</code> file by <span class=\"define\" type=\"double_clicking\" >double clicking</span> on it.</p>",
        "waitFor": ["::fileOpen(/index.html)"],
        "highlight": ["::fileBrowser(/index.html)"],
        "validation": {
          "openFile": "::allowIfFile(/index.html, open-file)"
        },
        "type": "slide",
        "speak": ["Let's make some changes to an HTML page. Start by opening the index.html file by double clicking on it."]
      }, {
        "mode": "popup",
        "content": "<p>This is an <span class=\"define\" type=\"html_file\" >HTML File</span>. The instructions you see on this page are used to create the <span class=\"define\" type=\"output\" >output</span> in the <span class=\"define\" type=\"preview_area\" >Preview Area</span>.</p>",
        "type": "slide",
        "speak": ["This is an HTML File. The instructions you see on this page are used to create the output in the Preview Area."]
      }, {
        "mode": "popup",
        "content": "<p>Like with the example at the start of the lesson, you can see that an <span class=\"define\" type=\"html_element\" >HTML Element</span> is made up of start and ending tags.</p>",
        "zones": {
          "/index.html": {
            "header_start_tag": "show",
            "header_end_tag": "show"
          }
        },
        "type": "slide",
        "speak": ["Like with the example at the start of the lesson, you can see that an HTML Element is made up of start and ending tags."]
      }, {
        "mode": "popup",
        "content": "<p>The words between the two tags are the content, which you can see displayed in the <span class=\"define\" type=\"preview_area\" >Preview Area</span>.</p>",
        "zones": {
          "/index.html": {
            "header_content": "show",
            "header_start_tag": "hide",
            "header_end_tag": "hide"
          }
        },
        "type": "slide",
        "speak": ["The words between the two tags are the content, which you can see displayed in the Preview Area."]
      }, {
        "mode": "popup",
        "content": "<p>Try to change the content of this tag to a different greeting. For example: <code>Hello, World!</code>.</p>",
        "cursor": "header_content",
        "zones": {
          "/index.html": {
            "header_content": "edit"
          }
        },
        "autoNext": false,
        "waitFor": ["::event(modify-file, verifyHeaderContent)"],
        "type": "slide",
        "speak": ["Try to change the content of this tag to a different greeting. For example: Hello, World!."]
      }, {
        "mode": "popup",
        "content": "<p>Let's try that again with a different type of <span class=\"define\" type=\"html_element\" >HTML Element</span>. This element is a <strong>paragraph</strong> which is written using <code>p</code> tags.</p>",
        "zones": {
          "/index.html": {
            "paragraph_element": "show",
            "header_content": "hide"
          }
        },
        "cursor": "paragraph_content",
        "type": "slide",
        "speak": ["Let's try that again with a different type of HTML Element. This element is a paragraph which is written using p tags."]
      }, {
        "mode": "popup",
        "content": "<p>You'll notice that even though the text appears on multiple lines, it shows up as a single line in the <span class=\"define\" type=\"preview_area\" >Preview Area</span>.</p>",
        "zones": {
          "/index.html": {
            "paragraph_element": "hide",
            "paragraph_content": "show"
          }
        },
        "type": "slide",
        "speak": ["You'll notice that even though the text appears on multiple lines, it shows up as a single line in the Preview Area."]
      }, {
        "mode": "popup",
        "content": "<p>Try and change this paragraph to hold several more lines of text. You can make it say whatever you want.</p>",
        "zones": {
          "/index.html": {
            "paragraph_content": "edit"
          }
        },
        "cursor": {
          "zone": "paragraph_content",
          "at": "end"
        },
        "autoNext": false,
        "waitFor": ["::event(modify-file, verifyParagraphContent)"],
        "type": "slide",
        "speak": ["Try and change this paragraph to hold several more lines of text. You can make it say whatever you want."]
      }, {
        "mode": "popup",
        "content": "<p>So far, all of the <span class=\"define\" type=\"html_element\" >HTML Elements</span> we've learned about have had a start and ending tag. However, some elements don't have text content. For example, an <strong>image file</strong>.</p>",
        "zones": {
          "/index.html": {
            "paragraph_content": "hide"
          }
        },
        "type": "slide",
        "speak": ["So far, all of the HTML Elements we've learned about have had a start and ending tag. However, some elements don't have text content. For example, an image file."]
      }, {
        "mode": "popup",
        "content": "<p>Let's start by uploading an image that we can add to this page.</p><p>Click the <strong>Upload File</strong> option and then drag an image file into the upload area.</p>",
        "actions": ["deselect-items"],
        "zones": {
          "/index.html": {
            "paragraph_content": "hide"
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
        "speak": ["Let's start by uploading an image that we can add to this page.", "Click the Upload File option and then drag an image file into the upload area."]
      }, {
        "mode": "popup",
        "content": "<p>Now let's add an image to this page. This is done using the <code>img</code> <span class=\"define\" type=\"html_element\" >HTML Element</span>.</p>",
        "zones": {
          "/index.html": {
            "img_element": "expand"
          }
        },
        "flags": {
          "remove": ["upload-file-dialog"]
        },
        "actions": ["hide-all-dialogs"],
        "type": "slide",
        "speak": ["Now let's add an image to this page. This is done using the img HTML Element."]
      }, {
        "mode": "popup",
        "content": "<p>Unlike the other <span class=\"define\" type=\"html_element\" >HTML Elements</span>, this element doesn't have content that goes between tags, but instead uses an <span class=\"define\" type=\"html_attribute\" >HTML Attribute</span>.</p>",
        "type": "slide",
        "speak": ["Unlike the other HTML Elements, this element doesn't have content that goes between tags, but instead uses an HTML Attribute."]
      }, {
        "mode": "popup",
        "content": "<p>Let's set the source of the image element to be the file that you uploaded. In this case, <code>/%uploadedFileName%</code>.</p>",
        "zones": {
          "/index.html": {
            "img_src": "edit"
          }
        },
        "waitFor": ["::event(modify-file, verifyImageSrc)"],
        "autoNext": false,
        "type": "slide",
        "speak": ["Let's set the source of the image element to be the file that you uploaded. In this case, /%uploadedFileName%."]
      }, {
        "mode": "overlay",
        "title": "HTML Review",
        "content": "<p>Let's review what we've learned so far!</p>",
        "type": "slide",
        "speak": ["Let's review what we've learned so far!"]
      }, {
        "mode": "overlay",
        "show": 4,
        "title": "The following code is an example of an… ?",
        "content": "<div class=\"snippet\" type=\"html_tag_example\" />",
        "hint": "This is a key element to creating web pages!\n",
        "explain": "An HTML Element is made up of HTML Tags. Sometimes an element has a start and end tag, and sometimes it only has a single tag.",
        "choices": ["… HTML Element", "… HTML Nugget", "… HTML Widget", "… HTML Command"],
        "type": "question",
        "speak": ["The following code is an example of an… ?"],
        "explained": "An HTML Element is made up of HTML Tags. Sometimes an element has a start and end tag, and sometimes it only has a single tag."
      }, {
        "mode": "popup",
        "emotion": "happy",
        "content": "<p>Well done! You've just created your first web page!</p><p>There's a lot more to learn when it comes to creating web pages, but you're off to a great start!</p>",
        "zones": {
          "/index.html": {
            "img_src": "lock"
          }
        },
        "type": "slide",
        "speak": ["Well done! You've just created your first web page!", "There's a lot more to learn when it comes to creating web pages, but you're off to a great start!"]
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
        },
        "double_clicking": {
          "id": "double_clicking",
          "name": "Double Click",
          "define": "Pressing the mouse, or track pad, twice quickly. For touch screens, it&apos;s tapping the screen twice quickly."
        },
        "html_file": {
          "id": "html_file",
          "name": "HTML File",
          "define": "A bunch of instructions"
        },
        "output": {
          "id": "output",
          "name": "Output",
          "define": "The results from a computer program based on input"
        },
        "preview_area": {
          "id": "preview_area",
          "name": "Preview Area",
          "define": "The right side of the screen that shows the current output of the project being worked on"
        },
        "html_attribute": {
          "id": "html_attribute",
          "name": "HTML Attribute",
          "define": "Something different for html stuff"
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
            }
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
            }
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
            }
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
            }
          },
          "img_src": {
            "content": "",
            "offset": 15,
            "parent": "img_element"
          },
          "img_element": {
            "start": {
              "row": 12,
              "col": 1,
              "index": 171
            },
            "collapsed": true,
            "line": true,
            "content": "\n    <img src=\"\" />"
          },
          "paragraph_element": {
            "start": {
              "row": 11,
              "col": 1,
              "index": 170
            },
            "collapsed": true,
            "line": true,
            "content": "    <p>\n\n    </p>"
          },
          "paragraph_content": {
            "line": true,
            "multiline": true,
            "content": "      This is a paragraph element\n      that can be spread out over\n      multiple lines",
            "offset": 8,
            "parent": "paragraph_element"
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

      var html = utils.getZoneContent(file, id);
      if (options.trim !== false) html = _.trim(html);
      return options.toDom || options.asDom ? $html(html) : html;
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
          result = options.validate();
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

    $validator('verifyHeaderContent', {

      init: true,
      delay: 1000,
      revertOnError: true,

      validate: function validate() {

        // get the current entered value
        var content = $getZone('/index.html', 'header_content');
        content = _.trim(content);

        // make sure it's okay
        var len = Math.min(7, content.length);
        var current = content.substr(0, len).toLowerCase();
        var base = 'welcome'.substr(0, len).toLowerCase();
        if (current === base) return 'Change the greeting to something different';

        if (content.length < 5) return 'Enter a longer greeting';

        // no need for hint
        $hideHint();
      },

      fail: function fail(reason) {
        $showHint(reason);
      },

      success: function success() {
        $hideHint();
        $speakMessage("Looks great! When you're finished making changes click **Next** to continue.", 'happy');
      }

    });

    $validator('verifyImageSrc', {
      init: true,
      delay: 300,
      hideHintOnSuccess: true,

      validate: function validate() {

        // get the current entered value
        var content = $getZone('/index.html', 'img_src', { trim: false });

        // make sure it's okay
        if (content !== "/" + $state.uploadedFileName) return "Enter the image path `" + $state.uploadedFileName + "`";
      },

      fail: function fail(reason) {
        $showHint(reason);
      },

      success: function success() {
        $hideHint();
        $speakMessage('Great! You should see your image displayed in the preview now!', 'happy');
      }

    });

    $validator('verifyParagraphContent', {

      init: true,
      delay: 1000,
      revertOnError: true,

      hideHintOnSuccess: true,

      validate: function validate() {
        var REQUIRED_LINE_COUNT = 5;

        // container for hints
        var hint = [];

        // get the current entered value
        var content = $getZone('/index.html', 'paragraph_element', { asDom: true });

        // make sure they're only using text
        if (!content) {
          $hideHint();
          return $noop;
        }

        // make sure they're only using text
        var children = content.children('*');
        if (children.length !== 1) return 'Only use text lines in this example';

        // check for of the line data
        var lines = _.trim(content.text()).split(/\n/g);
        var tooShort = [];
        _.each(lines, function (line, i) {
          if (_.trim(line).length < 5) tooShort.push(i + 1);
        });

        // there was some problems with the lines
        if (tooShort.length > 0) hint.push("Add more characters to " + $plural(tooShort.length, 'line') + " " + $oxford(tooShort, 'and'));

        // make sure there are enough lines
        var more = REQUIRED_LINE_COUNT - lines.length;
        if (more > 0) hint.push("Add " + more + " more " + $plural(more, 'line'));

        // if there's any messages, return them
        if (hint.length !== 0) return hint.join('\n\n');
      },

      fail: function fail(reason) {
        $showHint(reason);
      },

      success: function success() {
        $hideHint();
        $speakMessage("Looks great! When you're finished making changes click **Next** to continue.", 'happy');
      }

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