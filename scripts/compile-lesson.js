
import { spawn } from 'child_process';
import $chokidar from 'chokidar';
import $path from 'path';
const path = $path.resolve(__dirname, '../lessons/content/**/*')
console.log('watching for lessons:', path);

// Initialize watcher.
const $watcher = $chokidar.watch(path, {
  depth: 5,
  persistent: true
});

let $ready;
let $pending;
function compile(path) {
  if (!$ready) return;

  // get the path name
  const find = 'lessons/content/';
  const index = path.indexOf(find);
  const section = path.substr(find.length + index);
  const id = section.substr(0, section.indexOf('/'));
  const args = `run compile-lesson -- ${id}`;

  // wait a moment before compiling
  clearTimeout($pending);
  $pending = setTimeout(() => {
  	console.log('compile:', id);
    spawn('npm', args.split(' '), {
      stdio: [ process.stdin, process.stdout, process.stderr ]
    });
  }, 1000);
}

// kick off compilling
$watcher.on('change', compile)
  .on('add', compile)
  .on('addDir', compile)
  .on('unlink', compile)
  .on('unlinkDir', compile)
  .on('ready', () => $ready = true);