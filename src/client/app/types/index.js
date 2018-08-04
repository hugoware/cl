
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

/** @typedef {Object} ProjectError
 * @prop {string} file the file that had the error
 * @prop {string} message the full error message
 * @prop {number} line the line number of the error
 * @prop {number} column the column of the error message
 * @prop {string} [code] optional error code info
 * @prop {string} [hint] optional info about the error
 */

 /** @typedef {Object} ProjectErrorState
	* @prop {boolean} success did this compile successfully
	* @prop {ProjectError} error the most recent error thrown
  * @prop {Object<string, ProjectError>} all all pending compiler errors
  */