
/** @typedef {Object} MoveItemsOptions
 * @prop {boolean} [overwrite] allow overwriting of items in the same target location 
 */

/** Handles moving a file from one location to another
 * @param {string|string[]} items The files or folders to move
 * @param {string} to The folder to move to
 * @param {MoveItemsOptions} [options] Options for moving files
 */
export default async function moveItems(items, to, overwriteFiles) {
	return Promise.resolve(true);
	// if (path === to)
	// 	throw 'move-target-identical';

	// // make sure the source exists
	// const source = this.resolvePath(path);
	// const sourceExists = await $fsx.pathExists(source);
	// if (!sourceExists)
	// 	throw 'move-source-missing';

	// // check the target next
	// const target = this.resolvePath(to);
	// if (!overwriteFiles) {
	// 	const targetExists = await $fsx.pathExists(target);
	// 	if (targetExists)
	// 		throw 'move-target-exists';
	// }

	// // try and move
	// try {
	// 	await $fsx.move(source, target);
	// }
	// // handle general errors
	// catch(err) {
	// 	throw 'move-error';
	// }

	// return Promise.resolve();
}