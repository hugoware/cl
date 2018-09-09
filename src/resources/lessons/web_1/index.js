
(function() {

	// returns the instance of this lesson
	function web1Lesson(state, project) {		
    this.data = {
  "name": "Basics 1",
  "type": "web",
  "description": "Introduction to building Web Pages",
  "lesson": [
    {
      "mode": "popup",
      "title": "Creating Web Pages - Part 1",
      "subtitle": "More About Tags",
      "checkpoint": true,
      "validation": {
        "openFile": "allowOpenIndexHtml"
      },
      "content": "<p>This part has an inline <em>define</em> <span class=\"define\" type=\"html\" >HTML</span> and this is the <code>&gt;</code> sign -- it can do to create a website.</p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"front_tag end_tag\"/><p>show, but don't speak -- and delay</p><p>Wait for dramatic <span class=\"define\" type=\"html\" >effect is amazing</span></p><p>Dramatic!</p><p>This is a final part that's not read</p>",
      "markers": null,
      "highlights": [
        "$file-browser .actions .create-file"
      ],
      "flags": {
        "add": [
          "create-file",
          "delete-file"
        ]
      },
      "waitFor": [
        ".tab-bar .tab[file=\"/index.html\"]"
      ],
      "type": "slide",
      "speak": [
        "This part has an inline define HTML and this is the less than sign -- it can do to create a website.",
        "speak, but don't show",
        500,
        "Wait for dramatic effect is amazing",
        2000,
        "Dramatic!",
        "This is a final part that's not read"
      ]
    },
    {
      "mode": "overlay",
      "checkpoint": true,
      "emotion": "surprised",
      "content": "<p>This is the content of the tag</p><div class=\"snippet\" type=\"html_tag_example\" highlight=\"content\"/><p>It's pretty <em>darn</em> neat</p>",
      "type": "slide",
      "speak": [
        "This is the content of the tag",
        "It's pretty darn neat"
      ]
    },
    {
      "mode": "overlay",
      "content": "<p>This is a brand new snippet</p><div class=\"snippet\" type=\"complex_tag\" highlight=\"entire_tag\"/><p>It's pretty <em>darn</em> neat</p>",
      "type": "slide",
      "speak": [
        "This is a brand new snippet",
        "It's pretty darn neat"
      ]
    },
    {
      "mode": "overlay",
      "emotion": "surprised",
      "content": "<p>This is a brand new snippet</p><div class=\"snippet\" type=\"mary_example\" highlight=\"console_example\"/><p>It's pretty <em>darn</em> neat</p>",
      "type": "slide",
      "speak": [
        "This is a brand new snippet",
        "It's pretty darn neat"
      ]
    },
    {
      "mode": "popup",
      "checkpoint": true,
      "emotion": "sad",
      "content": "<p>Create a new file called <code>new.pug</code></p><p>If you accidentally create the wrong file type, delete and try again</p>",
      "flags": {
        "add": [
          "delete-file"
        ]
      },
      "waitFor": [
        ".tab-bar .tab[file=\"/new.pug\"]"
      ],
      "type": "slide",
      "speak": [
        "Create a new file called new.pug",
        "If you accidentally create the wrong file type, delete and try again",
        "you should be able to now unlock folders"
      ]
    },
    {
      "checkpoint": true,
      "mode": "popup",
      "emotion": "happy",
      "content": "<p>Looks great!</p>",
      "flags": {
        "remove": [
          "create-file",
          "delete-file"
        ]
      },
      "type": "slide",
      "speak": [
        "Looks great!"
      ]
    },
    {
      "show": 4,
      "choices": [
        "this is correct",
        "This is incorrect",
        "This is also wrong",
        "This shouldn't work",
        "This is another mix",
        "This is failed"
      ],
      "type": "question"
    }
  ],
  "definitions": {
    "html": {
      "id": "html",
      "name": "HTML",
      "aka": "Hyper Text Markup Language",
      "define": "This is the full def"
    }
  },
  "snippets": {
    "complex_tag": {
      "content": "<div>\n  <h1>The Title</h1>\n  <p>The main content!</p>\n</div>",
      "type": "html",
      "zones": {
        "first_tag": {
          "start": {
            "row": 1,
            "col": 2
          },
          "end": {
            "row": 1,
            "col": 20
          }
        },
        "second_tag": {
          "start": {
            "row": 2,
            "col": 2
          },
          "end": {
            "row": 2,
            "col": 26
          }
        },
        "entire_tag": {
          "start": {
            "row": 0,
            "col": 0
          },
          "end": {
            "row": 3,
            "col": 6
          }
        }
      }
    },
    "html_tag_example": {
      "content": "<h1>This is an example of HTML</h1>",
      "type": "html",
      "zones": {
        "front_tag": {
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
            "col": 30
          },
          "end": {
            "row": 0,
            "col": 35
          }
        },
        "content": {
          "start": {
            "row": 0,
            "col": 4
          },
          "end": {
            "row": 0,
            "col": 30
          }
        }
      }
    },
    "mary_example": {
      "content": "function readTheFile() {\n  console.log('reads the file');\n}",
      "type": "javascript",
      "zones": {
        "console_example": {
          "start": {
            "row": 1,
            "col": 2
          },
          "end": {
            "row": 1,
            "col": 32
          }
        }
      }
    }
  }
};
    this.project = project;
    this.state = state;

    // shared library access
    var _ = web1Lesson.lodash;
    var $html = web1Lesson.cheerio;
    var $ = web1Lesson.jquery;
    
    // shared variables
    var $lesson = this;
    var $project = project;
    var $state = state;

    // shared functions
    function deny(message, explain) {
      if (_.isFunction($lesson.onDeny))
        $lesson.onDeny({ message, explain });
    }

    // speaks a message using the assistant
    function speak(message, emotion) {
      if (_.isFunction($lesson.onSpeak))
        $lesson.onSpeak({ message, emotion });
    }


		// default function for calling
		this.invoke = function() {
			var args = [].slice.call(arguments);
			var action = eval(args.shift());

			// calls the function, if it exists
			if (typeof action === 'function')
				return action.apply(this, args);	
		}

		// attach required scripts
		
function allowOpenIndexHtml(file) {
  console.log('checking for index.html', file);
  // state.allowFile = true;

  const allow = file.path === '/index.html';


  
  if (!allow) {
    deny("Can't Open This File", 'Open the index.html file to continue the lesson');
    speak('Whoops! You can not do that just yet!\n\nMake sure to open`index.html` to continue the lesson.', 'surprised');
  }
  else {
    $state.openedIndex = true;
  }


  return allow;
  
  // assistant.speak(`Whoops! You can't open that file just yet - Make sure to open \`index.html\``);

}

function didOpenMainCSS(file) {


}


function onBeforeSlideChange() {
	

}

function onAfterSlideChange() {

}

function verifyHtmlEditResult() {
  this.state.hello = true
	console.log('got this', this.state);
}
	}

	// registration function
	window.registerLesson('web_1', web1Lesson);
})();