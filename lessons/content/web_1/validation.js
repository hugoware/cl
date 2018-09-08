
function allowOpenIndexHtml(file) {
  console.log('checking for index.html', file);
  // state.allowFile = true;

  const allow = file.path === '/index.html';
  
  if (!allow) {
    deny("Can't Open This File", 'Open the index.html file to continue the lesson');
    speak('Whoops! You can not do that just yet!\n\nMake sure to open`index.html` to continue the lesson.', 'surprised');
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