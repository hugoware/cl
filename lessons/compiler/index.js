
import _ from 'lodash';
import $path from 'path';
import $fsx from 'fs-extra';
import $yml from 'js-yaml';
import $uglify from 'uglify-js';
import * as $babel from 'babel-core';
import $dictionary from './dictionary';

// helper
const IS_PREVIEW = true;

// content importers
import processSlides from './lesson';
import processDefinitions from './definition';
import processSnippets from './snippet'; 
import processZones from './zones'; 

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
const scriptDirectory = `${root}/scripts`;
const dist = $path.resolve(`./lessons/output/${id}`);
const snippets = $path.resolve(`${root}/snippets`);
const manifest = readYml('manifest.yml');
const zones = readYml('zones.yml');
const state = { dictionary: $dictionary };
const type = _.camelCase(source);

// get the template to use
let template = readFile('compiler/template.js');

// fix the zone keys
for (const id in zones) {
  const value = zones[id];
  delete zones[id];
  zones[id.replace(/\./, '$')] = value;
}

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
manifest.zones = zones;

// include all scripts
const scripts = [];
for (const file of $fsx.readdirSync(scriptDirectory)) {
	if (!/\.js$/.test(file)) continue;
	const script = $fsx.readFileSync($path.resolve(scriptDirectory, file)).toString();
	scripts.push(script);
}

// make sure the destination is there
$fsx.ensureDirSync(dist);

// copy resources, if possible
console.log('copy resources', `${root}/resources`);
if ($fsx.existsSync(`${root}/resources`))
  $fsx.copySync(`${root}/resources`, `${dist}/resources`);

// copy files, if possible
console.log('copy files', `${root}/files`);
if ($fsx.existsSync(`${root}/files`))
  $fsx.copySync(`${root}/files`, `${dist}/files`);

// process the zone data which includes copying
// collapsed content and modifying files
processZones(manifest, manifest.zones, `${dist}/files`);

// populate the template
template = template.replace(/\$LESSON_ID\$/g, id);
template = template.replace(/\$LESSON_TYPE\$/g, type);
template = template.replace(/\$SCRIPTS\$/g, scripts.join('\n\n'));
template = template.replace(/\$DATA\$/g, JSON.stringify(manifest, null, IS_PREVIEW ? 2 : null));

// create the final result
const transformed = $babel.transform(template, {
  presets: [ 'ES2015' ]
});

// failing to compile
if (!transformed.code)
  throw 'failed to compile code files';

// compress
let result;
if (IS_PREVIEW) {
  result = transformed.code;
}
else {
  const min = $uglify.minify(transformed.code);
  if (!min.code)
    throw 'failed to minify code';
  result = min.code;
}

// copy resources
$fsx.ensureDirSync(dist);
$fsx.writeFileSync(`${dist}/index.js`, result);

// write the manifest summary
$fsx.writeFileSync(`${dist}/data.json`, JSON.stringify({
  name: manifest.name,
  description: manifest.description,
  type: manifest.type,
}));
  
// notify this is done
console.log('generated', JSON.stringify(manifest, null, 2));
