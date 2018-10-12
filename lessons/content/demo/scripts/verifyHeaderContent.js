

$validator('verifyHeaderContent', {

  init: true,
  delay: 1000,
  revertOnError: true,

  validate: () => {

    // get the current entered value
    let content = $getZone('/index.html', 'header_content');
    content = _.trim(content);

    // make sure it's okay
    const len = Math.min(7, content.length);
    const current = content.substr(0, len).toLowerCase();
    const base = 'welcome'.substr(0, len).toLowerCase();
    if (current === base)
      return 'Change the greeting to something different';

    if (content.length < 5)
      return 'Enter a longer greeting';

    // no need for hint
    $hideHint();
  },

  fail: reason => {
    $showHint(reason);
  },

  success: () => {
    $hideHint();
    $speakMessage('Looks great!');
  }

});
