var ALLOW_PROCESSING = true;
var ALLOW_COMPRESS = true;

// includes
var _ = require('lodash');
var $cheerio = require('cheerio');
var $fs = require('fs');
var $path = require('path');
var $exec = require('child_process').exec;

// process each one
function process() { 
  
  // seting purposes, exit before processing
  if (!ALLOW_PROCESSING)
    return finalize();

  // update svgs
  var hasChanges;
  var path = $path.resolve('./src/icons/');
  var files = $fs.readdirSync(path);
  _.each(files, id => {

    // only SVG files
    if (!_.endsWith(id, '.svg')) return;
    var alias = id.substr(0, id.length - 4);

    // read the file content
    var file = `${path}/${id}`;
    var data = $fs.readFileSync(file);
    var content = data.toString();

    // if already finished, skip it
    if (/cl\-svg/.test(content)) return;

    // since it needs to be processed, do it now
    console.log(`updating ${file}`);

    // load the content
    hasChanges = true;
    var node = $cheerio.load(content);

    // remove
    node('svg').attr('cl-svg', +new Date);
    node('title').remove();
    node('desc').remove();
    node('svg').attr('xlink', null);
    node('svg').attr('version', null);
    node('svg')
      .contents()
      .filter(function() { return this.type === 'comment'; })
      .remove();

    node('*').each((index, ref) => {
      if (!ref.attribs) return;

      // check for an ID
      if (ref.attribs.id)
        ref.attribs.id = ref.attribs.id.replace(/^[^\-]+\-/, function(match) {
          return `${alias}-${match}`
        });

      // check for an href
      if (ref.attribs.href) {
        ref.attribs.href = ref.attribs.href.replace(/\#[^\-]+\-/, function(match) {
          return `#${alias}-${match.substr(1)}`;
        });
      }

      // check for an href
      if (ref.attribs.fill) {
        ref.attribs.fill = ref.attribs.fill.replace(/\#[^\-]+\-/, function(match) {
          return `#${alias}-${match.substr(1)}`;
        });
      }
    });

    var result = node('body').html();

    // remove whitespace
    if (ALLOW_COMPRESS) {
      result = result.replace(/(\t|\n)/g, '');
      result = result.replace(/\s+/g, ' ');
      result = result.replace(/\>\s\<+/g, '><');
    }

    // write out the content
    $fs.writeFileSync(file, result);  
  });

  // when finished, compile icons
  if (hasChanges)
    setTimeout(finalize, 1000);
}

// finish the process
function finalize() {
  var icons = $path.resolve('./src/client/app/icons.js');
  $exec(`touch ${icons}`);
}

// wait before starting
setTimeout(process, 2000);