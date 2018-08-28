
(function() {

	// returns the instance of this lesson
	function $LESSON_TYPE$Lesson() {		
		this.data = $DATA$;
		this.state = { };

		// shared library access
		var _ = $LESSON_TYPE$Lesson.lodash;
		var html = $LESSON_TYPE$Lesson.cheerio;

		// default function for calling
		this.invoke = function() {
			var args = [].slice.call(arguments);
			var action = args.shift();

			// calls the function, if it exists
			if (typeof action === 'function')
				eval(action).apply(this.state, args);	
		}

		// attach required scripts
		$SCRIPTS$
	}

	// registration function
	window.registerLesson('$LESSON_ID$', $LESSON_TYPE$Lesson);
})();