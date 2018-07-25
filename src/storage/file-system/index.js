
import $path from 'path';
import $fsx from 'fs-extra';

/** Recursively searches for files
 * @param {string} directory The directory to begin the search from
 * @param {string[]} filter extensions to filter search results by
 */
export async function find(directory, filter, options) {
  const matches = [];
  const len = directory.length;
  
  // recursively searches directories
  function recursiveSearch(path) {
    const entries = $fsx.readdirSync(path);

    // check for additional filtering
    if (options && options.exclude && options.exclude(path))
      return;

    // check each item in the directory
    for (let i in entries) {
      const item = $path.join(path, entries[i]);      
      if ($fsx.statSync(item).isFile()) {

        // if checking for types and not a match, skip it
        if (filter && filter.indexOf($path.extname(item)) < 0) continue;
        matches.push(item.substr(len));
      }
      // sub directory, continue searching
      else if ($fsx.statSync(item).isDirectory()) {
       recursiveSearch(item);
      }
    }
  }

  // recursively search
  recursiveSearch(directory);
  return Promise.resolve(matches);
}

export default {
	find
};