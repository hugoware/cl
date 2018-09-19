
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
      "zones": {
        "/index.html": {
          "header_start_tag": "show",
          "header_end_tag": "show",
          "paragraph_content": "collapse"
        }
      },
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
      "mode": "popup",
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
      "validation": {
        "deleteFile": "verifyFileToDelete"
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
      "mode": "overlay",
      "show": 4,
      "title": "What is the name of the <code>highlighted</code> block of code?",
      "content": "<div class=\"snippet\" type=\"mary_example\" highlight=\"console_example\"/>",
      "hint": "This is a longer example of what a hint might look like. This is going to span for a period longer than the other items on the page.\n",
      "explain": "This is just a <code>summary message</code> to explain the final answer",
      "choices": [
        "this is <code>correct</code>",
        "This <em>is</em> incorrect",
        "This <em>is</em> also wrong",
        "This ~shouldn't~ work",
        "This <em>is another</em> mix",
        "This <em>is</em> failed"
      ],
      "type": "question",
      "speak": [
        "What is the name of the highlighted block of code?"
      ],
      "explained": "This is just a summary message to explain the final answer"
    },
    {
      "mode": "overlay",
      "show": 4,
      "title": "This is another question about what you've learned?",
      "hint": "It's really pretty obvious",
      "explain": "This is just a <code>summary message</code> to explain the final answer",
      "choices": [
        "this is <code>correct</code>",
        "This <em>is</em> incorrect",
        "This <em>is</em> also wrong",
        "This ~shouldn't~ work",
        "This <em>is another</em> mix",
        "This <em>is</em> failed"
      ],
      "type": "question",
      "speak": [
        "This is another question about what you've learned?"
      ],
      "content": "",
      "explained": "This is just a summary message to explain the final answer"
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
      "type": "html"
    },
    "html_tag_example": {
      "content": "<h1>This is an example of HTML</h1>",
      "type": "html"
    },
    "mary_example": {
      "content": "function readTheFile() {\n  console.log('reads the file');\n}",
      "type": "javascript"
    }
  },
  "zones": {
    "/index$html": {
      "header_start_tag": {
        "start": {
          "row": 7,
          "col": 4
        },
        "end": {
          "row": 7,
          "col": 8
        }
      },
      "header_end_tag": {
        "start": {
          "row": 7,
          "col": 20
        },
        "end": {
          "row": 7,
          "col": 25
        }
      },
      "header_content": {
        "start": {
          "row": 7,
          "col": 8
        },
        "end": {
          "row": 7,
          "col": 20
        }
      },
      "page_title": {
        "start": {
          "row": 3,
          "col": 11
        },
        "end": {
          "row": 3,
          "col": 19
        }
      },
      "paragraph_start_tag": {
        "start": {
          "row": 9,
          "col": 4
        },
        "end": {
          "row": 9,
          "col": 7
        }
      },
      "paragraph_end_tag": {
        "start": {
          "row": 9,
          "col": 35
        },
        "end": {
          "row": 9,
          "col": 39
        }
      },
      "paragraph_content": {
        "collapsed": true,
        "start": {
          "row": 9,
          "col": 7
        },
        "end": {
          "row": 9,
          "col": 35
        }
      },
      "head_tag": {
        "start": {
          "row": 2,
          "col": 2
        },
        "end": {
          "row": 4,
          "col": 9
        }
      },
      "body_tag": {
        "start": {
          "row": 5,
          "col": 2
        },
        "end": {
          "row": 11,
          "col": 9
        }
      },
      "doctype": {
        "start": {
          "row": 0,
          "col": 0
        },
        "end": {
          "row": 0,
          "col": 15
        }
      }
    },
    "/style$css": {
      "css_property_color": {
        "start": {
          "row": 1,
          "col": 2
        },
        "end": {
          "row": 1,
          "col": 7
        }
      },
      "css_color_value": {
        "start": {
          "row": 1,
          "col": 9
        },
        "end": {
          "row": 1,
          "col": 12
        }
      },
      "css_color_property": {
        "start": {
          "row": 1,
          "col": 2
        },
        "end": {
          "row": 1,
          "col": 7
        }
      },
      "css_selector": {
        "start": {
          "row": 0,
          "col": 0
        },
        "end": {
          "row": 0,
          "col": 4
        }
      },
      "css_rule": {
        "start": {
          "row": 0,
          "col": 0
        },
        "end": {
          "row": 2,
          "col": 1
        }
      }
    },
    "html_tag_example": {
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
    },
    "complex_tag": {
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
    },
    "mary_example": {
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
    $deny("Can't Open This File", 'Open the index.html file to continue the lesson');
    $speak('Whoops! You can not do that just yet!\n\nMake sure to open`index.html` to continue the lesson.', 'surprised');
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

function verifyFileToDelete(items) {

  // can delete index
  if (_.size(items) === 1 && items[0] === '/index.html')
    return true;

  console.log('trying to delete', items);

  $deny("Can't Delete This File", 'You can only delete the new.pug file');
  $speak("Nope! Can't delete that file yet", 'sad')
  return false;
}

function verifyHtmlEditResult() {
  $state.hello = true
	console.log('got this', this.state);
}
	}

	// registration function
	window.registerLesson('web_1', web1Lesson);
})();