$define('verifyHeaderContent', { init: true }, () => {
  return $validate(() => {

    // get the current entered value
    let content = $getZone('/index.html', 'header_content');
    content = _.trim(content);

    // make sure it's okay
    if (/^welcome/i.test(content)) {
      $showHint('Change the greeting to something different')
      return false;
    }

    if (content.length < 5) {
      $showHint('Enter a longer greeting');
      return false;
    }

    $hideHint();
    $speakMessage('Looks great!');

  });
});