const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const yml = require('js-yaml');
const exec = require('child_process').exec;

const location = path.resolve(__dirname + '/../lessons/index.yml')
const lessons = yml.load(fs.readFileSync(location));

const all = _(lessons).map().flatten().value();
_.each(all, name => {
	const cmd = `npm run compile-lesson -- ${name}`;
	exec(cmd);
});

