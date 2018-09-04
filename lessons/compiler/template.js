
(function() {

	// returns the instance of this lesson
	function $LESSON_TYPE$Lesson(state) {		
		this.data = $DATA$;
		this.state = state;

		// shared library access
		var _ = $LESSON_TYPE$Lesson.lodash;
    var $html = $LESSON_TYPE$Lesson.cheerio;
    var $ = $LESSON_TYPE$Lesson.jquery;

		// default function for calling
		this.invoke = function() {
			var args = [].slice.call(arguments);
			var action = eval(args.shift());

			// calls the function, if it exists
			if (typeof action === 'function')
				action.apply(this, args);	
		}

		// attach required scripts
		$SCRIPTS$
	}

	// registration function
	window.registerLesson('$LESSON_ID$', $LESSON_TYPE$Lesson);
})();