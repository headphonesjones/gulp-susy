/*global -$ */
'use strict';
// generated on 2015-06-02 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uncss = require('gulp-uncss');
var autoprefixer = require('gulp-autoprefixer');
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var uglify = require('gulp-uglifyjs');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

var paths = {
    scss: 'src/scss/*.scss'
};


gulp.task('styles', function () {
  gulp.src('src/scss/*.scss')
    .pipe(plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe($.sourcemaps.write())
    .pipe(uglifycss())
    .pipe(gulp.dest('app/css'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function () {
  gulp.src('src/js/*.js')
    .pipe(plumber())
    .pipe(uglify({mangle: false}))
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(reload({stream: true, once: true}));
});

gulp.task('html', function () {

  gulp.src('src/*.html')
    .pipe(plumber())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('app'))
    .pipe(reload({stream: true}));
});

gulp.task('images', function () {
  return gulp.src('./src/images/*.*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
     }))
    .pipe(gulp.dest('./app/images'))
    .pipe(reload({stream: true}));
});

gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('serve', ['images'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['jshint']);
  gulp.watch('src/images/*.*', ['images']);
  gulp.watch('src/*.html', ['html']);
});


gulp.task('build', function () {
  gulp.start('serve');
});

gulp.task('default', function () {
  gulp.start('serve');
});
