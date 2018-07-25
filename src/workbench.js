import $config from './config';
import $database from './storage/database';

// import User from './models/user';

// testing
import { handleError } from './utils';
// import { resolveError } from './utils';
// import createProject, { CreateProjectData } from './actions/create-project';
// import updateProject, { UpdateProjectData } from './actions/update-project';
// import getProjectStructure from './queries/project-structure';
// import writeFile, { WriteFileOptions } from './actions/write-file';
// import createFolder, { CreateFolderOptions } from './actions/create-folder';
// import writeFile from './actions/write-file';
import compileFile from './actions/compile-file';
import compileProject from './actions/compile-project';


// handles running the test
async function run() {

	try {
		const result = await compileProject('mk1234', 'style.scss');
		console.log('finsie', result);
	}
	catch (err) {
		console.log(err);
	}


	// await writeFile('mk1234', 'main/new.txt', 'this is content');
	// await compile('mk1234', 'main/new.txt');

	// const success = await createFolder('mk1234', 'main/folder', { overwriteIfExists: true });
	// console.log('created', success);

	// try {

	// 	await writeFile('mk1234', 'new2.txt', 'this is the text', {
	// 		doNotCreateIfMissing: true
	// 	});
	// }
	// catch (err) {
	// 	handleError(err, {

	// 		file_not_found: () => console.log('file was not found'),
	// 		unknown: () => console.log('had a error')

	// 	});
	// }
	
	// try {

	// const data = await getProjectStructure('mk1234');
	// console.log(data);

		// const result = await updateProject({
		// 	id: 'fx7sow',
		// 	name: 'my project 2',
		// 	// description: 'my new desc'
		// })

	// 	console.log('finished update');
	// }
	// catch (err) {
	// 	err = resolveError(err);
	// 	console.log('err', err);
	// }

	// const result = await createProject({
	// 	ownerId: 'hugo',
	// 	type: 'web',
	// 	name: 'my project 2',
	// 	description: 'This is my cool new project'
	// });

	// console.log('result', result);

	// console.log('result', result);

	// await User.create({
	// 	first: 'Hugo',
	// 	last: 'Bonacci',
	// 	email: 'hugo@hugoware.net',
	// 	type: 'admin',
	// 	domain: 'codelab-coppell'
	// });

	// const project = getProject('mk1234');
	// const manifest = await project.getManifest();

	// console.log(manifest);
	
	try {

		// const project = await getProject('mk1234')
		// const manifest = await project.getManifest();

		// console.log('fill manu', manifest);

		// const exists = await $database.exists($database.projects, { name: 'my cool website 2' });
		// console.log('anything', exists);

		// const project = await getProject('bdgftm');
		// console.log('grabbed', project);
		// const project = await createProject(ProjectTypes.WEB, {
		// 	ownerId: 'babas',
		// 	name: 'my cool website',
		// 	description: 'something about my website'
		// });
		// console.log('created', project);

		// await project.write('/main/test.scss', '$main-color: blue; $alt-color: white;');
		// await project.write('/main.pug', 'html\n  body\n    include _header');
		// await project.write('/_header.pug', '#header #[h3 THIS IS NEW');
	}
	catch (err) {
		handleError(err, {
			unknown: () => console.log('none', err)
		});
	}

	// try {
	// 	await project.addFolder('/main/three');
	// 	await project.move('/main/three', '/main/four');
	// }
	// catch (err) {
	// 	handleError(err, {
	// 		'move-target-identical': () => console.log('destination same as source'),
	// 		'move-target-exists': () => console.log('already exists'),
	// 		'move-source-missing': () => console.log('source missing'),
	// 		'default': () => console.log('generic move error')
	// 	});
	// }

	// try {
	// 	await project.addFolder('/main/folder', true);
	// }
	// catch (err) {
	// 	handleError(err, {
	// 		'folder-already-exists': () => console.log('folder already exists'),
	// 		'folder-add-error': () => console.log('couldnt add folder'),
	// 		'default': () => console.log('generic error')
	// 	});
	// }

}

// runs the testbench
(async function() {

	//load the default conifg
	const path = require('path').resolve(process.argv[2]);
	await $config.init(path);

	// load the database when needed
	await $database.init();

	// run the work
	run();

	// just kill after 5 seconds since we're just testing code
	setTimeout(process.exit, 5000);
})();