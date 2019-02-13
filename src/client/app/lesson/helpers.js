
// // performs a test and allows the action of the
// // file requested matches
// export function allowIfFile([ expected, reason ], [ file ]) {
// 	return this.$validate({ revertOnError: false }, () => {

// 		const match = file.path === expected;
// 		if (!match) {
// 			expected = expected.replace(/^\//, '');

// 			// check for a reson to hep
// 			if (reason === 'open-file')
// 				this.$speakMessage(`You can't open that file just yet. Open the \`${expected}\` file by double-clicking on it.`);

// 			// won't allow the open
// 			return false;
// 		}
		
// 	});
// }