'use strict';

var gulp = require('gulp'),
	path = require('path'),
	shell = require('gulp-shell');

process.env.GOPATH = path.join(__dirname, 'server');

gulp.task('default', function() {

});

gulp.task('server:install-dependencies', shell.task([
	'go get github.com/gorilla/mux'
]));

gulp.task('server:dist', shell.task([
	'mkdir -p dist',
	'cp server/bin/site dist'
]));