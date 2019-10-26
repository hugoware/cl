
import $fsx from 'fs-extra';
import $path from 'path';
import $yaml from 'js-yaml';
import $chargebee from 'chargebee';

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

		// other configs
		$chargebee.configure({
			site: this.chargebeeApiTarget,
			api_key: this.chargebeeApiKey
		});

		// save a few extra values
		this.root = $path.resolve('./');
		console.log(`[config] active root @ ${this.root}`);
		return true;
	}

	get DEMO_PROJECTS() {
		return ['demo', 'web_demo', 'code_demo'];
	}

	/** @return {string} the SSL key */
	get sslKey() { return this.data.ssl_key; }

	/** @return {string} the SSL certificate */
	get sslCert() { return this.data.ssl_cert; }

	/** @return {string} the SSL certificate authority */
	get sslCA() { return this.data.ssl_ca; }
	
	/** @returns {string} key for accessing chargebee */
	get chargebeeApiKey() { return this.data.chargebee_api_key; }
	
	/** @returns {string} key for accessing which chargebee database */
	get chargebeeApiTarget() { return this.data.chargebee_api_target; }
	
	/** @returns {string} key for accessing clicksend */
	get clicksendApiKey() { return this.data.clicksend_api_key; }
	
	/** @returns {string} username for accessing clicksend */
	get clicksendUsername() { return this.data.clicksend_username; }

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
	
	/** @returns {number} the username to connect to the database */
	get databaseUsername() { return this.data.database_username; }
	
	/** @returns {number} the password to connect to the database */
	get databasePassword() { return this.data.database_password; }

	/** @returns {string} the directory to save audit information */
	get auditLog() { return this.data.audit_log; }

	/** @returns {string} the directory the list of lessons is found */
	get lessonManifest() { return this.data.lesson_manifest; }

	/** @returns {string} the directory where all lesson files are found */
	get lessonDirectory() { return this.data.lesson_directory; }

	/** @returns {string} the directory where the audio files are found */
	get audioDirectory() { return this.data.audio_directory; }

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