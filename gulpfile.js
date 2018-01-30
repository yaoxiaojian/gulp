var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    saveLicense = require('uglify-save-license'),
    gulpFilter = require('gulp-filter'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    jsonminify = require('gulp-jsonminify'),
    eslint = require('gulp-eslint');
    sass = require('gulp-sass');
    babel = require('gulp-babel');

gulp.task('html', function() {
    var cssFilter = gulpFilter(['**/*.css'], {restore: true});
    var jsFilter = gulpFilter(['**/*.js', '!libs.js'], {restore: true});
    var htmlFilter = gulpFilter(['*.html'], {restore: true});

    var htmlOpt = {
        collapseWhitespace: true
    };

    return gulp.src(['src/*.html', '!src/testdrive.html'])
        .pipe(useref())
        .pipe(gulpif('*.js', babel({presets: ['env']})))
        .pipe(gulpif('*.scss', sass().on('error', sass.logError)))
        .pipe(gulpif('*.css', cleanCss()))
        .pipe(gulpif('*.html', htmlmin(htmlOpt)))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('src/img/**/*.{jpg,png,gif}')
        .pipe(imagemin([
            //mozjpeg({quality: 60}),
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
