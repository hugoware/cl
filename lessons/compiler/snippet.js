import _ from 'lodash';
import $path from 'path';
import $fsx from 'fs-extra';

const CONVERT = { 

  'js': 'javascript',
  'pug': 'jade',
  'htm': 'html',
  'ts': 'typescript',
  'py': 'python',

};

// extracts and creates all dictionary snippets
export default function processSnippets(state, manifest, relativeTo, ranges, snippets) {
	manifest.snippets = { };

  // read each file
  _.each(snippets, fileName => {
    if (/^\./.test(fileName)) return;

    // get the highlights
    var type = $path.extname(fileName).substr(1);
    type = CONVERT[type] || type;
    if (!type) return;

    const snippet = { };

    // check for the snippet base
    const key = fileName.replace(/\..*$/, '');
    // const zones = ranges[key] || { };

    // for now, warn of empty tags
    // if (!ranges[key])
    //   console.warn('missing highlight ranges for', fileName);

    // collect the content
    const path = $path.resolve(relativeTo, fileName);
    snippet.content = $fsx.readFileSync(path).toString();
    snippet.type = type;
    delete snippet.zones;
    // snippet.zones = zones;
    // snippet.line = zones.line;
    // delete zones.line;

    // save the snippet
    manifest.snippets[key] = snippet;

    // remove this from the main file
    // delete ranges[key];
  });
}