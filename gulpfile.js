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

gulp.task('html', function() {
    return gulp.src(['src/*.html'])
        // .pipe(useref())
        // .pipe(gulpif('*.js', babel()))
        // .pipe(gulpif('*.css', cleanCss()))
        // .pipe(gulpif('*.css', autoprefixer({browsers: ['last 2 versions'],cascade: false})))
        // .pipe(gulpif('*.html', htmlmin(htmlOpt)))
        .pipe(usemin({
          scss: [ sass({outputStyle: 'compressed'}) ,autoprefixer({browsers: ['last 2 versions'],cascade: false})],
          css: [ cleanCss(),autoprefixer({browsers: ['last 2 versions'],cascade: false})],
          js: [ babel({presets: ['env']}),uglify() ],
          html: [ htmlmin({ collapseWhitespace: true }) ],
          // inlinejs: [babel() ],
          // inlinecss: [ sass(), 'concat' ]
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*.{jpg,png,gif}')
        .pipe(imagemin([
            pngquant({quality: '20-80', verbose: true})
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
    return gulp.src(['src/font/*', 'src/*.mp3', 'src/**/*.svg', 'src/**/*.mp4'], {base: 'src'})
        .pipe(gulp.dest('dist'));
});

gulp.task('test', function() {
    return gulp.src('src/js/main.js')
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('build', ['clean', 'html', 'images', 'json', 'music']);
gulp.task('default', ['html']);
