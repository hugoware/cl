
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


    // creates a validator function
    function $validator(key, options) {

      // create the primary validation function
      const handler = (...args) => {

        // execute the validator
        let result;
        let exception;
        try {
          result = options.validate();
        }
        // failed to validate
        catch(err) {
          exception = true;
          result = err;
        }

        // validation passed
        if (_.isNil(result))
          return true;

        // if there was an error
        try {

          // handle error cases
          if (exception && options.error)
            options.error(result);
          
          // handle failure
          else if (options.fail)
            options.fail(result);

          // handle reverting
          if (options.revertOnError)
            $revertMessage();
        }
        finally {
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
		$SCRIPTS$
	}

	// registration function
	window.registerLesson('$LESSON_ID$', $LESSON_TYPE$Lesson);
})();