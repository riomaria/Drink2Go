const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const htmlmin = require("gulp-htmlmin");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const terser = require("gulp-terser");
const squoosh = require("gulp-libsquoosh");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
};

exports.html = html;

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest("build/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// JS

const script = () => {
  return gulp.src("source/js/**/*.js")
    .pipe(terser())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
};

exports.script = script;

// IMAGES OPTIMAZE

const optimazeImages = (done) => {
  gulp.src([
    "source/img/**/*.{jpg,svg,png}",
    "!source/img/favicons/*.{svg,png}",
    "!source/img/icons/*.svg",
    "!source/img/pp/*.jpg"
  ], {
    base: "source"
  })
    .pipe(squoosh())
    .pipe(gulp.dest("build"))
  done();
};

exports.optimazeImages = optimazeImages;

// IMAGES COPY

const copyImages = (done) => {
  gulp.src([
    "source/img/**/*.{jpg,svg,png}",
    "!source/img/favicons/*.{svg,png}",
    "!source/img/icons/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
};

exports.copyImages = copyImages;

// WEBP

const createWebp = (done) => {
  gulp.src([
    "source/img/**/*.{jpg,png}",
    "!source/img/icons/*.svg",
    "!source/img/favicons/*.{svg,png}"
  ], {
    base: "source"
  })
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build"))
  done();
};

exports.createWebp = createWebp;

// SPRITE

const sprite = () => {
  return gulp.src("source/img/icons/*.svg")
    .pipe(squoosh())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"))
}
exports.sprite = sprite;

// COPY

const copyResource = (done) => {
  gulp.src([
    "source/css/normalize.min.css",
    "source/css/style.css.map",
    "source/manifest.webmanifest",
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/Readme.md",
    "source/img/favicons/*.{svg,png}",
    "source/leaflet/**/*.*",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
};

exports.copyResource = copyResource;

// CLEAN

const clean = (done) => {
  del("build");
  done();
};

// SERVER

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

const reload = (done) => {
  sync.reload();
  done();
};

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/js/**/*.js", gulp.series(script));
};

// BUILD

const build = gulp.series(
  clean,
  copyResource,
  optimazeImages,
  gulp.parallel(
    html,
    styles,
    script,
    sprite,
    createWebp
  ),
);

exports.build = build;

// DEFAULT

exports.default = gulp.series(
  styles, html, script, server, watcher
);

