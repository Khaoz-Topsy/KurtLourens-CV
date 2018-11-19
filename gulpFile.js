var del = require("del");
var gulp = require('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var purgecss = require('gulp-css-purge');
var minifyCSS = require('gulp-minify-css');
var sourcemaps = require("gulp-sourcemaps");


var inputPaths = {
  scss: "./assets/sass/**/*.scss",
  css: "./assets/css/*.css",
};
var outputPaths = {
  dist: "./dist/",
  css: "./assets/css",
  delcss: "./assets/css/*",
  nonmin: "!./assets/css/*.min.js",
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
    // .pipe(purgecss({
    //   trim: true,
    //   shorten: true,
    //   verbose: false
    // }))
    .pipe(minifyCSS({
      keepSpecialComments: 0,
      removeEmpty: true,
      keepBreaks : false
    }))
    .pipe(rename(function (path) {
      path.basename += ".min";
    }))
    .pipe(gulp.dest(outputPaths.css))
    .pipe(size({ title: "Info     'purgeCssTask'" }));
}
function watchTask() {
  gulp.watch([[inputPaths.scss]], sassTask);
}

//Delete the existing css, use SASS to generate new css, purge the css, remove non-min css
var createCssAndRemoveMinified = gulp.series(cleanCss, sassTask, purgeCssTask, cleanNonMinStylesTask);
createCssAndRemoveMinified.description = 'Delete old CSS and Generate new CSS'


gulp.task('cleanCss', cleanCss);
gulp.task('createCssAndRemoveMinified', createCssAndRemoveMinified);
gulp.task('build-watch', watchTask);
gulp.task('default', createCssAndRemoveMinified);