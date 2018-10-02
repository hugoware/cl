
// checks that they've added enough list items to a zone
$define('verifyFileUploadIsImage', data => {
  return $validate({ revertOnError: false }, () => {
    const { files } = data;

    // didn't work for some reason
    if (!_.isArray(files))
      return false;

    // make sure it's valid
    if (files.length !== 1) {
      $speakMessage("For now, just upload a single image file to continue");
      return false;
    }

    // get the data
    const file = files[0] || { };

    // make sure it's an image
    if (!/(png|jpe?g|gif)$/.test(file.name)) {
      $speakMessage("Only upload image files at this time. Try `png`, `jpg` or `gif` files");
      return false;
    }

    // wait for the file to upload
    $self.waitingForFile = file.name;

  });
});