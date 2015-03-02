'use strict';

var path = require('path');
var Promise = require('rsvp').Promise;
var gulp = require('gulp');
var del = require('del');
var es = require('event-stream');
var insert = require('gulp-insert');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var to5 = require('gulp-6to5');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');

var getBundleName = function() {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
};

var paths = {
    js: 'src/**/*.js',
    app: ['src/**/*.js', '!src/component/**'],
    component: 'src/component/**/*.js',
    appasset: ['src/**', '!src/**/*.js', '!src/component/**'],
    componentasset: ['src/component/**', '!src/component/**/*.js']
};

gulp.task('clean', function(cb) {
    del.sync('build', {
        force: true
    }, cb);
});

gulp.task('transpile-app', function() {
    function transpile(strm) {}

    return gulp.src(paths.app, {
            base: 'src'
        })
        .pipe(changed('build'))
        .pipe(sourcemaps.init())
        .pipe(insert.prepend('\'use strict\';'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(to5())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build'))
        .pipe(livereload());
});

gulp.task('transpile-component', function() {
    return gulp.src(paths.component)
        .pipe(changed('build/node_modules'))
        .pipe(sourcemaps.init())
        .pipe(insert.prepend('\'use strict\';'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(to5())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/node_modules'))
        .pipe(livereload());
});

gulp.task('copy', function() {
    return es.merge(
            gulp.src(paths.appasset, {
                base: 'src'
            })
            .pipe(changed('build'))
            .pipe(gulp.dest('build')),

            gulp.src(paths.componentasset, {
                base: 'src/component'
            })
            .pipe(changed('build/node_modules'))
            .pipe(gulp.dest('build/node_modules'))
        )
        .pipe(livereload());
});

var isBundling;
gulp.task('bundle', ['copy', 'transpile-app', 'transpile-component'], function() {
    if (isBundling) return;
    isBundling = true;

    return new Promise(function(resolve, reject) {
        nodemon({
            script: './build/app/browserify.js',
            ignore: '*'
        })
            .on('exit', function() {
                console.log('App successfully bundled');
                isBundling = false;
                resolve();
            })
            .on('crash', function(err) {
                isBundling = false;
                reject(err);
            });
    });
});

gulp.task('test', ['transpile-app', 'transpile-component'], function() {
    return gulp
        .src('build/**/*.spec.js', {
            read: false
        })
        .pipe(mocha());
});

gulp.task('run', ['watch'], function() {
    nodemon({
        script: './build/app/start',
        watch: ['build', 'node_modules'],
        ignore: 'src',
        nodeArgs: ['--debug=9999']
    })
        .on('restart', function() {
            console.log('Restarted!');
            livereload.reload();
        });
});

gulp.task('watch', ['bundle'], function() {
    livereload({
        start: true
    });

    gulp.watch([paths.app, paths.component], ['bundle']);
    gulp.watch([paths.appasset, paths.componentasset], ['copy']);
});