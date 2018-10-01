
// checks that they've added enough list items to a zone
$define('verifyHasEnoughListItems', { init: true }, () => {
  
  const requiredItems = 5;
  const minimumLength = 3;

  // tracking item count
  let totalItems = 0;
  let totalListItems = 0;

  // make sure there's a valid zone
  return $validate(() => {

    let zone = $getZone('/index.html', 'ul_content', true);
    if (!zone) {
      $showHint('Fix the HTML errors to continue');
      return false;
    }

    // check how many items are listed
    let hasEmptyItem;
    let hasShortItem;

    // check each list item
    zone.children()
      .each((index, node) => {
        totalItems++;

        // not a list item
        if (!/^li$/i.test(node.tagName)) return;
        totalListItems++;

        // check the contents
        const item = $html(node);
        const text = _.trim(item.text());
        if (text.length === 0) hasEmptyItem = true;
        if (text.length < minimumLength) hasShortItem = true;
      });

    // update the message, if needed
    if (totalListItems < requiredItems) {
      const remaining = requiredItems - totalListItems;
      const plural = remaining > 1 ? 's' : '';
      $showHint(`Enter ${remaining} more list item${plural}`);
      return false;
    }

    // check for other conditions
    if (hasEmptyItem) {
      $showHint(`Add content to each list item`);
      return false;
    }

    if (hasShortItem) {
      $showHint(`Add at least ${minimumLength} characters per list item`);
      return false;
    }


    // must only be list items
    if (totalItems !== requiredItems) {
      $showHint(`Only use list items in this example`);
      return false;
    }

    // remove list items
    zone.children('li').remove();

    // check the remaining text
    const text = _.trim(zone.html());
    if (_.some(text)) {
      $showHint('Only use `li` tags. Do not include any extra text');
      return false;
    }

    // passed validation
    $hideHint();
    $speakMessage('Looks great! You can move onto the next step now');
  });
});