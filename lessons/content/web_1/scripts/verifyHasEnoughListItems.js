
// checks that they've added enough list items to a zone
$define('verifyHasEnoughListItems', { init: true }, () => {
  let zone;
  const requiredItems = 5;
  const minimumLength = 3;

  return $validate(

    // make sure there's a valid zone
    () => {
      zone = $getZone('/index.html', 'ul_content', true);
      if (!zone) {
        $showHint('Fix the HTML errors to continue');
        return false;
      }
    },

    // check how many items are listed
    () => {

      let totalItems = 0;
      let hasEmptyItem;
      let hasShortItem;

      // check each list item
      zone('li').each((index, node) => {
        totalItems++;

        // check the contents
        const item = $html(node);
        const text = _.trim(item.text());
        if (text.length === 0) hasEmptyItem = true;
        if (text.length < minimumLength) hasShortItem = true;
      });

      // update the message, if needed
      if (totalItems < requiredItems) {
        const remaining = requiredItems - totalItems;
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
    },

    // passed validation
    () => {
      $hideHint();
      $speakMessage('Looks great! You can move onto the next step now');
    }

  );
});