'use strict';

var gulp = require('gulp');
var del = require('del');
var insert = require('gulp-insert');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var to5 = require('gulp-6to5');
var uglify = require('gulp-uglify');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};

var paths = {
    js: 'src/**/*.js',
    asset: ['src/**', '!src/**/*.js']
};

gulp.task('clean', function (cb) {
    del.sync('build', {
        force: true
    }, cb);
});

gulp.task('transpile', function () {
    return gulp.src(paths.js, {
            base: 'src'
        })
        .pipe(changed('build'))
        .pipe(insert.prepend('\'use strict\';\n'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(to5())
        .pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
    return gulp.src(paths.asset, {
            base: 'src'
        })
        .pipe(changed('build'))
        .pipe(gulp.dest('build'));
});

gulp.task('test', ['transpile'], function () {
    return gulp
        .src('build/**/*.spec.js', {
            read: false
        })
        .pipe(mocha());
});

gulp.task('watch', function () {
    gulp.start('transpile', 'copy');
    gulp.watch([paths.js], ['transpile']);
    gulp.watch([paths.asset], ['copy']);
});
