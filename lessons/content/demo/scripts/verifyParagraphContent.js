

$validator('verifyParagraphContent', {

  init: true,
  delay: 1000,
  revertOnError: true,

  hideHintOnSuccess: true,

  validate: () => {
    const REQUIRED_LINE_COUNT = 5;

    // container for hints
    const hint = [ ];

    // get the current entered value
    const content = $getZone('/index.html', 'paragraph_element', { asDom: true });

    // make sure they're only using text
    if (!content) {
      $hideHint();
      return $noop;
    }

    // make sure they're only using text
    const children = content.children('*');
    if (children.length !== 1)
      return 'Only use text lines in this example';

    // check for of the line data
    const lines = _.trim(content.text()).split(/\n/g);
    const tooShort = [ ];
    _.each(lines, (line, i) => {
      if (_.trim(line).length < 5)
        tooShort.push(i + 1);
    });

    // there was some problems with the lines
    if (tooShort.length > 0)
      hint.push(`Add more characters to ${$plural(tooShort.length, 'line')} ${$oxford(tooShort, 'and')}`);

    // make sure there are enough lines
    const more = REQUIRED_LINE_COUNT - lines.length;
    if (more > 0)
      hint.push(`Add ${more} more ${$plural(more, 'line')}`);

    console.log('hint', hint);

    // if there's any messages, return them
    if (hint.length !== 0)
      return hint.join('\n\n');


  },

  fail: reason => {
    $showHint(reason);
  },

  success: () => {
    $hideHint();
    $speakMessage('Looks great!');
  }

});
