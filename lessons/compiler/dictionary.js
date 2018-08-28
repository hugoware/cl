import _ from 'lodash';
import $path from 'path';
import $fsx from 'fs-extra';
import $yml from 'js-yaml';

// get the shared dictionaries
const source = $path.resolve('./lessons/dictionary');
const files = $fsx.readdirSync(source);

// read in each definition
for (const file of files) {
	if (!/\.yml$/.test(file)) continue;

	// apply each value
	const content = $fsx.readFileSync(`${source}/${file}`).toString();
	const parsed = $yml.load(content);
	_.each(parsed, item => {

		// if this was already imported, I have a problem
		if (module.exports[item.id])
			throw `duplicate dictionary item: ${item.id}`;

		module.exports[item.id] = item;
	});
}
