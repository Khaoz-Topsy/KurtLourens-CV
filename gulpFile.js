var del = require("del");
var gulp = require('gulp');
var sass = require('gulp-sass');
var size = require('gulp-size');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var purgecss = require('gulp-purgecss')
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync').create();


var inputPaths = {
  docs: ["./docs/**/*.*"],
  images: ["./images/**/*.*"],
  misc: ["./favicon.ico", "manifest.json", "serviceWorker.js", "privacy_policy.html",
    "./sitemap.xml", "./robots.txt", "./.htaccess",
    "./safari-pinned-tab.svg", "./apple-touch-icon.png", "./apple-touch-icon-precomposed.png",
    "./browserconfig.xml"],
  arduino: ["./arduino/**/*.*", "./arduino/.htaccess"],
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
  distdocs: "./dist/docs/",
  distimages: "./dist/images/",
  distarduino: "./dist/arduino/",
};
var delPaths = {
  css: "./assets/css/*",
  css_non_min: "!./assets/css/*.min.css",
  js: "./assets/js/*",
  dist: "./dist/**/*",
};

function cleanCss() {
  return del([delPaths.css]);
}
function cleanNonMinStylesTask() {
  return del([delPaths.css, delPaths.css_non_min]);
}
function cleanJs() {
  return del([delPaths.js]);
}
function cleanDist() {
  return del([delPaths.dist]);
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
    .pipe(concat('bundle.js'))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(outputPaths.js))
    .pipe(browserSync.stream());
}

function publishHtmlTask() {
  return gulp.src([inputPaths.html])
    .pipe(htmlmin({
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      useShortDoctype: true,
      removeComments: true,
    }))
    .pipe(gulp.dest(outputPaths.dist));
}

function publishMiscTask() {
  return gulp.src(inputPaths.misc)
    .pipe(gulp.dest(outputPaths.dist));
}
function publishDocsTask() {
  return gulp.src(inputPaths.docs)
    .pipe(gulp.dest(outputPaths.distdocs));
}
function publishImagesTask() {
  return gulp.src(inputPaths.images)
    .pipe(gulp.dest(outputPaths.distimages));
}
function publishAssetsTask() {
  return gulp.src([inputPaths.assets])
    .pipe(gulp.dest(outputPaths.distassets));
}
function publishArduinoTask() {
  return gulp.src(inputPaths.arduino)
    .pipe(gulp.dest(outputPaths.distarduino));
}

function watchTask() {
  gulp.watch([[inputPaths.scss]], sassTask);
}

//Delete the existing css, use SASS to generate new css, purge the css, remove non-min css
var createCssAndRemoveMinified = gulp.series(cleanCss, sassTask, purgeCssTask, cleanNonMinStylesTask);
createCssAndRemoveMinified.description = 'Delete old CSS and Generate new CSS';

//Delete the existing js, new js bundle
var generateJsBundle = gulp.series(cleanJs, uglifyJsTask);
generateJsBundle.description = 'Delete old JS and Generate new JS';


// Configure the browserSync task
function browserSyncTask() {
  gulp.watch([[inputPaths.scss]]).on('change', gulp.series(createCssAndRemoveMinified, browserSync.reload));
  gulp.watch([[inputPaths.lib]]).on('change', gulp.series(generateJsBundle, browserSync.reload));
  gulp.watch('./*.html').on('change', browserSync.reload);
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
}

gulp.task('cleanCss', cleanCss);
gulp.task('createCssAndRemoveMinified', createCssAndRemoveMinified);
gulp.task('generateJsBundle', generateJsBundle);
gulp.task('watch', watchTask);
gulp.task('dev', gulp.series(createCssAndRemoveMinified, generateJsBundle, browserSyncTask));
gulp.task('cleanDist', cleanDist);
gulp.task('dist', gulp.series(cleanDist, createCssAndRemoveMinified, generateJsBundle, publishHtmlTask, publishMiscTask, publishDocsTask, publishImagesTask, publishAssetsTask, publishArduinoTask));
gulp.task('dist:min', gulp.series(cleanDist, createCssAndRemoveMinified, generateJsBundle, publishHtmlTask, publishMiscTask, publishAssetsTask));
gulp.task('default', createCssAndRemoveMinified);