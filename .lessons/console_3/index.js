"use strict";window.registerLesson("console_3",function(e,n,r){var l=this;l.data={name:"Console 3",type:"code",description:"An Introduction to the CodeLab Learning System 3",lesson:[{mode:"popup",content:"<p>Let's start working on code examples - open the file <code>main.ts</code></p>",waitFor:["::fileOpen(/main.ts)"],highlight:["::fileBrowser(/main.ts)"],validation:{openFile:"::allowIfFile(/main.ts, open-file)"},type:"slide",speak:["Let's start working on code examples - open the file main.ts"]},{mode:"overlay",content:"<p>This is the end of the lesson</p>",type:"slide",speak:["This is the end of the lesson"]}],definitions:{},snippets:{declare_variables:{content:"const a = 300;\nconst b = false;\nconst c = 'hello';",type:"javascript"},log_variables:{content:"console.log(a);\nconsole.log(b);\nconsole.log(c);",type:"javascript"}},zones:{log_variables:{all:{}},declare_variables:{all:{start:{row:1,col:1},end:{row:2,col:17},line:!0}}}};var c=r._,o=l,t=r.$validate;function i(e,n){return c.isString(e)?r.$html((e||"").toString(),n):r.$html(e)}function u(e,n){c.isFunction(o.onSpeak)&&o.onSpeak({message:e,emotion:n,isOverride:!0})}function a(){c.isFunction(o.onRevert)&&o.onRevert()}function s(e,n){c.isFunction(o.onHint)&&((n=n||{}).message=e,o.onHint(n))}function d(){c.isFunction(o.onHint)&&o.onHint(null)}function b(e){var n=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},o=r.getFileContent(e,n);return!1!==n.trim&&(o=c.trim(o)),n.toDom||n.asDom?i(o):o}function v(e,n,o){c.isFunction(n)&&(o=n,n=null),c.assign(o,n),l[e]=o}l.$html=i,l.$=function(){return r.$.apply(r.$,arguments)},l.$denyAccess=function(e,n){c.isFunction(o.onDeny)&&o.onDeny({message:e,explain:n})},l.$approveSlide=function(e,n){c.isFunction(o.onApprove)&&o.onApprove({message:e,emotion:n})},l.$speakMessage=u,l.$revertMessage=a,l.$showHint=s,l.$hideHint=d,l.$validate=function(){var e=[].slice.call(arguments),n={};c.isFunction(e[0])||(n=e.shift());for(var o=0,t=e.length;o<t;o++){var r=e[o];try{if(!1===r())throw"validation failed"}catch(e){return!1!==n.revertOnError&&a(),!1}}return!0},l.$getZone=function(e,n){var o=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},t=r.getZoneContent(e,n);return!1!==o.trim&&(t=c.trim(t)),o.toDom||o.asDom?i(t):t},l.$getFile=b,l.$validateCode=t,c.assign(u,{MATCH_EXAMPLE:function(){return u("Almost there! The code ran successfully, but you need to finish matching the example!","happy")},EXECUTION_ERROR:function(){return u("Oops! It appears there was an error running that code!","surprised")}});var f=function(e){var o=[];function n(e){if(c.includes(o,e)){var n=c.difference(["a","b","c"],o);return"Expected "+function(e,n){var o=e.length;if(1===o)return e.join("");if(2==o)return e.join(" "+n+" ");var t=e.pop();return e.join(", ")+", "+n+" "+t}(c.map(n,function(e){return"`"+e+"`"}),"or")}o.push(e)}e.includeResult({variableOrder:o}),e.newline().id("console").symbol(".").id("log").symbol("(").id("a","b","c",n).symbol(")").symbol(";").newline().id("console").symbol(".").id("log").symbol("(").id("a","b","c",n).symbol(")").symbol(";").newline().id("console").symbol(".").id("log").symbol("(").id("a","b","c",n).symbol(")").symbol(";")};v("verifyLogSyntax",function(){var e=b("/main.ts",{trim:!1}),n=t(e,h,f);return n.error?s(n.error.message,n.error):d(),n}),v("verifyLog",function(e){var s=e.runner,n=e.code,o=e.onSuccess;s.run(n,{onError:u.EXECUTION_ERROR,onEnd:function(){var t=void 0,r=void 0,i=void 0,a=void 0;if(c.each(["a","b","c"],function(e,n){if(!a){var o=s.getOutput(n+1,0);"a"===e?(t=!0,300!==o&&(a=!0,u("Expected `a` to be logged as `300`","sad"))):"b"===e?!(r=!0)!==o&&(a=!0,u("Expected `b` to be logged as `false`","sad")):"c"===e&&(i=!0,"hello"!==o&&(a=!0,u("Expected `c` to be logged as `hello`","sad")))}}),!a){if(!(t&&r&&i))return u("Seems like you're missing a few variables","sad");if(l.verifyLogSyntax().error)return u.MATCH_EXAMPLE();u("That looks great! You can see your values printed in the output area on the right"),o()}}})});var h=function(e){return e.declare("const").id("a").symbol("=").num(300).symbol(";").newline().declare("const").id("b").symbol("=").bool(!1).symbol(";").newline().declare("const").id("c").symbol("=").str("hello").symbol(";")};v("verifyObjectSyntax",function(){var e=b("/main.ts",{trim:!1}),n=t(e,h);return n.error?s(n.error.message,n.error):d(),n}),v("verifyObject",function(e){var t=e.runner,n=e.code,r=e.onSuccess;t.run(n,{onError:u.EXECUTION_ERROR,onEnd:function(){var e=t.interpreter.get("a");if(300===e){var n=t.interpreter.get("b");if(!1===n){var o=t.interpreter.get("c");if("hello"===o){if(l.verifyObjectSyntax().error)return u.MATCH_EXAMPLE();u("looks great!"),r()}else c.isNil(o)?u("You need to declare a variable `c` with a string value of `hello`"):c.isString(o)?u("The variable `c` should be `hello`, but the variable you declared equals to `"+o+"`","surprised"):u("The variable `c` should be the string `hello`")}else c.isNil(n)?u("You need to declare a variable `b` with a boolean value of `false`"):c.isBoolean(n)?u("The variable `b` should be `false`, but the variable you declared equals to `"+n+"`","surprised"):u("The variable `b` should be the boolean `false`")}else c.isNil(e)?u("You need to declare a variable `a` with a number value of `300`"):c.isNumber(e)?u("The variable `a` should be `300`, but the variable you declared equals to `"+e+"`","surprised"):u("The variable `a` should be the number `300`")}})})});