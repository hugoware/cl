
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

/** complex binding options for components
 * @typedef {Object} BindingOptions
 * @prop {Object} attr binds an attribute value
 * @prop {Object} css binds to class name
 */

/** UI binding options for children of a Component
 * @typedef {Object<string,BindingOptions>} UIBindingOptions
 */

/** Options for creating a new component
 * @typedef {Object} ComponentOptions
 * @prop {string} template the name of the template to create
 * @prop {string} selector the selector to match for this component
 * @prop {string} tag an HTML tag to use as an option
 * @prop {UIBindingOptions} ui binding options for selecting child layers
 */

/** @typedef {Object} LessonSlide
 * @prop {string} title a title to show, if any
 * @prop {string} subtitle a sub title to show, if any
 * @prop {string} type the kind of slide this is
 * @prop {boolean} isSlide is this a slide type
 * @prop {boolean} isQuestion is this a question type
 * @prop {boolean} isFirst is this the last slide in the deck
 * @prop {boolean} isLast is this the last slide in the deck
 * @prop {string} content the content for the slide
 */