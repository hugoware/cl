!function(){function web2Lesson(state){this.data={name:"Web Basics 2",type:"web",description:"Continued discussion of Web Basics",lesson:[{type:"slide",content:"<p>Welcome to Web Basics 2</p>",speak:["Welcome to Web Basics 2"]},{type:"slide",content:"<p>Time to start learning some new stuff</p>",speak:["Time to start learning some new stuff"]}],definitions:{},snippets:{complex_tag:{content:"<div>\n  <h1>The Title</h1>\n  <p>The main content!</p>\n</div>",type:"html",zones:{first_tag:{start:{row:1,col:2},end:{row:1,col:20}},second_tag:{start:{row:2,col:2},end:{row:2,col:26}},entire_tag:{start:{row:0,col:0},end:{row:3,col:6}}}},html_tag_example:{content:"<h1>This is an example of HTML</h1>",type:"html",zones:{front_tag:{start:{row:0,col:0},end:{row:0,col:4}},end_tag:{start:{row:0,col:30},end:{row:0,col:35}},content:{start:{row:0,col:4},end:{row:0,col:30}}}},mary_example:{content:"function readTheFile() {\n  console.log('reads the file');\n}",type:"javascript",zones:{console_example:{start:{row:1,col:2},end:{row:1,col:32}}}}}},this.state=state;var _=web2Lesson.lodash,$html=web2Lesson.cheerio,$=web2Lesson.jquery;function didOpenMainCSS(e){}function onBeforeSlideChange(){}function onAfterSlideChange(){}function verifyHtmlEditResult(){this.state.hello=!0,console.log("got this",this.state)}this.invoke=function(){var args=[].slice.call(arguments),action=eval(args.shift());"function"==typeof action&&action.apply(this,args)}}window.registerLesson("web_2",web2Lesson)}();