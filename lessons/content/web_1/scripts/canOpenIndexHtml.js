
$define('canOpenIndexHtml', file => {
  return $validate({ revertOnError: false }, () => {

    if (file.path !== '/index.html') {
      $denyAccess("Can't Open This File", 'Open the index.html file to continue the lesson');
      $speakMessage("You can't open that file just yet!\n\nMake sure to open `index.html` to continue the lesson.", 'surprised');
      return false;
    }

  });
});