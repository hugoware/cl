
this.allowOpenIndexHtml = file => {
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

this.didOpenMainCSS = file => {


}


this.onBeforeSlideChange = () => {
	

}

this.onAfterSlideChange = () => {

}


let count = 0;
this.verifyHasMultipleListItems = () => {
  count++;

  if (((count % 5) === 0)) {
    $speak('Looks great! Move onto the next step when you are ready');
  }
  else {
    $revert();
  }

  return ((count % 5) === 0);

  // const html = $zone('/index.html', 'ul_content');
  // console.log('matched to', html);

};


this.verifyFileToDelete = (items) => {

  // can delete index
  if (_.size(items) === 1 && items[0] === '/index.html')
    return true;

  console.log('trying to delete', items);

  $deny("Can't Delete This File", 'You can only delete the new.pug file');
  $speak("Nope! Can't delete that file yet", 'sad')
  return false;
}

this.verifyHtmlEditResult = () => {
  $state.hello = true
	console.log('got this', this.state);
}