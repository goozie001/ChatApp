'use strict';

var args = require('yargs').argv,
	concatenate = require('gulp-concat'),
	gulp = require('gulp'),
	gulpif = require('gulp-if'),
	path = require('path'),
	run = require('gulp-run'),
	runSequence = require('run-sequence'),
	shell = require('gulp-shell'),
	uglify = require('gulp-uglify');

var isProd = args.env === 'production';

process.env.GOPATH = path.join(__dirname, 'server');

gulp.task('run', function () {
	process.chdir('dist');
	gulp.src('').pipe(shell(['site.exe']));
});

gulp.task('install-dependencies', shell.task([
	'go get github.com/gorilla/mux',
	'go get github.com/lib/pq'
]));

gulp.task('server:clean-dependencies', shell.task([
	'rm -rf server/src/github.com'
]));

gulp.task('install-dev', shell.task([
	'bower install',
	'npm install',
	'npm install i -g eslint'
]));

gulp.task('build', ['clean-dist'], function () {
	runSequence(
		'client:build', 
		'server:build'
	);
});

gulp.task('clean-dist', shell.task([
	'rm -rf dist'
]));

// Client build tasks
gulp.task('client:build', function () {
	runSequence(
		'client:clean',
		'client:provision',
		'client:lint',
		'client:compile',
		'client:test',
		'client:dist'
	);
});

gulp.task('client:clean', shell.task([
	'rm -rf client/public/lib'
]));

gulp.task('client:provision', shell.task([
	// jquery
	'if not exist "client/public/lib/jquery" md "client/public/lib/jquery"',
	'cp "bower_components/jquery/dist/jquery.min.js" '
		+ '"bower_components/jquery/dist/jquery.min.map" '
		+ '"client/public/lib/jquery"',

	// Materialize CSS
	'if not exist "client/public/lib/materialize" md "client/public/lib/materialize"',
	'cp "bower_components/materialize/dist/css/materialize.min.css" '
		+ '"bower_components/materialize/dist/font/material-design-icons/Material-Design-Icons.svg" '
		+ '"bower_components/materialize/dist/js/materialize.min.js" '
		+ '"client/public/lib/materialize"',

	// Angular
	'if not exist "client/public/lib/angular" md "client/public/lib/angular"',
	'cp "bower_components/angular/angular.min.js" '
		+ '"bower_components/angular/angular.min.js.map" '
		+ '"client/public/lib/angular"'
]));

gulp.task('client:lint', shell.task([
	'eslint client'
]));

gulp.task('client:compile', function () {
	return gulp.src(['client/public/scripts/**.js'])
		.pipe(gulpif(isProd, concatenate('all.js')))
		.pipe(gulpif(isProd, uglify()))
		.pipe(gulpif(isProd, gulp.dest('client/public/scripts')))
});

gulp.task('client:test', function () {
	// TODO
});

gulp.task('client:dist', shell.task([
	'if not exist dist md dist',
	'cp -r client/public dist'
]));

// Server build tasks
gulp.task('server:build', function () {
	runSequence(
		'server:clean',
		'server:lint',
		'server:compile',
		'server:test',
		'server:dist'
	);
});

gulp.task('server:clean', shell.task([
	'go clean site',
	'rm -rf server/bin',
	'rm -rf server/pkg'
]));

gulp.task('server:lint', shell.task([
	'go vet site'
]));

gulp.task('server:compile', shell.task([
	'go install site'
]));

gulp.task('server:test', shell.task([
	'go test site/...'
]));

gulp.task('server:dist', shell.task([
	'if not exist dist md dist',
	'cp server/bin/site dist'
]));