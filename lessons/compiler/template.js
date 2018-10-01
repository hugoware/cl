
(function() {

	// returns the instance of this lesson
	function $LESSON_TYPE$Lesson(state, project, utils) {
    var $self = this;
    $self.data = $DATA$;

    // share imported utils
    var _ = utils._;
    
    // shared variables
    var $lesson = $self;
    var $project = project;
    var $state = state;

    // parses a string of html
    function $html(str, options) {
      return _.isString(str) ? utils.$html((str || '').toString(), options)
        : utils.$html(str);
    }

    // a general selector function
    function $() {
      return utils.$.apply(utils.$, arguments);
    }

    // shared functions
    function $denyAccess(message, explain) {
      if (_.isFunction($lesson.onDeny))
        $lesson.onDeny({ message, explain });
    }

    // speaks a message using the assistant
    function $speakMessage(message, emotion) {
      if (_.isFunction($lesson.onSpeak))
        $lesson.onSpeak({ message, emotion, isOverride: true });
    }

    // returns the message to the prior content
    function $revertMessage() {
      if (_.isFunction($lesson.onRevert))
        $lesson.onRevert();
    }

    // handles displaying a hint
    function $showHint(str, options) {
      if (!_.isFunction($lesson.onHint)) return;
      options = options || { };
      options.message = str;
      $lesson.onHint(options);
    }

    // handles hiding hints
    function $hideHint() {
      if (_.isFunction($lesson.onHint))
        $lesson.onHint(null);
    }

    // runs a series of actions until one
    // of them returns false
    function $validate() {
      const actions = [].slice.call(arguments);

      // check for extra options
      let options = { };
      if (!_.isFunction(actions[0]))
        options = actions.shift();

      // run each action
      for (let i = 0, total = actions.length; i < total; i++) {
        const action = actions[i];

        // perform each action
        try {
          if (action() === false)
            throw 'validation failed';
        }

        // for errors, just fail
        catch(err) {
          if (options.revertOnError !== false)
            $revertMessage();
          return false;
        }
      }

      // was successful
      return true;
    }

    // gets a zone
    function $getZone(file, id, asDom, strict) {
      const html = utils.getZoneContent(file, id);
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
		$SCRIPTS$
	}

	// registration function
	window.registerLesson('$LESSON_ID$', $LESSON_TYPE$Lesson);
})();