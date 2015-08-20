'use strict';

var gulp = require('gulp'),
	path = require('path'),
	runSequence = require('run-sequence'),
	shell = require('gulp-shell'),
	run = require('gulp-run');

process.env.GOPATH = path.join(__dirname, 'server');

gulp.task('server:install-dependencies', shell.task([
	'go get github.com/gorilla/mux'
]));

gulp.task('server:clean-dependencies', shell.task([
	'rm -rf server/src/github.com'
]));

gulp.task('install-dev', shell.task([
	'bower install',
	'npm install'
]));

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
	'rm -rf server/pkg',
	'rm -rf dist'
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
	'mkdir \-p dist',
	'cp server/bin/site dist'
]));

gulp.task('make:dist', function() {
	run('mkdir -p dist').exec()
		//.pipe(gulp.dest('output'))
});