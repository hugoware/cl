
/** @typedef {Object} Project
 * @prop {string} name
 * @prop {string} description
 * @prop {ProjectItem[]} children
 */

/** @typedef {Object} ProjectItem 
 * @prop {string} name
 * @prop {string} path
 * @prop {string} id
 * @prop {ProjectItem} parent
 * @prop {ProjectItem[]} [children]
 * @prop {boolean} isFile
 * @prop {boolean} isFolder
 * @prop {boolean} isEmpty
*/

/** basic console error
 * @typedef {Object} CompilerErrorMessage
 * @prop {string} message the error message
 * @prop {number} line the line the error took place on
 * @prop {number} column the column for the error message
 * @prop {string} path the full path of the compiled file
 * @prop {string} file the filename of the compiled file
 * @prop {string} [code] optional error code information
 */
