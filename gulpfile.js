/// <binding BeforeBuild='clean, style, html:copy, copy, html:update, images, spritesmith, symbols' AfterBuild='copy, html:copy, html:update, images, spritesmith, symbols' ProjectOpened='htmlhint, stylelint' />
"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var csscomb = require('gulp-csscomb');
var imagemin = require("gulp-imagemin");
var rename = require("gulp-rename");
var spritesmith = require("gulp.spritesmith");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var server = require("browser-sync").create();
var htmlhint = require("gulp-htmlhint");
var stylelint = require("gulp-stylelint");
var run = require("run-sequence");
var del = require("del");


gulp.task("htmlhint", function() {
  return gulp.src("*.html")
    .pipe(htmlhint('.htmlhintrc'))
    .pipe(htmlhint.reporter());
});


gulp.task("stylelint", function() {
  return gulp.src("less/style.less")
    .pipe(stylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }));
});

gulp.task("html:copy", function() {
  return gulp.src("*.html")
    .pipe(gulp.dest("build"));
});

gulp.task("html:update", ["html:copy"], function(done) {
  server.reload();
  done();
});

gulp.task("style", function() {
  gulp.src("less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(csscomb())
    .pipe(postcss([
      autoprefixer({
        browsers: [
          "last 2 versions"
        ]
      }),
      mqpacker({
        sort: true
      })
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,gif}")
    .pipe(imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task('spritesmith', function() {
  var spriteData =
    gulp.src("build/img/pngsprites/**/*.png")
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css'
    }));

  spriteData.img.pipe(gulp.dest('build/img/pngsprites'));
  spriteData.css.pipe(gulp.dest('build/img/pngsprites'));
});

gulp.task("symbols", function() {
  return gulp.src("build/img/svgsprites/*.svg")
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("svgsprite.svg"))
    .pipe(gulp.dest("build/img/svgsprites"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/"
  });

  gulp.watch("less/**/*.less", ["style"]);
  gulp.watch("*.html", ["html:update"]);
});

gulp.task("build", function(fn) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "spritesmith",
    "symbols",
    fn
  );
});

gulp.task("copy", function() {
  return gulp.src([
      "fonts/**/*.{woff,woff2}",
      "img/**",
      "js/**",
      "*.html"
    ], {
      base: "."
    })
    .pipe(gulp.dest("build"));
});

gulp.task("clean", function() {
  return del("build");
});
