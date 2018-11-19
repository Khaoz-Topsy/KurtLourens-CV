var del = require("del");
var gulp = require('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var purgecss = require('gulp-purgecss')
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require("gulp-sourcemaps");
var browserSync = require('browser-sync').create();


var inputPaths = {
  misc: ["./favicon.ico", "./.htaccess", "./sitemap.xml", "./docs", "./Images"],
  assets: "./assets/**/*.*",
  scss: "./sass/**/*.scss",
  css: "./assets/css/*.css",
  lib: "./lib/*.js",
  html: "./*.html"
};
var outputPaths = {
  js: "./assets/js",
  css: "./assets/css",
  delcss: "./assets/css/*",
  nonmin: "!./assets/css/*.min.js",
  distassets: "./dist/assets/",
  dist: "./dist",
};
var delPaths = {
  css: "./assets/css/*",
  css_non_min: "!./assets/css/*.min.css",
};

function cleanCss() {
  return del([delPaths.css]);
}
function cleanNonMinStylesTask() {
  return del([delPaths.css, delPaths.css_non_min]);
}
function sassTask() {
  return gulp.src([inputPaths.scss])
    .pipe(sass())
    .pipe(gulp.dest(outputPaths.css))
    .pipe(size({ title: "Info     'sassTask'" }));
}
function purgeCssTask() {
  return gulp.src([inputPaths.css])
    // .pipe(concat('main.css'))
    .pipe(purgecss({
      trim: true,
      shorten: true,
      verbose: false,
      content: [inputPaths.html]
    }))
    .pipe(minifyCSS({
      keepSpecialComments: 0,
      removeEmpty: true,
      keepBreaks: false
    }))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(size({ title: "Info     'purgeCssTask'" }))
    .pipe(browserSync.stream());
}

function uglifyJsTask() {
  return gulp.src([inputPaths.lib])
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(outputPaths.js))
    .pipe(browserSync.stream());
}

function publishHtmlTask() {
  return gulp.src([inputPaths.html])
    .pipe(gulp.dest(outputPaths.dist));
}

function publishMiscTask() {
  return gulp.src(inputPaths.misc)
    .pipe(gulp.dest(outputPaths.dist));
}
function publishAssetsTask() {
  return gulp.src([inputPaths.assets])
    .pipe(gulp.dest(outputPaths.distassets));
}

function watchTask() {
  gulp.watch([[inputPaths.scss]], sassTask);
}

//Delete the existing css, use SASS to generate new css, purge the css, remove non-min css
var createCssAndRemoveMinified = gulp.series(cleanCss, sassTask, purgeCssTask, cleanNonMinStylesTask);
createCssAndRemoveMinified.description = 'Delete old CSS and Generate new CSS';


// Configure the browserSync task
function browserSyncTask() {
  gulp.watch([[inputPaths.scss]]).on('change', gulp.series(createCssAndRemoveMinified, browserSync.reload));
  gulp.watch([[inputPaths.lib]]).on('change', gulp.series(uglifyJsTask, browserSync.reload));
  gulp.watch('./*.html').on('change', browserSync.reload);
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}

gulp.task('cleanCss', cleanCss);
gulp.task('createCssAndRemoveMinified', createCssAndRemoveMinified);
gulp.task('uglifyJsTask', uglifyJsTask);
gulp.task('watch', watchTask);
gulp.task('dev', gulp.series(createCssAndRemoveMinified, uglifyJsTask, browserSyncTask));
gulp.task('dist', gulp.series(publishHtmlTask, publishMiscTask, publishAssetsTask));
gulp.task('default', createCssAndRemoveMinified);