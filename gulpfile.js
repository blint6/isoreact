'use strict';

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

var getBundleName = function () {
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

var app;

gulp.task('clean', function (cb) {
    del.sync('build', {
        force: true
    }, cb);
});

gulp.task('transpile-app', function () {
    function transpile(strm) {}

    return gulp.src(paths.app, {
            base: 'src'
        })
        .pipe(changed('build'))
        .pipe(insert.prepend('\'use strict\';\n'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(to5())
        .pipe(gulp.dest('build'));
});

gulp.task('transpile-component', function () {
    return gulp.src(paths.component)
        .pipe(changed('build/node_modules'))
        .pipe(insert.prepend('\'use strict\';\n'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(to5())
        .pipe(gulp.dest('build/node_modules'));
});

gulp.task('copy', function () {
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
    );
});

gulp.task('test', ['transpile-app', 'transpile-component'], function () {
    return gulp
        .src('build/**/*.spec.js', {
            read: false
        })
        .pipe(mocha());
});

gulp.task('run', ['copy', 'transpile-app', 'transpile-component'], function () {
    if (app) {
        app.server.close();
        delete require.cache['./build/app/start'];
    }

    app = require('./build/app/start');
});

gulp.task('rebundle', ['copy', 'transpile-component'], function () {
    app.jedis.bundle();
});

gulp.task('watch', function () {
    gulp.start('run');
    gulp.watch(paths.app, ['run']);
    gulp.watch(paths.component, ['rebundle']);
    gulp.watch(paths.asset, ['copy']);
});
