import _ from 'lodash';
import $path from '../../path';
import $fsx from 'fs-extra';

export default class LessonTemplate {

	constructor(id) {
		this.id = id;
		const path = $path.resolveLesson(`${id}/data.json`);
		const content = $fsx.readFileSync(path).toString();
		_.assign(this, JSON.parse(content));
	}

	// /** creates a new lesson record for a user */
	// createRecord = async (userId, lessonId) => {

	// }

	// /** resets the resources in the project directory
	//  * @param {string} id the directory ID to overwrite - otherwise, the ID is generated
	//  */
	// resetProjectDirectory = async id => {

	// }

}