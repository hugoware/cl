
// checks that they've added enough list items to a zone
$define('verifyUploadImageSuccess', result => {
  return $validate({ revertOnError: false }, () => {

    // make sure it's for the correct file
    if ($self.waitingForFile !== result.file.name)
      return false;

    // failed to upload for some reason
    if (!result.success) {
      $speakMessage("Seems like something went wrong uploading your file. Go ahead and try again", 'sad');
      return false;
    }

    // difficult to type name
    if (/ /g.test($self.waitingForFile))
      $speakMessage("It's sometimes difficult to work with a file name that has spaces in it. Consider uploading a new file without spaces in the name.", 'sad');

    // very long name
    else if (_.size($self.waitingForFile) > 20)
      $speakMessage("That's a fairly long file name. You might consider uploading an image with a shorter name to make it easier to type in.", 'sad');

    // looks good
    else
      $speakMessage("Perfect! Let's add this image to our web page!", 'happy');

    // it worked, so let's move on
    $state.uploadedFileName = $self.waitingForFile;
    delete $self.waitingForFile;
  });
});