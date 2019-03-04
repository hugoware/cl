const _ = require('lodash');
 
const $gulp = require('gulp');
const $source = require('vinyl-source-stream');
const $buffer = require('vinyl-buffer');
const $sequence = require('run-sequence');
const $utils = require('gulp-util');
const $run = require('gulp-run-command').default;

  // ui/styles
const $sass = require('gulp-sass');
const $babelify = require('babelify');
const $watchify = require('watchify');

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

  icons: {
    src: 'src/icons/**/*.svg'
  },

	styles: { 
		watch: [
			'src/styles/**/*.scss',
			'src/styles/**/*.sass'
			// 'src/styles/**/*.sass'
		],
		src: ['src/styles/**/*', '!src/styles/**/lib/**'],
		dest: 'dist/resources/public'
	},

	resources: {
		src: 'src/resources/**/*',
		watch: 'src/resources/**/*',
		dest: 'dist/resources'
	},

	views: {
		src: 'src/views/**/*',
		watch: 'src/views/**/*',
		dest: 'dist/views'
	},

	scripts: {
    client: [ 'site', 'app', 'browser', 'admin', 'repl' ],
    workers: [ 'pug', 'babel', 'scss', 'html' ],
		viewers: [ 'code' ], //, 'mobile-install' ],
		server: {
			watch: ['src/**/*.js', '!src/client', '!src/client/**', '!src/resources/**', ],
			src: ['src/**/*.js', '!src/client', '!src/client/**', '!src/resources/**'],
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


// // simple compile for auto-complete scripts
// $gulp.task('compile-auto-complete-scripts', () => {
//   const output = $gulp.dest(`dist/resources/public`);

//   return $browserify('src/client/auto-complete/*.js', {
//     fast: true,
//     cache: { },
//     packageCache: { },
//   })
//   .transform('babelify', {
//     presets: [ 'es2015' ],
//     plugins: [
//       // 'convert-to-json',
//       ['inline-import', { 'extensions': [ '.txt', '.ts', '.html' ] }],
//       'transform-svg-import-to-string',
//       'transform-class-properties',
//       'async-to-promises'
//     ]
//   })
//   .bundle()
//   .on('error', displayError)
//   .pipe($buffer())
//   .pipe(output);
// });

// // setup a watch
// $gulp.task('watch-auto-complete-scripts', () => {
//   $gulp.watch([`src/client/auto-complete/**/*`], [ action ]);
// });


// setup client build scripts
_.each($config.scripts.client, source => {
  const input = `src/client/${source}/index.js`;
  const action = `compile-client-${source}-scripts`;
	const watch = `watch-client-${source}-scripts`;

	// add custom browserify options here
	const options = _.assign({}, $watchify.args, {
		entries: [input],
		// debug: true,
		transform: [
			$babelify.configure({
				presets: ['es2015'],
				plugins: [
					// 'convert-to-json',
					['inline-import', { 'extensions': ['.txt', '.ts', '.html'] }],
					'transform-svg-import-to-string',
					'transform-class-properties',
					'async-to-promises'
				]
			})
		]
	});

	// reusable bundler
	const bundler = $watchify($browserify(options));
	
	// handles creating the bundle
	function bundle() {
		console.log(`[bundling] ${source}`);
		const output = $gulp.dest(`dist/resources/public`);
		return bundler.bundle()
			// log errors if they happen
			.on('error', err => console.error(err))
			.pipe($source(`${source}.js`))
			// optional, remove if you don't need to buffer file contents
			.pipe($buffer())
			// optional, remove if you dont want sourcemaps
			// .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
			// Add transformation tasks to the pipeline here.
			// .pipe(sourcemaps.write('./')) // writes .map file
			.pipe(output);
	}

	// create the standard build task
	$gulp.task(action, bundle);

	// create the watcher task
	$gulp.task(watch, () => {

		// create the initial bundle
		if (!bundle.hasRun) {
			bundle.hasRun = true;
			bundle();
		}

		bundler.on('update', bundle); // on any dep update, runs the bundler
		bundler.on('log', (...args) => {
			console.log(`[updated] ${source}:`, ...args);
		});
	});

});

// setup worker build scripts
_.each($config.scripts.workers, source => {
  const input = `src/client/workers/${source}.js`;
  const action = `compile-worker-${source}-scripts`;
  const watch = `watch-worker-${source}-scripts`;
  const transformer = $browserify(input, {
    fast: true,
    cache: { },
    packageCache: { },
  })
  .transform('babelify', {
    presets: [ 'es2015' ],
    plugins: [
      ['inline-import', { 'extensions': [ '.txt', '.ts' ] }],
      'transform-class-properties',
      'async-to-promises'
    ]
  })
  .transform('browserify-shim', {
    global: true,
    'fs': 'global:LFS'
  });
  
  // compiles the worker script
  $gulp.task(action, () => {
    const output = $gulp.dest(`dist/resources/public`);

    return transformer
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


// setup worker build scripts
_.each($config.scripts.viewers, source => {
  const input = `src/client/viewer/${source}/index.js`;
  const action = `compile-viewer-${source}-scripts`;
  const watch = `watch-viewer-${source}-scripts`;
  const transformer = $browserify(input, {
    fast: true,
    cache: { },
    packageCache: { },
  })
  .transform('babelify', {
    presets: [ 'es2015' ],
    plugins: [
      ['inline-import', { 'extensions': [ '.txt', '.ts' ] }],
      'transform-svg-import-to-string',
      'transform-class-properties',
      'async-to-promises'
    ]
  });
  // .transform('browserify-shim', {
  //   global: true,
  //   'fs': 'global:LFS'
  // });
  
  // compiles the viewer script
  $gulp.task(action, () => {
    const output = $gulp.dest(`dist/resources/public`);

    return transformer
      .bundle()
      .on('error', displayError)
      .pipe($source(`${source}.js`))
      .pipe($buffer())
      .pipe(output);
  });

  // setup a watch
  $gulp.task(watch, () => {
    $gulp.watch([`src/client/viewer/${source}/**/*.js`], [ action ]);
  });
});


// handles svg icon cleanup
$gulp.task('clean-svg-icons', $run('node ./scripts/clean-svg-icons.js'));


$gulp.task('compress-css', () => {
  const options = {
    compatibility: 'ie9'
  };

  return $gulp.src('dist/public/*.css')
    .pipe($cleanCSS(options))
    .pipe($gulp.dest('./dist/public'));
});


// handle externally
// $gulp.task('compress-js', cb => {
//   $pump([
//     $gulp.src('dist/public/*.js'),
//     $uglify({
//       compress: true
//     }),
//     $gulp.dest('dist/public')
//   ], cb);
// });


$gulp.task('compress-json', () => {
  return $gulp.src(['dist/resources/public/*.json'])
    .pipe($jsonminify())
    .pipe($gulp.dest('dist/resources/public'));
});


$gulp.task('compress-images', () => {
  $gulp.src('dist/resources/public/*')
    .pipe($imagemin())
    .pipe($gulp.dest('dist/resources/public'));
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
      ['inline-import', { 'extensions': [ '.txt', '.ts' ] }],
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
  const viewerTasks = _.map($config.scripts.viewers, source => `${task}-viewer-${source}-scripts`);
  $gulp.task(`${task}-client-scripts`, scriptTasks);
  $gulp.task(`${task}-worker-scripts`, workerTasks);
  $gulp.task(`${task}-viewer-scripts`, viewerTasks);
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

$gulp.task('watch-svg-icons', () => {
  $gulp.watch($config.icons.src, ['clean-svg-icons']);
})

// general tasks
$gulp.task('compress', [ 'compress-images', 'compress-json', 'compress-css' ]);
$gulp.task('compile', ['clean-svg-icons', 'copy-views', 'compile-styles', 'compile-viewer-scripts', 'compile-client-scripts', 'compile-server-scripts', 'copy-resources']);
$gulp.task('watch', ['watch-views', 'watch-styles', 'watch-viewer-scripts', 'watch-worker-scripts', 'watch-client-scripts', 'watch-resources', 'watch-server-scripts', 'watch-svg-icons']);

// full deployment task
$gulp.task('deploy', done => $sequence(
	'production-build',
  [ 'clean-svg-icons', 'copy-views', 'compile-styles', 'copy-resources', 'compile-viewer-scripts', 'compile-worker-scripts', 'compile-client-scripts', 'compile-server-scripts' ],
  'compress',
  done 
));

// general development
$gulp.task('dev', ['compile', 'watch']);

// just generate files
$gulp.task('default', ['compile']);
