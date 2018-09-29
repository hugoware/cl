
(function() {

	// returns the instance of this lesson
	function $LESSON_TYPE$Lesson(state, project, utils) {		
    this.data = $DATA$;

    // share imported utils
    var _ = utils._;
    
    // shared variables
    var $lesson = this;
    var $project = project;
    var $state = state;

    // parses a string of html
    function $html(str) {
      return utils.$html((str || '').toString());
    }

    // a general selector function
    function $() {
      return utils.$.apply(utils.$, arguments);
    }

    // shared functions
    function $deny(message, explain) {
      if (_.isFunction($lesson.onDeny))
        $lesson.onDeny({ message, explain });
    }

    // speaks a message using the assistant
    function $speak(message, emotion) {
      if (_.isFunction($lesson.onSpeak))
        $lesson.onSpeak({ message, emotion });
    }

    // returns the message to the prior content
    function $revert() {
      if (_.isFunction($lesson.onRevert))
        $lesson.onRevert();
    }

    // gets a zone
    function $zone(file, id, asDom) {
      const html = utils.getZoneContent(file, id);
      return asDom ? $html(html) : html;
    }

		// default function for calling
		this.invoke = function(fallback) {
			var args = [].slice.call(arguments);
      var action = this[args.shift()];

			// calls the function, if it exists
      try {
        if (typeof action === 'function')
          return action.apply(this, args);
      }
      catch (err) {
        return fallback || null;
      }
		}

		// attach required scripts
		$SCRIPTS$
	}

	// registration function
	window.registerLesson('$LESSON_ID$', $LESSON_TYPE$Lesson);
})();