const _ = require('lodash');
 
const $gulp = require('gulp');
const $source = require('vinyl-source-stream');
const $buffer = require('vinyl-buffer');
const $sequence = require('run-sequence');
const $utils = require('gulp-util');

  // ui/styles
const $sass = require('gulp-sass');

  // scripts
const $pump = require('pump');
const $uglify = require('gulp-uglify');
const $cleanCSS = require('gulp-clean-css');
const $imagemin = require('gulp-imagemin');
const $browserify = require('browserify');
const $babel = require('gulp-babel');
const $jsonminify = require('gulp-jsonminify');

  // possible server sections
const $config = {

		styles: { 
			watch: [
				'src/styles/**/*.scss',
				'src/styles/**/*.sass'
				// 'src/styles/**/*.sass'
			],
			src: ['src/styles/**/*', '!src/styles/**/lib/**'],
			dest: 'dist/public'
		},

		resources: {
			src: 'src/resources/**/*',
			watch: 'src/resources/**/*',
			dest: 'dist/public'
		},

		views: {
			src: 'src/views/**/*',
			watch: 'src/views/**/*',
			dest: 'dist/views'
		},

		scripts: {
      client: [ 'site', 'app', 'viewer' ],
			workers: [ 'pug', 'typescript', 'scss' ],
			server: {
				watch: ['src/**/*.js', '!src/client', '!src/client/**' ],
				src: ['src/**/*.js', '!src/client', '!src/client/**'],
				dest: 'dist'
			}
		}

	};



// checking build
let PRODUCTION = false;

// handle gulp errors
function displayError(err) {
  $utils.beep();
  console.log(err);
  this.emit('end');
}


// setup client build scripts
_.each($config.scripts.client, source => {
  const input = `src/client/${source}/index.js`;
  const action = `compile-client-${source}-scripts`;
  const watch = `watch-client-${source}-scripts`;
  
  // compiles the client script
  $gulp.task(action, () => {
    const output = $gulp.dest(`dist/public`);

    return $browserify(input, {
      fast: true,
      cache: { },
      packageCache: { },
    })
    .transform('babelify', {
      presets: [ 'es2015' ],
      plugins: [
        // 'convert-to-json',
        'transform-svg-import-to-string',
        'transform-class-properties',
        'async-to-promises'
      ]
    })
    .bundle()
    .on('error', displayError)
    .pipe($source(`${source}.js`))
    .pipe($buffer())
    .pipe(output);
  });

  // setup a watch
  $gulp.task(watch, () => {
    $gulp.watch([`src/client/${source}/**/*`], [ action ]);
  });
});

// setup worker build scripts
_.each($config.scripts.workers, source => {
  const input = `src/client/workers/${source}.js`;
  const action = `compile-worker-${source}-scripts`;
  const watch = `watch-worker-${source}-scripts`;
  
  // compiles the worker script
  $gulp.task(action, () => {
    const output = $gulp.dest(`dist/public`);

    return $browserify(input, {
      fast: true,
      cache: { },
      packageCache: { },
    })
    .transform('babelify', {
      presets: [ 'es2015' ],
      plugins: [
        'transform-class-properties',
        'async-to-promises'
      ]
    })
    .transform('browserify-shim', {
      global: true,
      'fs': 'global:LFS'
    })
    .bundle()
    .on('error', displayError)
    .pipe($source(`${source}.js`))
    .pipe($buffer())
    .pipe(output);
  });

  // setup a watch
  $gulp.task(watch, () => {
    $gulp.watch([`src/client/workers/${source}.js`], [ action ]);
  });
});


$gulp.task('compress-css', () => {
  const options = {
    compatibility: 'ie9'
  };

  return $gulp.src('dist/public/*.css')
    .pipe($cleanCSS(options))
    .pipe($gulp.dest('./dist/public'));
});


$gulp.task('compress-js', cb => {
  $pump([
    $gulp.src('dist/public/*.js'),
    $uglify({
      compress: true
    }),
    $gulp.dest('dist/public')
  ], cb);
});


$gulp.task('compress-json', () => {
  return $gulp.src(['dist/public/*.json'])
    .pipe($jsonminify())
    .pipe($gulp.dest('dist/public'));
});


$gulp.task('compress-images', () => {
  $gulp.src('dist/public/*')
    .pipe($imagemin())
    .pipe($gulp.dest('dist/public'));
})


// transfer file resources
$gulp.task('copy-resources', () => {
  return $gulp
    .src($config.resources.src)
    .pipe($gulp.dest($config.resources.dest));
});


// transfer file resources
$gulp.task('copy-views', () => {
  return $gulp
    .src($config.views.src)
    .pipe($gulp.dest($config.views.dest));
});


// compile SASS (styling) files
$gulp.task('compile-styles', () => {
  const config = $sass({

  })
  .on('error', displayError);

  // compile
  const input = $gulp.src($config.styles.src);
  const output = $gulp.dest($config.styles.dest);
  return input.pipe(config).pipe(output);
});

// compiles all server scripts
$gulp.task('compile-server-scripts', () => {
  const config = $babel({
    presets: ['es2015'],
    plugins: [
      // 'convert-to-json',
      'transform-class-properties',
      'async-to-promises'
    ]
  })
  .on('error', displayError);

  // process
  const input = $gulp.src($config.scripts.server.src);
  const output = $gulp.dest($config.scripts.server.dest);
  return input.pipe(config).pipe(output);
});

// setup dynamically generated tasks
_.each(['compile', 'watch'], task => {
  const scriptTasks = _.map($config.scripts.client, source => `${task}-client-${source}-scripts`);
  const workerTasks = _.map($config.scripts.workers, source => `${task}-worker-${source}-scripts`);
  $gulp.task(`${task}-client-scripts`, scriptTasks);
  $gulp.task(`${task}-worker-scripts`, workerTasks);
});


// toggle flags
$gulp.task('production-build', () => PRODUCTION = true);

$gulp.task('watch-styles',() => {
  $gulp.watch($config.styles.watch, ['compile-styles']); 
});

$gulp.task('watch-views',() => {
  $gulp.watch($config.views.watch, ['copy-views']); 
});

$gulp.task('watch-resources',() => {
  $gulp.watch($config.resources.watch, ['copy-resources']); 
});

$gulp.task('watch-server-scripts',() => {
  $gulp.watch($config.scripts.server.watch, ['compile-server-scripts']); 
});

// general tasks
$gulp.task('compress', [ 'compress-images', 'compress-json', 'compress-css', 'compress-js' ]);
$gulp.task('compile', ['copy-views', 'compile-styles', 'compile-worker-scripts', 'compile-client-scripts', 'compile-server-scripts', 'copy-resources']);
$gulp.task('watch', ['watch-views', 'watch-styles', 'watch-worker-scripts', 'watch-client-scripts', 'watch-resources', 'watch-server-scripts']);

// full deployment task
$gulp.task('deploy', done => $sequence(
  [ 'copy-views', 'compile-styles', 'copy-resources', 'compile-worker-scripts', 'compile-client-scripts', 'compile-server-scripts' ],
  'compress',
  done 
));

// general development
$gulp.task('dev', ['compile', 'watch']);

// just generate files
$gulp.task('default', ['compile']);
