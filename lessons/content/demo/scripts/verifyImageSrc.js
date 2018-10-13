
$validator('verifyImageSrc', { 
  init: true,
  delay: 300,
  hideHintOnSuccess: true,

  validate: () => {

    // get the current entered value
    const content = $getZone('/index.html', 'img_src', { trim: false });

    // make sure it's okay
    if (content !== `/${$state.uploadedFileName}`)
      return `Enter the image path \`${$state.uploadedFileName}\``;

  },

  fail: reason => {
    $showHint(reason);
  },

  success: () => {
    $hideHint();
    $speakMessage('Great! You should see your image displayed in the preview now!')
  }

});