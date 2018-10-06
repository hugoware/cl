$define('verifyImageSrc', { init: true }, () => {
  return $validate(() => {

    // get the current entered value
    let content = $getZone('/index.html', 'image_path');
    content = _.trim(content);

    // make sure it's okay
    if (content !== $state.uploadedFileName) {
      $showHint('Enter in the name of the image you uploaded');
      return false;
    }

    $hideHint();
    $speakMessage('Perfect! You can see that the image is showing!');

  });
});