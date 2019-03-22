const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yml = require('js-yaml');
const exec = require('child_process').exec;

const location = path.resolve(__dirname + '/../lessons/index.yml')
const lessons = yml.load(fs.readFileSync(location));
const all = _(lessons).map().flatten().value();

let index = 0;

function compile() {
	const name = all[index++];
	if (!name) return;

	const cmd = `npm run compile-lesson -- ${name}`;
	console.log(`compiling: ${name}`);
	
	const run = exec(cmd);

	run.stdout.on('data', function (data) {
	  console.log(data.toString());
	});

	run.stderr.on('data', function (data) {
	  console.log(`error ${name}: ${data.toString()}`);
	});

	run.on('exit', function (code) {
		console.log(`finished: ${name} [status: ${code}]`);
		compile();
	});
}

// start
compile();