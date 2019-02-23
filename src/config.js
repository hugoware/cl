
import $fsx from 'fs-extra';
import $path from 'path';
import $yaml from 'js-yaml';

/**
 * @property {string} root The root of the application directory
 */
class Config {

	/**
	 * Handles loading the app configuration file
	 * @param {string} path the path to the config file to load
	 */
	async init(path) {
		const content = await $fsx.readFile(path);
		this.data = $yaml.load(content.toString());

		// save a few extra values
		this.root = $path.resolve('./');
		return true;
	}
	
	/** @returns {string} key for recording speech */
	get azureSubscriptionKey() { return this.data.azure_subscription_key; }

	/** @returns {string} the web client ID for google auth */
	get googleWebclientId() { return this.data.google_webclient_id; }
	
	/** @returns {string} the secret to use for sessions */
	get sessionSecret() { return this.data.session_secret; }

	/** @returns {number} the web server port number */
	get httpPort() { return this.data.http_port; }

	/** @returns {number} the database port number */
	get databasePort() { return this.data.database_port; }

	/** @returns {string} the directory where all lesson files are found */
	get lessonDirectory() { return this.data.lesson_directory; }

	/** @returns {string} the storage location for temp files */
	get cacheDirectory() { return this.data.cache_directory; }

	/** @returns {string} the storage location for data files */
	get dataDirectory() { return this.data.data_directory; }

	/** @returns {boolean} is this mode in production */
	get isProduction() {
		return /prod(uction)?/i.test(this.data.mode);
	}

	/** @returns {boolean} is this mode in production */
	get isDevelopment() {
		return !this.isProduction;
	}

}

export default new Config();