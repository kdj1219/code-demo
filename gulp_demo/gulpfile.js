var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');

//安装gulp   sudo npm install gulp --save-dev
gulp.task('hello', function() {
  console.log('您好');
});

//复制单个文件 index.html至dist文件夹
gulp.task('copy-index', function() {
  return gulp.src('index.html').pipe(gulp.dest('dist'));
});

//复制多个文件 images目录下的jpg图片复制到dist文件夹
gulp.task('images-jpg', function() {
  return gulp.src('images/*.jpg').pipe(gulp.dest('dist/images'));
});

//复制多个文件 images目录下的所有jpg png图片复制到dist文件夹
gulp.task('images-jpg-png', function() {
  return gulp.src('images/*.{jpg,png}').pipe(gulp.dest('dist/images'));
});

//复制多个文件 images目录下的所有的图片和文件夹到dist文件夹
gulp.task('images-all', function() {
  return gulp.src('images/**/*').pipe(gulp.dest('dist/images'));
});

//多个globs 多个目录下的文件复制到dist文件夹
gulp.task('data', function() {
  return gulp.src(['xml/*.xml', 'json/*.json']).pipe(gulp.dest('dist/data'));
});

//多个globs 多个目录下的文件排除secret-开头的json文件复制到dist文件夹
gulp.task('data-exclude', function() {
  return gulp.src(['xml/*.xml', 'json/*.json', '!json/secret-*.json']).pipe(gulp.dest('dist/data'));
});

//主任务 任务依赖
gulp.task('build', ['copy-index','images','data'], function() {
  console.log('编译成功!');
});

//文件有变化时，自动执行任务 gulp.watch
gulp.task('watch', function() {
  //监视index.html 如果变化执行copy-index和index-livereload任务
  gulp.watch('index.html', ['copy-index','index-livereload']);
  //监视images下的所有图像文件，如果有变化执行images-jpg-png任务
  gulp.watch('images/**/*.{jpg,png}', ['images-jpg-png']);
  //监视多个globs, 发现变化执行data-exclude任务
  gulp.watch(['xml/*.xml', 'json/*.json', '!json/secret-*.json'], ['data-exclude']);
});

//添加gulp-sass插件命令 sudo npm install gulp-sass --save-dev
gulp.task('sass', function() {
  return gulp.src('stylesheets/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});

//安装启动一个本地服务器 sudo npm install gulp-connect --save-dev
gulp.task('server', function() {
  connect.server({
    root: 'dist',
    livereload: true    //实时预览
  });
});

//实时预览例子
gulp.task('index-livereload', function() {
  return gulp.src('index.html')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

//默认任务
gulp.task('default', ['server','watch']);

//合并文件成vonder.js   sudo npm install gulp-concat --save-dev
gulp.task('scripts', function() {
  return gulp.src(['javascripts/jquery.js', 'javascripts/modernizr.js'])
    .pipe(concat('vonder.js'))
    .pipe(gulp.dest('dist/js'));
});

//最小化压缩js文件   sudo npm install gulp-uglify --save-dev
gulp.task('scripts-uglify', function() {
  return gulp.src(['javascripts/jquery.js', 'javascripts/modernizr.js'])
    .pipe(concat('vonder.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});

//重命名文件  sudo npm install gulp-rename --save-dev
gulp.task('scripts-rename', function() {
  return gulp.src(['javascripts/jquery.js', 'javascripts/modernizr.js'])
    .pipe(concat('vonder.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(rename('vonder.min.js'))
    .pipe(gulp.dest('dist/js'));
});

//最小化CSS文件  sudo npm install gulp-minify-css --save-dev
gulp.task('sass', function() {
  return gulp.src('stylesheets/**/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/css'));
});

//最小化图像  sudo npm install gulp-imagemin --save-dev
gulp.task('images-all', function() {
  return gulp.src('images/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});
