'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var del = require('del');
var insert = require('gulp-insert');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var to5 = require('gulp-6to5');
var to5ify = require('6to5ify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
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

gulp.task('javascript', function () {

    var bundle = function () {
        return browserify({
                debug: true
            })
            .transform(to5ify.configure({
                experimental: true
            }))
            .require('./src/client/start.js', {
                entry: true
            })
            .bundle()
            .on("error", function (err) {
                console.log("Error: " + err.message);
            })
            .pipe(source(getBundleName() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            //.pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/js/'));
    };

    return bundle();
});


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
