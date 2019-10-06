import _ from 'lodash';
import $config from './config';
import $server from './server';
import $database from './storage/database';
import $lessons from './storage/lessons';
import $fileDefaults from './file-defaults';
import $path from './path';
import { resolveError } from './utils';
import Schedule from './schedule'

// initializes the app
async function init() {
	try {

		// load the configuration
		const path = $path.resolve(process.argv[2]);
		await $config.init(path);

		// config help
		console.log(`[resolve] audit log @ ${$path.resolveLog()}`);
		console.log(`[resolve] data storage @ ${$path.resolveData()}`);
		console.log(`[resolve] lessons @ ${$path.resolveLesson()}`);
		console.log(`[resolve] database @ :${$config.databasePort || 'default port'}`);
		
		// starts the database
		await $database.init();
		
		// preload lesson content
		await $lessons.init();

		// prepare the schedule
		await Schedule.init();
		
		// preload file content
		await $fileDefaults.init();
		
		// loads the server config
		await $server.init();
	}
	// handle an errors
	catch(err) {
		err = resolveError(err);
		console.log('err', err);
	}
}

// start the app
init();