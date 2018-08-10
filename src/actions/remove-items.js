
import { simplifyPathCollection } from '../utils/project';

/** Handles removing a file at the provided path
 * @param {string|string[]} items The items that should be removed
 */
export default async function removeItems(items) {

	items = simplifyPathCollection(items);
	console.log('will remove', items);

	// const target = this.resolvePath(path);

	// // can't remove when it doesn't exist
	// const exists = await $fsx.pathExists(target);
	// if (!exists)
	// 	throw 'remove-not-found';

	// // delete the file
	// try {
	// 	await $fsx.remove(path);
	// }
	// catch (e) {
	// 	throw 'remove-error';
	// }

	return Promise.resolve();
}