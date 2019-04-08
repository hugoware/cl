import _ from 'lodash';
import log from '../log';
import $database from '../storage/database';

/**
 * gets all project information
 * @param {string} phrase the ID for the project
 * @returns {object} general user data
 */
export default async function findUser(phrase) {
	return new Promise(async (resolve, reject) => {

		// check that they searched for something
		phrase = _.trim(phrase);
		if (_.size(phrase) <= 0)
			return reject('search phrase required');

		// handle finding a user
		const search = _.escapeRegExp(phrase);
		const $regex = new RegExp(search, 'gi');
		const query = {
			$or: [
				{ email: { $regex } },
				{ first: { $regex } },
				{ last: { $regex } },
			]
		};

		const results = await $database.users.find(query)
			.project({
				_id: 0,
				id: 1,
				first: 1,
				last: 1,
				email: 1,
				lastLoginAt: 1,
				disabled: 1,
			})
			.toArray();

		// give back the user list
		resolve({ success: true, results });
	})
		.catch(err => {
			log.ex('queries/find-user.js', err);
			reject('server_error');
		});
}
