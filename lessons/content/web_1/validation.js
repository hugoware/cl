
// export const init = true;

// export default function verifyHasMultipleListItems() {
//   let zone;
//   const requiredItems = 5;
//   const minimumLength = 3;

//   return $validate(

//     // make sure there's a valid zone
//     () => {
//       zone = $getZone('/index.html', 'ul_content', true);
//       if (!zone) {
//         $showHint('Fix the HTML errors to continue');
//         return false;
//       }
//     },

//     // check how many items are listed
//     () => {

//       let totalItems = 0;
//       let hasEmptyItem;
//       let hasShortItem;

//       // check each list item
//       zone('li').each((index, node) => {
//         totalItems++;

//         // check the contents
//         const item = $html(node);
//         const text = _.trim(item.text());
//         if (text.length === 0) hasEmptyItem = true;
//         if (text.length < minimumLength) hasShortItem = true;
//       });

//       // update the message, if needed
//       if (totalItems < requiredItems) {
//         const remaining = requiredItems - totalItems;
//         const plural = remaining > 1 ? 's' : '';
//         $showHint(`Enter ${remaining} more list item${plural}`);
//         return false;
//       }

//       // check for other conditions
//       if (hasEmptyItem) {
//         $showHint(`Add content to each list item`);
//         return false;
//       }

//       if (hasShortItem) {
//         $showHint(`Add at least ${minimumLength} characters per list item`);
//         return false;
//       }
//     },

//     // passed validation
//     () => {
//       $hideHint();
//       $speakMessage('Looks great! You can move onto the next step now');
//     }

//   );
// }

// // export function init() {
// //   verifyHasMultipleListItems();
// // }


// // this.allowOpenIndexHtml = file => {
// //   console.log('checking for index.html', file);
// //   // state.allowFile = true;

// //   const allow = file.path === '/index.html';


  
// //   if (!allow) {
// //     $deny("Can't Open This File", 'Open the index.html file to continue the lesson');
// //     $speak('Whoops! You can not do that just yet!\n\nMake sure to open`index.html` to continue the lesson.', 'surprised');
// //   }
// //   else {
// //     $state.openedIndex = true;
// //   }


// //   return allow;
  
// //   // assistant.speak(`Whoops! You can't open that file just yet - Make sure to open \`index.html\``);

// // }

// // this.didOpenMainCSS = file => {


// // }


// // this.onBeforeSlideChange = () => {
	

// // }

// // this.onAfterSlideChange = () => {

// // }


// // check they've added enough messages
// this.verifyHasMultipleListItems = () => {
  

// };

// // this.verifyHasMultipleListItems.init = this.verifyHasMultipleListItems;


// // this.verifyFileToDelete = (items) => {

// //   // can delete index
// //   if (_.size(items) === 1 && items[0] === '/index.html')
// //     return true;

// //   console.log('trying to delete', items);

// //   $deny("Can't Delete This File", 'You can only delete the new.pug file');
// //   $speak("Nope! Can't delete that file yet", 'sad')
// //   return false;
// // }

// // this.verifyHtmlEditResult = () => {
// //   $state.hello = true
// // 	console.log('got this', this.state);
// // }