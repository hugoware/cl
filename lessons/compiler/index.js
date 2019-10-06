
import _ from 'lodash';
import $path from 'path';
import $fsx from 'fs-extra';
import $yml from 'js-yaml';
import $uglify from 'uglify-js';
import $browserify from 'browserify';
import { exec as $exec } from 'child_process';
import * as $babel from 'babel-core';
import $dictionary from './dictionary';

// helper
const IS_PREVIEW = true;

// content importers
import processSlides from './lesson';
import processResources from './resources';
import processDefinitions from './definition';
import processSnippets from './snippet'; 
// import processZones from './zones'; 

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
const tempDir = $path.resolve('./.compile');
const root = $path.resolve(`./lessons/content/${source}`);
const scriptDirectory = `${root}/scripts`;
const dist = $path.resolve(`./.lessons/${id}`);
const deployTo = $path.resolve(`./lessons/output/${id}`);
const snippets = $path.resolve(`${root}/snippets`);
const manifest = readYml('manifest.yml');
// const zones = readYml('zones.yml');
const state = { dictionary: $dictionary };
const type = _.camelCase(source);

// delete the target directory
$fsx.removeSync(dist);

// get the template to use
let template = readFile('compiler/template.js');

// fix the zone keys
// for (const id in zones) {
//   const value = zones[id];
//   delete zones[id];
//   zones[id.replace(/\./, '$')] = value;
// }

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

// make the temp directory
$fsx.ensureDirSync(tempDir);
$fsx.emptyDirSync(tempDir);

// copy helpers
_.each(['utils', 'lib'], key => {
	const source = $path.resolve(`./lessons/compiler/imports/${key}.js`);
	const target = `${tempDir}/${key}.js`;
	$fsx.copySync(source, target);
});

const controllerSource = $path.resolve(`./lessons/compiler/controllers`);
const controllerTarget = $path.resolve(`${tempDir}/controllers`);
$fsx.copySync(controllerSource, controllerTarget);

// include all scripts
manifest.defs = { };
const scripts = [];
for (const file of $fsx.readdirSync(scriptDirectory)) {
	if (!/\.js$/.test(file)) continue;
	const scriptSource = `${scriptDirectory}/${file}`;

	const content = $fsx.readFileSync(scriptSource).toString();
	const defs = content.match(/\[define ?[^( |\])]+/g);
	_.each(defs, match => {
		const key = _.trim(match.substr(7));
		manifest.defs[key] = true;
	});

	$fsx.copySync(scriptSource, `${tempDir}/${file}`);
	scripts.push(file);
}


// process each category in order
if ($fsx.existsSync(snippets))
	processSnippets(state, manifest, snippets, [ ], $fsx.readdirSync(snippets));

if ($fsx.existsSync(`${root}/resources`))
	processResources(state, manifest, root);
	
processSlides(state, manifest, slides);
processDefinitions(state, manifest, definitions);

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
// processZones(manifest, manifest.zones, `${dist}/files`);

// populate the template
template = template.replace(/\$LESSON_ID\$/g, id);
template = template.replace(/\$LESSON_TYPE\$/g, type);
template = template.replace(/\$DATA\$/g, JSON.stringify(manifest, null, IS_PREVIEW ? 2 : null));

// import each script
template = template.replace(/\$IMPORTS\$/g, _.map(scripts, script => {
	script = script.replace(/\.js$/, '');
	return `import * as ${script} from './${script}';`;
}).join('\n'));

// setup references for each import
template = template.replace(/\$REFS\$/g, _.map(scripts, script => {
	return script.replace(/\.js$/, '');
}).join(', '));

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
$fsx.writeFileSync(`${tempDir}/index.js`, result);

// write the manifest summary
$fsx.writeFileSync(`${dist}/data.json`, JSON.stringify({
  name: manifest.name,
  description: manifest.description,
  type: manifest.type,
}));

$browserify('.compile/index.js')
  .transform('babelify', {
  	presets: ['es2015'],
  	plugins: [ 'transform-class-properties', 'async-to-promises' ],
  })
  .bundle()
  .on('end', () => {
		setTimeout(() => {
			console.log(`generated: ${deployTo}`);
			$fsx.moveSync(dist, deployTo, { overwrite: true });
		}, 3000);
  })
  .pipe($fsx.createWriteStream(`${dist}/index.js`));

  
// notify this is done
// console.log('generated', JSON.stringify(manifest, null, 2));
