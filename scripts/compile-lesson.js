
import { spawn } from 'child_process';
import $chokidar from 'chokidar';
import $path from 'path';
const path = $path.resolve(__dirname, '../lessons/content/**/*')
console.log(path);

// Initialize watcher.
const $watcher = $chokidar.watch(path, {
  // ignored: /(^|[\/\\])\../,
  depth: 5,
  persistent: true
});

// // Something to use when events are received.
// var log = console.log.bind(console);
// // Add event listeners.
// $watcher
//   .on('add', path => log(`File ${path} has been added`))
//   .on('change', path => log(`File ${path} has been changed`))
//   .on('unlink', path => log(`File ${path} has been removed`));

// // More possible events.
// $watcher
//   .on('addDir', path => log(`Directory ${path} has been added`))
//   .on('unlinkDir', path => log(`Directory ${path} has been removed`))
//   .on('error', error => log(`Watcher error: ${error}`))
//   .on('ready', () => log('Initial scan complete. Ready for changes'))
//   .on('raw', (event, path, details) => {
//     log('Raw event info:', event, path, details);
//   });

// 'add', 'addDir' and 'change' events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats

let $ready;
function compile(path) {
  if (!$ready) return;

  // get the path name
  const find = 'lessons/content/';
  const index = path.indexOf(find);
  const section = path.substr(find.length + index);
  const id = section.substr(0, section.indexOf('/'));
  const args = `run compile-lesson -- ${id}`;

  console.log('compile:', id);
  spawn('npm', args.split(' '), {
    stdio: [ process.stdin, process.stdout, process.stderr ]
  });
}

// kick off compilling
$watcher.on('change', compile)
  .on('add', compile)
  .on('addDir', compile)
  .on('unlink', compile)
  .on('unlinkDir', compile)
  .on('ready', () => $ready = true);