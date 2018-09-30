"use strict";

(function () {

  // returns the instance of this lesson
  function web1Lesson(state, project, utils) {
    var _this = this;

    this.data = { "name": "Basics 1", "type": "web", "description": "Introduction to building Web Pages", "lesson": [{ "mode": "popup", "content": "<p>Let's learn about unordered lists</p><p>Start by opening the <code>index.html</code> file by double clicking on it</p>", "waitFor": ["fileOpen(/index.html)"], "highlights": ["fileBrowser(/index.html)"], "validation": { "openFile": "allowOpenIndexHtml" }, "type": "slide", "speak": ["Let's learn about unordered lists", "Start by opening the index.html file by double clicking on it"] }, { "mode": "popup", "content": "<p>Great! Now that this file is open, let's look at a few things</p>", "type": "slide", "speak": ["Great! Now that this file is open, let's look at a few things"] }, { "mode": "popup", "content": "<p>These are tags that wrap the unordered list</p>", "autoNext": false, "waitFor": ["::event(modify-file, verifyHasMultipleListItems)"], "zones": { "/index.html": { "ul_start_tag": "show", "ul_end_tag": "show", "ul_content": "edit" } }, "type": "slide", "speak": ["These are tags that wrap the unordered list"] }, { "mode": "popup", "content": "<p>This is the contents that go inside</p>", "zones": { "/index.html": { "ul_start_tag": "edit", "ul_end_tag": "edit", "ul_content": "expand" } }, "type": "slide", "speak": ["This is the contents that go inside"] }, { "mode": "popup", "content": "<p>Let's insert another item in the list</p>", "zones": { "/index.html": { "ul_content": "edit" } }, "type": "slide", "speak": ["Let's insert another item in the list"] }, { "mode": "popup", "title": "Creating Web Pages - Part 1", "subtitle": "More About Tags", "allowBack": true, "content": "<p>This part has an inline <em>define</em> <span class=\"define\" type=\"html\" >HTML</span> and this is the <code>&gt;</code> sign -- it can do to create a website.</p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"main_content\"/><p>show, but don't speak -- and delay</p><p>Wait for dramatic <span class=\"define\" type=\"html\" >effect is amazing</span></p><p>Dramatic!</p><p>This is a final part that's not read</p>", "markers": null, "highlights": ["$file-browser .actions .create-file"], "flags": { "add": ["create-file", "delete-file"] }, "waitFor": [".tab-bar .tab[file=\"/index.html\"]"], "files": { "/index.html": "lock" }, "type": "slide", "speak": ["This part has an inline define HTML and this is the less than sign -- it can do to create a website.", "speak, but don't show", 500, "Wait for dramatic effect is amazing", 2000, "Dramatic!", "This is a final part that's not read"] }, { "mode": "popup", "title": "Creating Web Pages - Part 1", "subtitle": "More About Tags", "checkpoint": true, "files": { "/index.html": "unlock" }, "content": "<p>waiting</p>", "type": "slide", "speak": ["waiting"] }, { "mode": "popup", "title": "Creating Web Pages - Part 1", "subtitle": "More About Tags", "checkpoint": true, "content": "<p>This should expand the paragraph</p>", "zones": { "/index.html": { "paragraph_content": "expand" } }, "type": "slide", "speak": ["This should expand the paragraph"] }, { "mode": "popup", "checkpoint": true, "emotion": "surprised", "content": "<p>This is the content of the tag</p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"main_content\"/><p>It's pretty <em>darn</em> neat</p>", "type": "slide", "speak": ["This is the content of the tag", "It's pretty darn neat"] }, { "mode": "overlay", "content": "<p>This is a brand new snippet</p><div class=\"snippet\" type=\"complex_tag\" /><p>It's pretty <em>darn</em> neat</p>", "type": "slide", "speak": ["This is a brand new snippet", "It's pretty darn neat"] }, { "mode": "overlay", "emotion": "surprised", "content": "<p>This is a brand new snippet</p><div class=\"snippet\" type=\"mary_example\" /><p>It's pretty <em>darn</em> neat</p>", "type": "slide", "speak": ["This is a brand new snippet", "It's pretty darn neat"] }, { "mode": "popup", "checkpoint": true, "emotion": "sad", "content": "<p>Create a new file called <code>new.pug</code></p><p>If you accidentally create the wrong file type, delete and try again</p>", "flags": { "add": ["delete-file"] }, "validation": { "deleteFile": "verifyFileToDelete" }, "waitFor": [".tab-bar .tab[file=\"/new.pug\"]"], "type": "slide", "speak": ["Create a new file called new.pug", "If you accidentally create the wrong file type, delete and try again", "you should be able to now unlock folders"] }, { "checkpoint": true, "mode": "popup", "emotion": "happy", "content": "<p>Looks great!</p>", "flags": { "remove": ["create-file", "delete-file"] }, "type": "slide", "speak": ["Looks great!"] }, { "mode": "overlay", "show": 4, "title": "What is the name of the <code>highlighted</code> block of code?", "content": "<div class=\"snippet\" type=\"mary_example\" />", "hint": "This is a longer example of what a hint might look like. This is going to span for a period longer than the other items on the page.\n", "explain": "This is just a <code>summary message</code> to explain the final answer", "choices": ["this is <code>correct</code>", "This <em>is</em> incorrect", "This <em>is</em> also wrong", "This ~shouldn't~ work", "This <em>is another</em> mix", "This <em>is</em> failed"], "type": "question", "speak": ["What is the name of the highlighted block of code?"], "explained": "This is just a summary message to explain the final answer" }, { "mode": "overlay", "show": 4, "title": "This is another question about what you've learned?", "hint": "It's really pretty obvious", "explain": "This is just a <code>summary message</code> to explain the final answer", "choices": ["this is <code>correct</code>", "This <em>is</em> incorrect", "This <em>is</em> also wrong", "This ~shouldn't~ work", "This <em>is another</em> mix", "This <em>is</em> failed"], "type": "question", "speak": ["This is another question about what you've learned?"], "content": "", "explained": "This is just a summary message to explain the final answer" }, { "checkpoint": true, "mode": "popup", "content": "<p>That's it! The lesson is finished!</p>", "type": "slide", "speak": ["That's it! The lesson is finished!"] }], "definitions": { "html": { "id": "html", "name": "HTML", "aka": "Hyper Text Markup Language", "define": "This is the full def" } }, "snippets": { "complex_tag": { "content": "<div>\n  <h1>The Title</h1>\n  <p></p>\n</div>", "type": "html" }, "html_tag_example": { "content": "<h1>This is an example of HTML</h1>", "type": "html" }, "mary_example": { "content": "function () {\n  console.log('reads the file');\n}", "type": "javascript" } }, "zones": { "/index$html": { "ul_start_tag": { "start": { "row": 9, "col": 4 }, "end": { "row": 9, "col": 8 } }, "ul_end_tag": { "start": { "row": 13, "col": 4 }, "end": { "row": 13, "col": 9 } }, "ul_content": { "start": { "row": 10, "col": 0 }, "end": { "row": 12, "col": 36 }, "line": true } }, "complex_tag": { "main_content": { "start": { "row": 1, "col": 6 }, "end": { "row": 1, "col": 15 } }, "paragraph_content": { "start": { "row": 2, "col": 5 }, "end": { "row": 2, "col": 5 }, "collapsed": true, "content": "The main content!" } }, "html_tag_example": { "main_content": { "start": { "row": 0, "col": 4 }, "end": { "row": 0, "col": 30 } } }, "mary_example": { "read_file": { "start": { "row": 0, "col": 9 }, "end": { "row": 1, "col": 6 } }, "argument": { "start": { "row": 1, "col": 14 }, "end": { "row": 1, "col": 30 } }, "function_scope": { "start": { "row": 0, "col": 0 }, "end": { "row": 2, "col": 1 }, "line": true }, "function": { "start": { "row": 0, "col": 9 }, "end": { "row": 0, "col": 9 }, "collapsed": true, "content": "readTheFile" }, "code_block": { "start": { "row": 1, "col": 0 }, "end": { "row": 1, "col": 0 }, "collapsed": true, "line": true, "content": "" } } } };

    // share imported utils
    var _ = utils._;

    // shared variables
    var $lesson = this;
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
    function $validate(options) {
      var actions = [].slice.call(arguments);
      for (var i = 0, total = actions.length; i < total; i++) {
        var action = actions[i];

        // perform each action
        try {
          if (action() === false) throw 'validation failed';
        }

        // for errors, just fail
        catch (err) {
          $revertMessage();
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

    // default function for calling
    this.invoke = function (fallback) {
      var args = [].slice.call(arguments);
      var action = this[args.shift()];

      // calls the function, if it exists
      try {
        if (typeof action === 'function') return action.apply(this, args);
      } catch (err) {
        return fallback || null;
      }
    };

    // attach required scripts

    this.allowOpenIndexHtml = function (file) {
      console.log('checking for index.html', file);
      // state.allowFile = true;

      var allow = file.path === '/index.html';

      if (!allow) {
        $deny("Can't Open This File", 'Open the index.html file to continue the lesson');
        $speak('Whoops! You can not do that just yet!\n\nMake sure to open`index.html` to continue the lesson.', 'surprised');
      } else {
        $state.openedIndex = true;
      }

      return allow;

      // assistant.speak(`Whoops! You can't open that file just yet - Make sure to open \`index.html\``);
    };

    this.didOpenMainCSS = function (file) {};

    this.onBeforeSlideChange = function () {};

    this.onAfterSlideChange = function () {};

    // check they've added enough messages
    this.verifyHasMultipleListItems = function () {
      var zone = void 0;
      var requiredItems = 5;
      var minimumLength = 3;

      return $validate(

      // make sure there's a valid zone
      function () {
        zone = $getZone('/index.html', 'ul_content', true);
        if (!zone) {
          $showHint('Fix the HTML errors to continue');
          return false;
        }
      },

      // check how many items are listed
      function () {

        var totalItems = 0;
        var hasEmptyItem = void 0;
        var hasShortItem = void 0;

        // check each list item
        zone('li').each(function (index, node) {
          totalItems++;

          // check the contents
          var item = $html(node);
          var text = _.trim(item.text());
          if (text.length === 0) hasEmptyItem = true;
          if (text.length < minimumLength) hasShortItem = true;
        });

        // update the message, if needed
        if (totalItems < requiredItems) {
          var remaining = requiredItems - totalItems;
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
      },

      // passed validation
      function () {
        $hideHint();
        $speakMessage('Looks great! You can move onto the next step now');
      });
    };

    this.verifyHasMultipleListItems.init = this.verifyHasMultipleListItems;

    this.verifyFileToDelete = function (items) {

      // can delete index
      if (_.size(items) === 1 && items[0] === '/index.html') return true;

      console.log('trying to delete', items);

      $deny("Can't Delete This File", 'You can only delete the new.pug file');
      $speak("Nope! Can't delete that file yet", 'sad');
      return false;
    };

    this.verifyHtmlEditResult = function () {
      $state.hello = true;
      console.log('got this', _this.state);
    };
  }

  // registration function
  window.registerLesson('web_1', web1Lesson);
})();