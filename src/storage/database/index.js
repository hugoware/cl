import log from '../../log';
import { MongoClient as $client, Collection } from 'mongodb';
import $config from '../../config';
import { uniqueId } from '../../utils';

// default mongo ports
const DEFAULT_PORT = 27017;
const MAX_ID_GENERATION_ATTEMPTS = 10;

class Database {

	// handles loading the database
	async init() {

		// connect to the database
		const port = $config.databasePort || DEFAULT_PORT;
		const url = `mongodb://localhost:${port}/codelab`;
		this.connection = await $client.connect(url);

		// setup collections
		this.db = this.connection.db('codelab');
		this.users = this.db.collection('users');
		this.accounts = this.db.collection('accounts');
		this.projects = this.db.collection('projects');
		this.progress = this.db.collection('progress');

		// console.log($config.port);
		return Promise.resolve(true);
	}

	/** checks a collection if a query has any matches
	 * @param {Collection} collection the collection to search
	 * @param {object} query the query to match against
	 */
	async exists(collection, query) {
		const exists = await collection.find(query)
			.project({ })
			.limit(1)
			.toArray();

		return exists.length > 0;
	}

	/** Finds a unique ID number
	 * @param {Collection} collection The database collection to search
	 * @param {number} length The length of the ID to create
	 * @returns {string} the generated ID
	 */
	async generateId(collection, length) {
		for (let i = 0; i < MAX_ID_GENERATION_ATTEMPTS; i++) {

			// generate the ID
			const id = uniqueId(length);
			const existing = collection.find({ id }, { id: 1 })
				.project({ id: 1 })
				.limit(1)
				.toArray()
				.length > 0;

			// if it's unique, return it
			if (!existing)
				return id;
		}

		// failed to create
		log.exception('storage/database.js', 'id_generation_error');
		throw 'id_generation_error';
	}

}

// create the database instance
export default new Database;