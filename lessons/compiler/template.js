
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

    // performs the oxford comma
    function $oxford(items, conjunction) {
      const total = items.length;

      // determine the best
      if (total === 1)
        return items.join('')
      else if (total == 2)
        return items.join(` ${conjunction} `);

      // return the result
      else {
        const last = items.pop();
        return `${items.join(', ')}, ${conjunction} ${last}`;
      }
    }

    // pluralizes a word
    function $plural(count, single, plural, none, delimeter = '@') {
      const value = Math.abs(count);
      const message = value === 1 ? single
        : value > 1 ? (plural ? plural : `${single}s`)
        : none || plural;
      return message.replace(delimeter, count);
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
    function $getZone(file, id, options = { }) {
      let html = utils.getZoneContent(file, id);
      if (options.trim !== false) html = _.trim(html);
      return (options.toDom || options.asDom) ? $html(html) : html;
    }

    // 
    const $noop = { };

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

          // handle reverting
          if (options.revertOnError)
            $revertMessage();

          // doesn't want to do anything with validation
          if (result === $noop)
            return false;

          // check for messages
          if (exception && options.error)
            options.error(result);
          
          // handle failure
          else if (_.isString(result) && options.fail)
            options.fail(result);
          
        }
        // extreme case
        catch(ex) {
          $hideHint();
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