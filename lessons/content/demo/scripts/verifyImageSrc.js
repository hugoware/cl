
$validator('verifyImageSrc', { 
  init: true,
  delay: 300,

  validate: () => {

    // get the current entered value
    const content = $getZone('/index.html', 'image_path', { trim: false });

    // make sure it's okay
    if (content !== $state.uploadedFileName)
      return `Enter path to your image \`${$state.uploadedFileName}\` of the image you uploaded`;

  },

  fail: reason => {
    $showHint(reason);
  },

  success: () => {
    $hideHint();
    $speakMessage('Great! You should see your image displayed in the preview now!')
  }

});