'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var to5ify = require('6to5ify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return version + '.' + name + '.' + 'min';
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
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/js/'));
    };

    return bundle();
});
