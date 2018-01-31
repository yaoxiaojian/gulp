const gulp = require('gulp');
const gulpif = require('gulp-if');
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const saveLicense = require('uglify-save-license');
const gulpFilter = require('gulp-filter');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const del = require('del');
const jsonminify = require('gulp-jsonminify');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const usemin = require('gulp-usemin');
const sass = require('gulp-sass');
const px2rem = require('gulp-px3rem');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('html', function() {
  return gulp.src(['src/*.html'])
    .pipe(usemin({
      scss: [sass({
        outputStyle: 'compressed'
      }), autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }), px2rem({
        remUnit: 40,
        remPrecision: 6
      })],
      css: [cleanCss(), autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }), px2rem({
        remUnit: 40,
        remPrecision: 6
      })],
      js: [babel({
        presets: ['env']
      }), uglify()],
      html: [htmlmin({
        collapseWhitespace: true
      })],
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*.{jpg,png,gif}')
    .pipe(imagemin([
      pngquant({
        quality: '20-80',
        verbose: true
      })
    ]))
    .on('error', function(err) {
      console.error(err.toString());
    })
    .pipe(gulp.dest('dist/img'));
});

gulp.task('json', function() {
  return gulp.src('src/**/*.json')
    .pipe(jsonminify())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
  del.sync(['dist']);
});

gulp.task('music', function() {
  return gulp.src(['src/font/*', 'src/*.mp3', 'src/**/*.svg', 'src/**/*.mp4'], {
      base: 'src'
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
  return gulp.src('src/js/main.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: "./src"
  });
  gulp.watch("src/css/*.scss", ['sass']);
  gulp.watch("src/*.html").on('change', reload);
});

gulp.task('sass', function() {
  return gulp.src('src/css/*.scss')
    .pipe(sass({
      sourcemap: true,
      includePaths: ['scss']
    }))
    .pipe(px2rem({
      remUnit: 40,
      remPrecision: 6
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCss())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});


gulp.task('build', ['clean', 'html', 'images', 'json', 'music']);
gulp.task('default', ['html']);