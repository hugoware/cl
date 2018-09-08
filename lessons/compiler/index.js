
import _ from 'lodash';
import $path from 'path';
import $fsx from 'fs-extra';
import $yml from 'js-yaml';
import $uglify from 'uglify-js';
import $dictionary from './dictionary';

// helper
const IS_PREVIEW = true;

// content importers
import processSlides from './lesson';
import processDefinitions from './definition';
import processSnippets from './snippet'; 

// reads content from a yml file
function readYml(target) {
	const path = `${root}/${target}`;
	const content = $fsx.readFileSync(path).toString();
	return $yml.load(content);
}

// reads content from a yml file
function readFile(name) {
	const path = $path.resolve(`./lessons/${name}`);
	return $fsx.readFileSync(path).toString();
}

// get basic info
const source = process.argv[2];
const id = _.snakeCase(source);
const root = $path.resolve(`./lessons/content/${source}`);
const dist = $path.resolve(`./src/resources/lessons/${id}`);
const snippets = $path.resolve(`${root}/snippets`);
const manifest = readYml('manifest.yml');
const zones = readYml('zones.yml');
const state = { dictionary: $dictionary };
const type = _.camelCase(source);

// get the template to use
let template = readFile('compiler/template.js');

// start processing each lesson file
let content = [];
for (const item of manifest.lesson) {
	const items = readYml(`${item}.yml`);
	content = content.concat(items);
}

// gather each item for processing
content = _.compact(content);
const definitions = _.filter(content, item => 'definition' in item);
const slides = _.filter(content, item => 'slide' in item || 'question' in item);

// process each category in order
processDefinitions(state, manifest, definitions);
processSnippets(state, manifest, snippets, zones, $fsx.readdirSync(snippets));
processSlides(state, manifest, slides);

// include all scripts
const scripts = [];
for (const file of $fsx.readdirSync(root)) {
	if (!/\.js$/.test(file)) continue;
	const script = readFile(`content/${source}/${file}`);
	scripts.push(script);
}

// make sure the destination is there
$fsx.ensureDirSync(dist);

// populate the template
template = template.replace(/\$LESSON_ID\$/g, id);
template = template.replace(/\$LESSON_TYPE\$/g, type);
template = template.replace(/\$SCRIPTS\$/g, scripts.join('\n\n'));
template = template.replace(/\$DATA\$/g, JSON.stringify(manifest, null, IS_PREVIEW ? 2 : null));

// create the final result
const result = IS_PREVIEW ? template: $uglify.minify(template).code;

// copy resources
console.log('writing content to', dist);
$fsx.ensureDirSync(dist);
$fsx.writeFileSync(`${dist}/index.js`, result);

// copy resources, if possible
console.log('checking for resource', `${root}/resources`);
if ($fsx.existsSync(`${root}/resources`))
  $fsx.copySync(`${root}/resources`, `${dist}/resources`);

// also copy this to the dist directory

// write the manifest summary
$fsx.writeFileSync(`${dist}/data.json`, JSON.stringify({
  name: manifest.name,
  description: manifest.description,
  type: manifest.type,
}));
	
// notify this is done
console.log('generated', id);
