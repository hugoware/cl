
(function() {

	// returns the instance of this lesson
	function $LESSON_TYPE$Lesson(state, project) {		
    this.data = $DATA$;

    // shared library access
    var _ = $LESSON_TYPE$Lesson.lodash;
    var $html = $LESSON_TYPE$Lesson.cheerio;
    var $ = $LESSON_TYPE$Lesson.jquery;
    
    // shared variables
    var $lesson = this;
    var $project = project;
    var $state = state;

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