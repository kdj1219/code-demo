//Load gulp and plug-ins
var gulp = require('gulp');
//install packages
//var install = require("gulp-install");
//gulp.task('default', function() {
//    gulp.src(['./package.json']).pipe(install());
//});
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var $ = require('gulp-load-plugins')();


//Common tasks for assets

//step 2 Inject bower components
//把css和js嵌入模板的注解的里面 使用wiredep
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;
    var merge = require('merge-stream');

    var styleDeps = gulp.src('assets/sass/*.scss')
        .pipe(wiredep())
        .pipe(gulp.dest('assets/sass'));

    var tplDeps = gulp.src('assets/templates/template.html')
        .pipe(wiredep({
            directory: './bower_components',
            ignorePath: '../.'
        }))
        .pipe($.rename('index.html'))
        .pipe(gulp.dest('./'))
        .pipe($.connect.reload());


    return merge(styleDeps, tplDeps);
});

//step 3 Pre-compile Sass files
// assets/styles/*.scss -> public/styles/*.css
// echo "/.sass-cache" >> .gitignore
gulp.task('styles', function () {

    var vendDeps = gulp.src(['./assets/sass/**/*.scss'])
        .pipe($.plumber())
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.concat('vendor.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe($.minifyCss())
        .pipe($.rename('vendor.min.css'))
        .pipe(gulp.dest('assets/css'))
        .pipe($.size({title: 'styles'}))
        .pipe($.connect.reload());

    return merge(vendDeps);
});

//step 4 Check syntax and copy files
// assets/scripts/*.js -> public/scripts/*.js
gulp.task('scripts', function () {

    var vendDeps = gulp.src(['./assets/scripts/*.js'])
        .pipe($.jshint('.jshintrc'))
        .pipe($.concat('vendor.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe($.uglify())
        .pipe($.rename('vendor.min.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe($.size({title: 'vendor-scripts'}))
        .pipe($.connect.reload());

    return merge(vendDeps);
});

//step 5 Optimize images
// assets/images/**/* -> public/assets/img/
// Images
gulp.task('images', function () {
    return gulp.src('assets/images/**/*')
        .pipe($.imagemin())
        .pipe(gulp.dest('assets/images'))
        .pipe($.size({title: 'images'}))
        .pipe($.connect.reload());
});

//step 6 Copy fonts
//assets/fonts/**/*.* -> public/assets/fonts/
gulp.task('fonts', function () {
    return gulp.src([
        'assets/fonts/*.{otf,eot,svg,ttf,woff}',
        'public/bower_components/**/fonts/**/*.{otf,eot,svg,ttf,woff}'
    ])
        .pipe($.flatten())
        .pipe(gulp.dest('assets/fonts'))
        .pipe($.size({title: 'fonts'}))
        .pipe($.connect.reload());
});

/////// DEVELOPMENT ///////

// Clean
gulp.task('clean:develop', function (cb) {
    del(['.sass-cache'], cb);
});

// Prepare for development
gulp.task('prepare', function (cb) {
    runSequence(
        'clean:develop',
        ['wiredep', 'styles', 'scripts', 'images', 'fonts'],
        cb);
});

// Start Web Server
//安装启动一个本地服务器 sudo npm install gulp-connect --save-dev
gulp.task('server', function() {
    $.connect.server({
        root: './',
        livereload: true    //实时预览
    });
});

// Watch
gulp.task('watch', ['prepare'], function () {
    gulp.start('server');
    gulp.watch(['assets/templates/**/*.html', 'bower.json'], ['wiredep']);
    gulp.watch('assets/sass/**/*.scss', ['styles']);
    gulp.watch('assets/scripts/**/*.js', ['scripts']);
    gulp.watch('assets/images/**/*', ['images']);
});

/////// BUILD ///////

// HTML
gulp.task('build', ['wiredep', 'styles', 'scripts', 'images', 'fonts'], function () {

});

// Clean Cache
gulp.task('clean:cache', function (cb) {
    return $.cache.clearAll(cb);
});

// Clean
gulp.task('clean', ['clean:develop', 'clean:cache'], function (cb) {
    del([
        'assets/css', 'assets/js',
        'assets/fonts', 'assets/images'
    ], cb);
});

// Clean temporary assets
gulp.task('clean:temporary', function (cb) {
    del([
        '.sass-cache'
    ], cb);
});

// Build
gulp.task('default', function (cb) {
    runSequence('clean', 'build', 'clean:temporary', cb);
});
