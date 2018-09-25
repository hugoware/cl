
import _ from 'lodash';
import $database from '../storage/database';
import format from '../formatters';
import $cache from '../cache';
import projectValidator from '../validators/project';

/** handles updating the progress for a lesson
 * @param {string} id the project ID to find
 * @param {object} data project information to replace
 */
export default async function editProject(id, data) {
	return new Promise(async (resolve, reject) => {

		// format the data first
		const name = format.toName(data.name);
		const description = format.removeExtraSpaces(data.description);
		const domain = _.trim(data.domain);

		// perform basic validation
		const errors = {};
		projectValidator.validateName(name, errors);
		projectValidator.validateDescription(description, errors);
		
		// // check for a domain
		// if (_.some(domain))
		// 	await projectValidator.validateDomain(domain, errors);

		// if there were any data errors, stop now
		if (errors.hasErrors)
			return reject({ success: false, errors });

		// if there's a domain, we need to adjust some stuff

		// we also need to clear the cache entry
		$cache.projects.remove(id);

		// update the data
		await $database.projects.update({ id }, {
			$set: { name, description, domain }
		});

		resolve({ success: true });

	});
}
