!function a(s,r,l){function h(t,e){if(!r[t]){if(!s[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(d)return d(t,!0);var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}var o=r[t]={exports:{}};s[t][0].call(o.exports,function(e){return h(s[t][1][e]||e)},o,o.exports,a,s,r,l)}return r[t].exports}for(var d="function"==typeof require&&require,e=0;e<l.length;e++)h(l[e]);return h}({1:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.onSaveFile=function(){return this.progress.next(),!0},n.onReady=function(){this.screen.marker.saveButton({offsetX:-2,offsetY:2,tr:!0})};n.controller=!0},{}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.controller=void 0,n.validate=a,n.onEnter=function(){this.progress.block(),this.file.allowEdit({path:"/index.html"})},n.onReady=function(){this.editor.cursor({end:!0}),a(this)},n.onExit=function(){this.file.readOnly({path:"/index.html"})},n.onContentChange=function(e){a(this)};var i=e("./lib"),o=e("./validation");n.controller=!0;function a(e){var t=e.file.content({path:"/index.html"}),n=i.HtmlValidator.validate(t,o.validate_list);e.state.addedItem||"added-item"!==n.progress||(e.state.addedItem=!0,e.assistant.say({message:"Very good! Notice how the [define html_element Element] you added already has a number indicating which position it is on the list.",emote:"happy"})),e.editor.hint.validate({path:"/index.html",result:n}),e.progress.update({result:n,allow:function(){return e.assistant.say({message:"Wonderful! You'll notice that the [define web_browser] automatically placed a number next to each of the list items you created!"})},deny:e.assistant.revert,always:e.sound.notify})}},{"./lib":10,"./validation":13}],3:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.controller=void 0,n.onEnter=function(){var e=!!window.opr&&!!opr.addons||!!window.opera||0<=navigator.userAgent.indexOf(" OPR/"),t="undefined"!=typeof InstallTrigger,n=/constructor/i.test(window.HTMLElement)||(h=!window.safari||"undefined"!=typeof safari&&safari.pushNotification,"[object SafariRemoteNotification]"===h.toString()),i=!!document.documentMode,o=!i&&!!window.StyleMedia,a=!(!window.chrome||!window.chrome.webstore&&!window.chrome.runtime),s=(a||e)&&!!window.CSS,r=e?"Opera":t?"Firefox":n?"Safari":i?"Internet Explorer":o?"Edge":a?"Chrome":s?"Blink":null,l=r?"For example, the name of the web browser you're using is *"+r+"*!":"However, in this case I'm not sure what browser you're using";var h;this.assistant.say({emote:"happy",message:"\n\t\t\tWhen you browse the [define internet], you visit [define website websites] that show you information. That information is displayed on your screen using a [define web_browser web browser].\n\n\t\t\tThere's many web browsers that are used such as Chrome, Firefox, Safari, and more.\n\n\t\t\t"+l})};e("./lib"),n.controller=!0},{"./lib":10}],4:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.controller=void 0,n.onEnter=function(){this.progress.block(),this.file.readOnly({path:"/index.html",readOnly:!1}),this.editor.area({path:"/index.html",start:6,end:19})},n.onExit=function(){this.file.readOnly({file:"/index.html"}),this.editor.area.clear({path:"/index.html"})},n.onContentChange=function(e,t){var n=this.editor.area.get({path:"/index.html"}),i=(0,s.simplify)(n),o=(0,s.similarity)("helloworld",i),a=5<i.length&&o<.4;"somethingdifferent"===i?(r=!0,this.assistant.say({emote:"happy",message:"\n\t\t\t\tOh! I did say to type _\"something different\"_, didn't I?\n\t\t\t\tYou're very clever!"})):!r&&a?(r=!0,this.progress.allow(),this.assistant.say({message:"Looks great! You can see what you typed into the Preview Area"})):r&&!a&&(r=!1,this.assistant.revert())},n.onBeforeContentChange=function(e,t){return!t.hasNewline};e("./lib");var s=e("./utils"),r=(n.controller=!0,void 0)},{"./lib":10,"./utils":12}],5:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.onEnter=function(){this.screen.highlight.codeEditor()},n.onTryEditReadOnly=function(){this.assistant.say({emote:"happy",message:"Oops! I'm glad you're so excited to start making changes, but you can't edit the file just yet!"})},n.onExit=function(){this.screen.highlight.clear()};n.controller=!0},{}],6:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.controller=void 0,n.onEnter=function(){var e=this;this.editor.focus(),this.progress.block(),this.file.allowEdit({path:"/index.html"}),this.preview.addEvent("click","button",function(){e.assistant.say({emote:"happy",message:"\n\t\t\t\tThat button doesn't do anything just yet, but we'll learn how to make it do stuff in later lessons.\n\t\t\t\tI'm glad you we're curious and tried clicking on it!"})})},n.onReady=function(){a(this)},n.onExit=function(){this.file.readOnly({path:"/index.html"}),this.editor.area.clear(),this.preview.clearEvents()},n.onContentChange=function(e){a(this)};var i=e("./lib"),o=e("./validation");n.controller=!0;function a(e){var t=e.file.content({path:"/index.html"}),n=i.HtmlValidator.validate(t,o.validate_insert_button);e.editor.hint.validate({path:"/index.html",result:n}),e.progress.update({result:n,allow:function(){return e.assistant.say({message:"Great! Let's move to the next step!"})},deny:e.assistant.revert,always:e.sound.notify})}},{"./lib":10,"./validation":13}],7:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.controller=void 0,n.onEnter=function(){this.progress.block(),this.file.allowEdit({path:"/index.html"})},n.onReady=function(){this.editor.cursor({end:!0}),a(this)},n.onExit=function(){this.preview.clearEvents(),this.file.readOnly({path:"/index.html"}),this.editor.area.clear()},n.onContentChange=function(e){a(this)};var i=e("./lib"),o=e("./validation");n.controller=!0;function a(e){var t=e.file.content({path:"/index.html"}),n=i.HtmlValidator.validate(t,o.validate_insert_h3);e.editor.hint.validate({path:"/index.html",result:n}),e.progress.update({result:n,allow:function(){return e.assistant.say({emote:"happy",message:"Great! Let's move to the next step!"})},deny:e.assistant.revert,always:e.sound.notify})}},{"./lib":10,"./validation":13}],8:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.onOpenFile=function(e){this.screen.highlight.clear()},n.onEnter=function(){this.screen.highlight.fileBrowser()};n.controller=!0},{}],9:[function(e,t,n){"use strict";var i=function(){function i(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}}(),s=e("./lib"),r=o(e("./aboutSaving")),l=o(e("./addListItems")),h=o(e("./browserType")),d=o(e("./changeHeadingContent")),c=o(e("./codeEditorIntro")),u=o(e("./freeButtonInsert")),f=o(e("./freeHeadingInsert")),m=o(e("./highlightFileBrowser")),g=o(e("./previewAreaIntro")),p=o(e("./validation")),w=o(e("./waitForIndexHtml"));function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var a=function(){function a(e,t,n){var i=this;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),this.state={},this.lesson=t,this.project=e,this.api=n,this.data={name:"Introduction to Web Development",type:"web",description:"Getting started on learning the basics of Web Development",lesson:[{mode:"overlay",title:"Introduction to Creating Web Pages",content:"Welcome to your first lesson on creating web pages!\n\nAs you work through this lesson you will be asked to complete certain tasks before you can move onto the next step.\n"},{content:"In this tutorial we're going to start learning the basics of creating web pages.\n\nHowever, before we start learning how to write code, it's best to take a little bit of time and learn how web pages work _behind the scenes_.\n"},{controller:"browserType"},{content:"Generally speaking, web pages viewed in the browser are created using just three different core technologies. These are [define html], [define css], and [define javascript].\n\n[image tech.png]\n\nIn fact, it's entirely possible that every single website you've ever visited has used all three of these technologies at the same time!\n"},{content:"[define html] is the foundation for all [define web_page web pages]. [define html] is a language that determines the words and content that are displayed in the web browser.\n\n[image html-focus.png]\n\nIn a sense, [define html] is what your web page _says_.\n"},{content:"[define css] is a language that's used to determine the visual appearance of a web page. The colors, font sizes, layout, and other design properties of your web page are defined by the rules in [define css]\n\n[image css-focus.png]\n\nSimply put, [define css] decides what your web page _looks like_.\n"},{content:"Finally, [define javascript] is a programming language that can be used to create logic and behaviors on a web page. Many modern websites use [define javascript] to create complicated applications that run entirely in the [define web_browser browser]\n\n[image javascript-focus.png]\n\nGenerally speaking, [define javascript] decides what your web page _will do_.\n"},{content:"Each time you visit a [define website website], code files like [define html], [define css], and [define javascript] are sent to your computer. The [define web_browser] uses the instructions in each of these files to create the [define web_page web page] you see on the screen.\n\n[image build.jpg frame]\n"},{content:"There's a lot to learn when it comes to creating web pages, but with practice and time, you'll be building entire websites before you know it.\n\n[image html-focus.png]\n\nAt the start of this tutorial series, we're going to focus on learning [define html] and then introduce [define css] and [define javascript] at a later time.\n"},{emotion:"happy",content:"Great, let's get started learning some [define html]!"},{title:"What is HTML?",content:"[define html] is a language that's used to describe the information found on a web page. It's written using instructions called [define html_element Elements]. An [define html_element] is made up of several parts called [define html_tag tags].\n\nBelow is an example of a simple [define html_element].\n\n[snippet html_tag_example]\n\nLet's go over what each part of this code example ||does|duz||. \n"},{content:"The first part of an [define html_element] is the **Opening** [define html_tag tag]. It's written using a `<` sign, followed by the name of the tag, and then a `>` sign.\n\n[snippet html_tag_example highlight:0,4]\n\nThis tells the [define web_browser] what rules to follow for everything that comes after the opening tag.\n"},{content:'The `<` and `>` signs are special characters that are used in [define html] to mark where [define html_tag tags] begin and end.\n\n[snippet html_tag_example highlight:0,1|3,1]\n\nYou\'ll sometimes hear these characters referred to as _"angle brackets"_ by other developers.\n'},{content:"The word between the opening and closing tags is the name of the [define html_element Element]. Each [define html_element] has a different role in the web browser.\n\n[snippet html_tag_example highlight:1,2]\n\nFor example, this `h1` Element is how you display a large heading.\n"},{content:"At the end of an [define html_element] is the closing [define html_tag tag]. It's written much like the opening tag, but there's also a `/` character after the first `<` sign.\n\n[snippet html_tag_example highlight:17,5]\n\nThe closing [define html_tag] is very important because it marks where an [define html_element] stops.\n"},{content:'Everything between the opening and closing [define html_tag tags] is the content. This [define html_element Element] is a _heading_. If you were to look at this in a browser it would show up as the phrase "Hello, World!" in a large and bold font.\n\n[snippet html_tag_example highlight:4,13 preview:45%]\n'},{mode:"popup",content:"We've talked a lot about how [define html] works, so let's jump into writing some code and see what happens.\n"},{controller:"highlightFileBrowser",content:"On the left side of the screen is the [define file_browser]. This is a list of all files in your project.\n"},{controller:"waitForIndexHtml",content:"Open the file named `index.html` by [define double_click double clicking] on it in the [define file_browser].\n"},{controller:"codeEditorIntro",content:"The code file you just opened is now in the [define codelab_editor] area. This is where you can make changes to code.\n\nAt the top, you'll see there's a new tab added for the file you just opened.\n"},{controller:"previewAreaIntro",content:"On the right side of the screen you can see the [define codelab_html_preview]. This shows what the [define html] for this file looks like when viewed in a [define web_browser browser].\n\nThis area will update automatically as you make changes.\n"},{content:"Like with the previous example, this is a heading [define html_element Element]. You can see that it uses opening and closing [define html_tag tags] to surround the content.\n"},{controller:"changeHeadingContent",content:'Let\'s start by changing the content of the [define html_element Element]. Replace the words "Hello, World!" with something different.\n'},{content:"Now, let's try to type in an entirely new [define html_element]. This time we're going to create both the opening and closing [define html_tag tags] as well as the content inside.\n"},{controller:"freeHeadingInsert",content:"Create the following [define html_element]\n\n[snippet free_heading_insert]\n"},{content:"Practice makes perfect! Let's try that again with another [define html_element].\n"},{controller:"freeButtonInsert",content:"Create the following [define html_element]\n\n[snippet free_button_insert]\n"},{mode:"overlay",content:"So far you've written a few simple [define html_element HTML Elements] that had some words inside.\n\nEach [define html_element] you created had a different effect on the contents.\n"},{content:"For example, the `h1` [define html_element Element] made the font large and bold.\n\nThe `button` [define html_element Element] created a clickable button.\n\nBasically, the type of [define html_element] used will have a different effect on the contents.\n"},{content:"This is where [define html] starts getting exciting!\nText isn't the only thing that you can put inside of an [define html_element]!"},{content:"Many [define html_element HTML Elements] allow for you to put even more Elements inside of them.\n\n[snippet list_example]\n\nIn fact, most websites you visit on the [define internet] are made up of hundreds, or even thousands, of individual [define html_element HTML Elements]!\n"},{content:"Let's review the [define html] code sample below.\n\n[snippet list_example highlight:0,4|48,5]\n\nLike with the previous examples, there are still opening and closing [define html_tag tags].\n"},{content:'Between the opening and closing [define html_tag tags] are more [define html_element HTML Elements].\n\n[snippet list_example highlight:6,12|20,12|34,13]\n\nOften times you\'ll hear these called [define html_child_elements] or "nested" Elements.\n'},{content:"These two [define html_element Element] types work together to create a list of numbers in the [define web_browser].\n\n[snippet list_example preview:45%]\n\nThe `ol` Element tells the [define web_browser] that each of the child `li` Elements should be displayed as a new **list item**.\n"},{mode:"popup",content:"This might seem a little confusing at first, but it'll make much more sense once you try it out for yourself.\n"},{controller:"addListItems",content:"Create the list in the example below.\n\n[snippet list_example]\n"},{mode:"overlay",content:"Great work! There's still a lot to learn, but let's end this lesson by reviewing what we've covered so far.\n"},{show:4,title:"What is the name of the `highlighted` code?",content:"[snippet html_tag_example highlight:0,4]\n",hint:"The individual parts of an [define html_element] are called tags.\n",explain:"Each time you create a new [define html_element] you must start with an opening tag.\n",choices:["The opening tag","The leading byte","The execute command","The block maker"]},{show:4,title:"What is the name of the `highlighted` code?",content:"[snippet html_tag_example highlight:17,5]\n",hint:"The individual parts of an [define html_element] are called tags.\n",explain:"Each time you create a new [define html_element] you must use a closing tag to end it. You'll learn about more types in later lessons!\n",choices:["The closing tag","The ending byte","The terminator command","The block breaker"]},{show:4,title:"What is the name of the `highlighted` code?",content:"[snippet html_tag_example highlight:4,13]\n",explain:"The content is whatever has been added between the opening and closing [define html_tag tags] of an [define html_element]. It could be text, or even other [define html_element Elements].\n",choices:["The content","The encoded matrix","The bytecode input","The binary block"]},{show:4,title:"What is the name of a complete [define html] instruction?",content:"This includes the opening and closing tags as well as the content inside.\n\n[snippet html_tag_example highlight:0,22]\n",explain:"Basic commands in [define html] are called [define html_element HTML Elements]. Websites use hundreds, or even thousands of them, to create the content in the [define web_browser]\n",choices:["An HTML Element","An encoded terminator","A binary block","A bytecode command"]},{show:4,title:"What is another name for the `<` and `>` signs in [define html]?",explain:"The `<` and `>` signs are special characters used by [define html] to identify where [define html_tag tags] begin and end.\n",choices:["Angle brackets","Pointy blocks","Arrow bytecodes","Sharp codes"]},{mode:"popup",content:"Way to go! You've finished this lesson!\n"},{content:"At this point all files are now unlocked and you're free to make changes to anything in this project. You can play with the [define html] you've learned, or just try out new things.\n"},{content:'If you\'d like to try this lesson again, you can start over by using the "Reset Lesson" button from the home page of this site.\n\n[image reset-lesson.jpg]\n'},{content:"If you'd like to share what you've created with others, you can use the **Share** button and send them a link so they can try it out for themselves.\n\n[image share-project.jpg]\n\n[silent] _This button will appear after the lesson as been completed._\n"},{controller:"aboutSaving",content:"The changes you've made so far haven't been saved yet. Make sure to press the \"Save Changes\" button before you end this lesson.\n\nIf you forget to save your files and try and close a project, the website will display a message and give you a chance to save your work.\n"},{emote:"happy",content:"Great work, and I'll see you again for **Lesson 2**\n"}],snippets:{complex_tag:{content:"<div>\n  <h1>The Title</h1>\n  <p>The main content!</p>\n</div>",type:"html"},free_button_insert:{content:"<button>Click me</button>",type:"html"},free_heading_insert:{content:"<h3>HTML is great</h3>",type:"html"},html_tag_example:{content:"<h1>Hello, World!</h1>",type:"html"},list_example:{content:"<ol>\n\t<li>dog</li>\n\t<li>cat</li>\n\t<li>fish</li>\n</ol>",type:"html"}},resources:[{height:559,width:1340,type:"jpg",path:"build.jpg"},{width:1260,height:310,type:"png",path:"css-focus.png"},{width:1260,height:310,type:"png",path:"html-focus.png"},{width:1260,height:310,type:"png",path:"javascript-focus.png"},{height:458,width:838,type:"jpg",path:"reset-lesson.jpg"},{height:170,width:555,type:"jpg",path:"share-project.jpg"},{width:1260,height:310,type:"png",path:"tech.png"}],definitions:{html_element:{id:"html_element",name:"HTML Element",define:"This is about HTML elements\n"},web_browser:{id:"web_browser",name:"Web Browser",define:"An program that is used to view websites. Some common examples are **Chrome**, **Firefox**, **Safari**, and **Edge**\n"},internet:{id:"internet",name:"Internet",define:"A world wide network of computers\n"},website:{id:"website",name:"Website",define:"A point on the Internet that serves web pages"},double_click:{id:"double_click",name:"Double Click",define:"Pressing the mouse, or track pad, twice quickly. For touch screens, it's tapping the screen twice quickly."},file_browser:{id:"file_browser",name:"File Browser",define:"The list of all files for a CodeLab project. The File Browser is located on the left side of the code editor"},html:{id:"html",name:"HTML",aka:"Hyper Text Markup Language",define:"This is the full definition value"},css:{id:"css",name:"CSS",aka:"Cascading Style Sheets",define:"Special rules for styling\n"},javascript:{id:"javascript",name:"JavaScript",define:"Programming language\n"},web_page:{id:"web_page",name:"Web Page",define:"An individual view of a web site.\n"},html_tag:{id:"html_tag",name:"HTML Tag",define:"This is about HTML elements - this is `<` or `>`\n"},codelab_editor:{id:"codelab_editor",name:"Code Editor",define:"The CodeLab editing area\n"},codelab_html_preview:{id:"codelab_html_preview",name:"Preview Area",define:"You can see your HTML as you type\n"},html_child_elements:{id:"html_child_elements",name:"Child Elements",define:"HTML Elements that are contained inside of other HTML Elements. Also commonly referred to as **nested Elements**.\n"}}},this._delays={},this._intervals={},this.assistant=n.assistant,this.preview=n.preview,this.screen=n.screen,this.progress=n.progress,this.file=n.file,this.editor=n.editor,this.sound=n.sound,this.flags=n.flags,this.controllers={};var o={aboutSaving:r,addListItems:l,browserType:h,changeHeadingContent:d,codeEditorIntro:c,freeButtonInsert:u,freeHeadingInsert:f,highlightFileBrowser:m,previewAreaIntro:g,validation:p,waitForIndexHtml:w};s._.each(o,function(e,t){e.controller&&(i.controllers[t]=e)}),/localhost/gi.test(window.location.origin)&&(window.LESSON=this)}return i(a,[{key:"invoke",value:function(e){if(!this.respondsTo(e))return null;e=_(e);for(var t=this.controller,n=arguments.length,i=Array(1<n?n-1:0),o=1;o<n;o++)i[o-1]=arguments[o];return t[e].apply(this,i)}},{key:"respondsTo",value:function(e){e=_(e);var t=this.controller;return!!t&&t[e]}},{key:"clear",value:function(){s._.each(this._delays,function(e){return e()}),s._.each(this._intervals,function(e){return e()})}},{key:"delay",value:function(e,t){var n=this,i=setTimeout(t,e);return this._delays[i]=function(){clearTimeout(i),delete n._delays[i]}}},{key:"interval",value:function(e,t){var n=this,i=setInterval(t,e);return this._intervals[i]=function(){clearInterval(i),delete n._intervals[i]}}},{key:"controller",get:function(){var e=this.lesson.slide;return e&&this.controllers[e.controller]}},{key:"slide",get:function(){return this.lesson.slide}}]),a}();function _(e){return/on[A-Z]/.test(e)||(e="on"+e.charAt(0).toUpperCase()+e.substr(1)),e}window.registerLesson("web_1",a)},{"./aboutSaving":1,"./addListItems":2,"./browserType":3,"./changeHeadingContent":4,"./codeEditorIntro":5,"./freeButtonInsert":6,"./freeHeadingInsert":7,"./highlightFileBrowser":8,"./lib":10,"./previewAreaIntro":11,"./validation":13,"./waitForIndexHtml":14}],10:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var i=window.__CODELAB_LIBS__,o=n._=i._,a=n.$=i.$,s=n.CodeValidator=i.CodeValidator,r=n.HtmlValidator=i.HtmlValidator,l=n.CssValidator=i.CssValidator;n.default={_:o,$:a,CodeValidator:s,HtmlValidator:r,CssValidator:l}},{}],11:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.onEnter=function(){this.screen.highlight.previewArea()},n.onExit=function(){this.screen.highlight.clear()};n.controller=!0},{}],12:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.simplify=function(e){return(e||"").toString().replace(/[^a-z0-9]/gi,"").toLowerCase()},n.stringRange=function(e,t,n,i,o){var a=e?l._.isNumber(e.length)?e.length:e:0;{if(a<t){var s=t-a;return"Expected "+s+" more "+(1<s?o:i)}if(n<a){var r=a-n;return"Expected "+r+" fewer "+(1<r?o:i)}}},n.oxford=function(e,t){var n=e.length;{if(1===n)return e.join("");if(2==n)return e.join(" "+t+" ");var i=e.pop();return e.join(", ")+", "+t+" "+i}},n.plural=function(e,t,n,i){var o=4<arguments.length&&void 0!==arguments[4]?arguments[4]:"@",a=Math.abs(e);return(1===a?t:1<a?n||t+"s":i||n).replace(o,e)},n.similarity=function(e,t){var n=e,i=t;e.length<t.length&&(n=t,i=e);var o=n.length;return 0!=o?(o-function(e,t){e=e.toLowerCase(),t=t.toLowerCase();for(var n=new Array,i=0;i<=e.length;i++){for(var o=i,a=0;a<=t.length;a++)if(0==i)n[a]=a;else if(0<a){var s=n[a-1];e.charAt(i-1)!=t.charAt(a-1)&&(s=Math.min(Math.min(s,o),n[a])+1),n[a-1]=o,o=s}0<i&&(n[t.length]=o)}return n[t.length]}(n,i))/parseFloat(o):1};var l=e("./lib")},{"./lib":10}],13:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.validate_list=n.validate_insert_button=n.validate_insert_h3=void 0;e("./lib");var i=function(e){return e.tag("h1").trim.content(5,25).close("h1")},o=function(e){return e.tag("h3").trim.content("HTML is great").close("h3")},a=function(e){return e.tag("button").trim.content("Click me").close("button")};n.validate_insert_h3=function(e){return e.__w$.merge(i)._n.__w$.merge(o).__w$.eof()},n.validate_insert_button=function(e){return e.__w$.merge(i)._n.__w$.merge(o)._n.__w$.merge(a).__w$.eof()},n.validate_list=function(e){return e.__w$.merge(i)._n.__w$.merge(o)._n.__w$.merge(a)._n.__w$.tag("ol")._n._t.tag("li").text("dog").close("li").progress("added-item")._n._t.tag("li").text("cat").close("li")._n._t.tag("li").text("fish").close("li")._n.close("ol").__w$.eof()}},{"./lib":10}],14:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.onOpenFile=function(e){if("/index.html"===e.path)return this.progress.next(),!0},n.onEnter=function(){var e=this;this.progress.block(),this.file.readOnly({path:"/index.html"}),this.screen.highlight.fileBrowserItem("/index.html"),this.delay(1e4,function(){e.assistant.say({message:"\n\t\t\t\tTo open the `index.html` file, [define double_click double click] the item in the [define file_browser File Browser].\n\t\t\t\tTo [define double_click double click], move the mouse cursor over the file on the list then press the _left mouse button_ twice quickly."})})},n.onExit=function(){this.screen.highlight.clear()};n.controller=!0},{}]},{},[9]);