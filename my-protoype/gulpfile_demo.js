'use strict';

/////// COMMON ///////

// Load plugins
var gulp = require('gulp');
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var $ = require('gulp-load-plugins')();

// Templates
gulp.task('templates', function() {
    return gulp.src('assets/templates/*.jade')
        .pipe($.plumber())
        .pipe($.jade({ pretty: true }))
        .pipe(gulp.dest('public'))
        .pipe($.size({ title: 'templates' }));
});

// Inject bower components
gulp.task('wiredep', ['templates'], function() {
    var wiredep = require('wiredep').stream;
    var merge = require('merge-stream');

    var styleDeps = gulp.src('assets/styles/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('assets/styles'));

    var tplDeps = gulp.src('public/**/*.html')
        .pipe(wiredep({ exclude: ['modernizr'] }))
        .pipe(gulp.dest('public'));

    return merge(styleDeps, tplDeps);
});

// Styles
gulp.task('styles', function() {
    return gulp.src('assets/styles/*.scss')
        .pipe($.plumber())
        .pipe($.rubySass({
            bundleExec: true,
            style: 'expanded',
            precision: 10
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('public/styles'))
        .pipe($.size({ title: 'styles' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src('./assets/scripts/*.js')
        .pipe($.jshint('.jshintrc'))
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe(gulp.dest('public/scripts'))
        .pipe($.size({ title: 'scripts' }));
});

// Images
gulp.task('images', function() {
    return gulp.src('assets/images/**/*')
        // // Install gulp-imagemin first:
        // // `npm install --save-dev gulp-imagemin`
        // .pipe($.plumber())
        // .pipe($.cache($.imagemin({
        //     optimizationLevel: 3,
        //     progressive: true,
        //     interlaced: true
        // })))
        .pipe(gulp.dest('public/images'))
        .pipe($.size({ title: 'images' }));
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src([
            'assets/fonts/*.{otf,eot,svg,ttf,woff}',
            'public/bower_components/**/fonts/**/*.{otf,eot,svg,ttf,woff}'
        ])
        .pipe($.flatten())
        .pipe(gulp.dest('public/fonts'))
        .pipe($.size({ title: 'fonts' }));
});

/////// DEVELOPMENT ///////

// Clean
gulp.task('clean:develop', function(cb) {
    del(['public/**/*.html' , '!public/bower_components/**/*.html', 'public/styles', 'public/scripts', '.sass-cache'], cb);
});

// Prepare for development
gulp.task('prepare', function (cb) {
    runSequence(
        'clean:develop',
        ['wiredep', 'styles', 'scripts', 'images', 'fonts'],
    cb);
});

// Start Web Server
gulp.task('serve', function() {
    gulp.src('public')
        .pipe($.webserver({
            livereload: true,
            open: true
        }));
});

// Watch
gulp.task('watch', ['prepare'], function() {
    gulp.start('serve');
    gulp.watch(['assets/templates/**/*.jade', 'bower.json'], ['wiredep']);
    gulp.watch('assets/styles/**/*.scss', ['styles']);
    gulp.watch('assets/scripts/**/*.js', ['scripts']);
    gulp.watch('assets/images/**/*', ['images']);
});

/////// BUILD ///////

// HTML
gulp.task('build', ['wiredep', 'styles', 'scripts', 'images', 'fonts'], function() {

    var saveLicense = require('uglify-save-license');
    var useref = $.useref;
    var assets = $.useref.assets({ searchPath: 'public' });

    return gulp.src('public/**/*.html')
        .pipe(assets)
        .pipe($.if('*.js', $.uglify({ preserveComments: saveLicense })))
        .pipe($.if('*.css', $.csso()))
        .pipe(gulp.dest('styleguide'))
        .pipe($.rev())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest('public'));
});

// Style Guide / UI Patterns
gulp.task('hologram', function() {
    return gulp.src('hologram.yml')
        .pipe($.hologram({ bundler: true }));
});

// Clean Cache
gulp.task('clean:cache', function (cb) {
    return $.cache.clearAll(cb);
});

// Clean
gulp.task('clean', ['clean:develop', 'clean:cache'], function(cb) {
    del(['styleguide', 'public/css', 'public/js', 'public/fonts', 'public/images'], cb);
});

// Clean temporary assets
gulp.task('clean:temporary', function (cb) {
    del(['public/styles', 'public/scripts', '.sass-cache'], cb);
});

// Build
gulp.task('default', function(cb) {
    runSequence('clean', 'build', 'clean:temporary', 'hologram', cb);
});
